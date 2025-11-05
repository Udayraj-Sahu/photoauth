from PIL import Image
import io

def ensure_image(file_bytes: bytes):
    try:
        img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        return img
    except Exception:
        return None
