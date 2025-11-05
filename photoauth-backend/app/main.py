from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
import os
import time
import requests
from pydantic import BaseModel
from fastapi import BackgroundTasks
from datetime import datetime

from app.services.model_inference import predict_image, MODEL_AVAILABLE
from app.services.metadata import extract_metadata
from app.services.ela import ela_score


app = FastAPI(title="PhotoAuth Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

STATS = {
    "total_images": 0,
    "avg_time": 0.0,
    "accuracies": [],
    "last_update": datetime.utcnow().isoformat(),
}

@app.get("/")
def root():
    return {"status": "ok", "model_available": MODEL_AVAILABLE}


def _combine_scores(model_result: Dict, metadata_result: Dict, ela_result: Dict) -> Dict:
    ela = float(ela_result.get("ela_score", 0.5))
    meta_penalty = 0.0

    # Reward EXIF presence slightly; penalize editing software
    meta_base = 0.9 if metadata_result.get("exif_present") else 0.5
    if metadata_result.get("possible_edit"):
        meta_penalty = 0.35
    metadata_score = max(min(meta_base - meta_penalty, 1.0), 0.0)

    if model_result.get("available"):
        label = (model_result.get("label") or "").lower()
        conf = float(model_result.get("confidence", 0.0)) / 100.0

        # Model authenticity interpretation
        if "authentic" in label or "real" in label:
            model_auth = conf
        elif "ai" in label or "fake" in label or "edited" in label:
            model_auth = 1.0 - conf
        else:
            model_auth = 0.5

        # Increase model importance
        w = {"model": 0.75, "metadata": 0.15, "ela": 0.10}
    else:
        model_auth = 0.5
        w = {"model": 0.0, "metadata": 0.4, "ela": 0.6}

    score = (
        w["model"] * model_auth +
        w["metadata"] * metadata_score +
        w["ela"] * ela
    )

    score = max(min(score, 1.0), 0.0)

    # Tighter thresholds for AI
    if score >= 0.80:
        final_label = "Authentic"
    elif score >= 0.60:
        final_label = "Possibly Edited"
    else:
        final_label = "AI/Edited"

    return {"score": round(score, 2), "final_label": final_label}


@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    start = time.time()

    data = await file.read()
    save_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(save_path, "wb") as f:
        f.write(data)

    model_result = predict_image(data)
    metadata_result = extract_metadata(data)
    ela_result = ela_score(data)
    combined = _combine_scores(model_result, metadata_result, ela_result)

    duration = time.time() - start

    # ✅ Update backend stats asynchronously
    background_tasks.add_task(update_stats, duration, combined["score"])

    return {
        "filename": file.filename,
        "final_label": combined["final_label"],
        "authenticity_score": combined["score"],
        "model": model_result,
        "metadata": metadata_result,
        "ela": ela_result,
    }


class UrlIn(BaseModel):
    url: str



@app.post("/analyze/url")
def analyze_url(inp: UrlIn):
    print(f"📩 Received URL: {inp.url}")

    # Validate and download the image
    try:
        resp = requests.get(inp.url, timeout=10)
        resp.raise_for_status()
        data = resp.content
    except Exception as e:
        return {"error": True, "message": f"Could not fetch image: {str(e)}"}

    # Analyze image
    model_result = predict_image(data)
    metadata_result = extract_metadata(data)
    ela_result = ela_score(data)
    combined = _combine_scores(model_result, metadata_result, ela_result)

    return {
        "filename": inp.url.split("/")[-1] or "image",
        "final_label": combined["final_label"],
        "authenticity_score": combined["score"],
        "model": model_result,
        "metadata": metadata_result,
        "ela": ela_result,
    }



def update_stats(duration: float, score: float):
    """Update running averages safely after each analysis."""
    STATS["total_images"] += 1

    # running average time
    prev_total = STATS["total_images"] - 1
    STATS["avg_time"] = (
        (STATS["avg_time"] * prev_total) + duration
    ) / STATS["total_images"]

    # store accuracies (keep only last 500)
    STATS["accuracies"].append(score)
    if len(STATS["accuracies"]) > 500:
        STATS["accuracies"].pop(0)

    STATS["last_update"] = datetime.utcnow().isoformat()


@app.get("/stats")
def get_stats():
    """Return live backend statistics for frontend display."""
    if STATS["accuracies"]:
        avg_acc = sum(STATS["accuracies"]) / len(STATS["accuracies"])
    else:
        avg_acc = 0.0

    return {
        "total_images": STATS["total_images"],
        "avg_time": round(STATS["avg_time"], 2),
        "avg_accuracy": round(avg_acc * 100, 2),
        "last_update": STATS["last_update"],
    }   