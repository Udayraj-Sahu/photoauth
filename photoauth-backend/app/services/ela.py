import io
import numpy as np
from PIL import Image, ImageChops
import base64
import cv2


def ela_score(image_bytes: bytes):
    """
    Perform Error Level Analysis (ELA) to estimate authenticity of an image.
    Returns both a numeric ELA score and a visual heatmap (as base64 string).
    """
    try:
        # Load original image
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception:
        return {
            "ela_score": 0.5,
            "note": "Could not open image; returning neutral.",
            "ela_overlay": None,
        }

    try:
        # Re-save the image as JPEG (lower quality to reveal compression inconsistencies)
        temp_io = io.BytesIO()
        image.save(temp_io, "JPEG", quality=90)
        temp_io.seek(0)
        resaved = Image.open(temp_io).convert("RGB")

        # Compute pixel-wise difference
        diff = ImageChops.difference(image, resaved)
        diff_np = np.asarray(diff).astype("float32")

        # Compute ELA metrics
        max_val = float(diff_np.max()) if diff_np.size else 1.0
        mean_val = float(diff_np.mean()) if diff_np.size else 0.0

        # Authenticity score: higher = more uniform = more authentic
        score = 1.0 - (mean_val / (max_val + 1e-6))
        score = min(max(score, 0.0), 1.0)

        # ---- Create visual overlay (heatmap) ----
        diff_norm = (
            255 * diff_np / (diff_np.max() + 1e-6)
        ).astype(np.uint8)  # normalize 0–255
        heatmap = cv2.applyColorMap(diff_norm, cv2.COLORMAP_JET)
        heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

        # Blend original and heatmap (for visualization)
        orig_np = np.asarray(image)
        blended = cv2.addWeighted(orig_np, 0.6, heatmap, 0.4, 0)

        # Convert blended image to base64
        _, buffer = cv2.imencode(".jpg", cv2.cvtColor(blended, cv2.COLOR_RGB2BGR))
        ela_overlay = base64.b64encode(buffer).decode("utf-8")

        return {
            "ela_score": round(score, 2),
            "ela_overlay": ela_overlay,
        }

    except Exception as e:
        print("ELA computation failed:", e)
        return {
            "ela_score": 0.5,
            "note": f"ELA failed: {str(e)}",
            "ela_overlay": None,
        }
