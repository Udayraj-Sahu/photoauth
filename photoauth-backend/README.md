# PhotoAuth Backend (FastAPI)

A production-ready backend for **PhotoAuth** — an AI-powered image authenticity detector.

## Features
- Upload image (multipart) and analyze
- EXIF/metadata extraction (Photoshop traces)
- Error Level Analysis (ELA) heuristic
- Optional AI model inference (PyTorch) — plug your trained `.pt` file at `models/photoauth_resnet50.pt`
- CORS enabled (ready for your frontend)
- Dockerfile included

## Quick Start

### 1) Python (local)
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Then test:
```bash
curl -X POST "http://127.0.0.1:8000/analyze" -F "file=@tests/sample.jpg"
```

### 2) Docker
```bash
docker build -t photoauth-backend .
docker run -p 8000:8000 -v $(pwd)/uploads:/app/uploads photoauth-backend
```

### 3) Model
- Put your trained torch weights at: `models/photoauth_resnet50.pt` (ResNet50 classifier with 3 classes: Real, Edited, AI-Generated).
- If the file is missing, the backend runs in **Demo Mode** (uses metadata + ELA only).

## API
- `GET /` — health
- `POST /analyze` — multipart file upload (field: `file`)
- `POST /analyze/url` — JSON `{ "url": "https://..." }`

**Response example:**
```json
{
  "filename": "image.jpg",
  "final_label": "Possibly Edited",
  "authenticity_score": 0.68,
  "model": {"available": true, "label": "AI-Generated", "confidence": 81.3},
  "metadata": {"exif_present": true, "software": "adobe photoshop 25.1", "possible_edit": true},
  "ela": {"ela_score": 0.72}
}
```

## Notes
- ELA score is a heuristic in [0..1] where higher ≈ more authentic compression uniformity.
- Thresholds in `app/main.py` can be tuned: 0.75 (Authentic), 0.55 (Possibly Edited).

---

© 2025 PhotoAuth.
