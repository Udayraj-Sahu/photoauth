import io
import base64
import numpy as np
import torch
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image
import cv2
from transformers import pipeline

MODEL_AVAILABLE = False

# ----------------------------
# ✅ Model loading with fallback
# ----------------------------
try:
    print("🔄 Loading image authenticity models...")

    try:
        vit_detector = pipeline("image-classification", model="nateraw/vit-fake-detection")
        clip_detector = pipeline("image-classification", model="nateraw/clip-fake-detection")
        MODEL_AVAILABLE = True
        print("✅ Loaded nateraw fake-detection models.")
    except Exception:
        print("⚠️ Falling back to base ViT + CLIP models...")
        vit_detector = pipeline("image-classification", model="google/vit-base-patch16-224")
        clip_detector = pipeline("image-classification", model="openai/clip-vit-base-patch32")
        MODEL_AVAILABLE = True
        print("✅ Loaded fallback models.")

    # Also load ResNet for Grad-CAM visualization
    cam_model = models.resnet50(pretrained=True)
    cam_model.eval()
    print("✅ Loaded ResNet50 for Grad-CAM heatmap.")

except Exception as e:
    print(f"🚫 Model load error: {e}")
    vit_detector = clip_detector = cam_model = None
    MODEL_AVAILABLE = False


# ----------------------------
# 🧠 Image Transform
# ----------------------------
def preprocess_image(image: Image.Image):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225]),
    ])
    return transform(image).unsqueeze(0)


# ----------------------------
# 🔥 Grad-CAM Generation
# ----------------------------
def generate_gradcam(image: Image.Image):
    try:
        img_tensor = preprocess_image(image)
        img_tensor.requires_grad = True

        # Hook feature maps
        features = []
        gradients = []

        def forward_hook(module, inp, out):
            features.append(out)

        def backward_hook(module, grad_in, grad_out):
            gradients.append(grad_out[0])

        target_layer = cam_model.layer4[-1]
        target_layer.register_forward_hook(forward_hook)
        target_layer.register_backward_hook(backward_hook)

        outputs = cam_model(img_tensor)
        score, idx = outputs.max(1)
        cam_model.zero_grad()
        score.backward()

        grads = gradients[0]
        fmap = features[0]
        weights = torch.mean(grads, dim=(2, 3), keepdim=True)
        cam = torch.sum(weights * fmap, dim=1).squeeze().detach().cpu()
        cam = torch.relu(cam)

        # Normalize & overlay
        cam = (cam - cam.min()) / (cam.max() + 1e-6)
        cam = cv2.resize(cam.numpy(), (image.width, image.height))
        heatmap = np.uint8(255 * cam)
        heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        overlay = np.array(image)[:, :, ::-1]
        blended = cv2.addWeighted(overlay, 0.6, heatmap_color, 0.4, 0)

        # Convert to base64 for frontend
        _, buffer = cv2.imencode(".jpg", blended)
        b64 = base64.b64encode(buffer).decode("utf-8")
        return b64

    except Exception as e:
        print(f"⚠️ Grad-CAM generation failed: {e}")
        return None


# ----------------------------
# 🚀 Main prediction
# ----------------------------
def predict_image(image_bytes: bytes):
    if not MODEL_AVAILABLE:
        return {
            "available": False,
            "label": "Model Not Loaded",
            "confidence": 0.0,
            "models": {},
        }

    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        vit_pred = vit_detector(image)[0]
        clip_pred = clip_detector(image)[0]

        vit_conf = float(vit_pred["score"]) * 100
        clip_conf = float(clip_pred["score"]) * 100
        avg_conf = (vit_conf + clip_conf) / 2

        label = "Authentic" if avg_conf > 50 else "AI/Edited"

        gradcam_b64 = generate_gradcam(image)

        return {
            "available": True,
            "label": label,
            "confidence": round(avg_conf, 2),
            "models": {
                "vit_conf": round(vit_conf, 2),
                "clip_conf": round(clip_conf, 2),
            },
            "gradcam": gradcam_b64,
        }

    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return {
            "available": False,
            "label": "Prediction Error",
            "confidence": 0.0,
            "models": {},
        }
