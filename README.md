Absolutely ✅ Here’s a complete and professional **`README.md`** file for your **PhotoAuth** project — written for GitHub or deployment documentation.

It explains setup, backend, frontend, deployment, and model logic clearly.

---

# 🧠 PhotoAuth — AI-Powered Image Authenticity Analyzer

**PhotoAuth** is a full-stack application that detects **AI-generated or edited images** using advanced neural models, ELA (Error Level Analysis), and metadata inspection.
It provides detailed authenticity scores, visual Grad-CAM heatmaps, and live system statistics — all wrapped in a futuristic UI.

---

## 🚀 Features

✅ **AI-Powered Detection**
Analyzes every pixel using transformer-based models (e.g., ViT, CLIP) to detect AI-generated or manipulated content.

✅ **ELA (Error Level Analysis)**
Measures compression inconsistencies to highlight image tampering.

✅ **Metadata Analysis**
Checks EXIF data, editing software, and possible manipulation traces.

✅ **Grad-CAM Visualization**
Generates interpretable heatmaps showing which parts influenced the AI detector most.

✅ **Dynamic Stats Dashboard**
Real-time system metrics showing accuracy, speed, and total analyses performed.

✅ **Modern Frontend (Next.js)**
Neon-inspired, responsive design built with React + TailwindCSS + Framer Motion.

---

## 🧩 Tech Stack

### **Backend**

* **FastAPI** (Python)
* **PyTorch** for model inference
* **Pillow (PIL)** for image preprocessing
* **OpenCV** for heatmap blending
* **Requests**, **NumPy**, and **Torchvision**
* **CORS** enabled for API access
* Real-time `/stats` endpoint with live metrics

### **Frontend**

* **Next.js 14+** (React App Router)
* **TailwindCSS**
* **Framer Motion**
* **Lucide Icons**
* **Axios**
* **React-CountUp**

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/<your-username>/photoauth.git
cd photoauth
```

---

### 2️⃣ Backend Setup

#### Create and activate virtual environment:

```bash
cd photoauth-backend
python -m venv venv
venv\Scripts\activate   # Windows
# OR
source venv/bin/activate   # macOS/Linux
```

#### Install dependencies:

```bash
pip install -r requirements.txt
```

#### Run FastAPI server:

```bash
uvicorn app.main:app --reload
```

Server will start at:
👉 [http://localhost:8000](http://localhost:8000)

#### Test API:

Visit:

* `/` — health check
* `/analyze` — POST endpoint for image upload
* `/analyze/url` — POST with `{ "url": "<image_url>" }`
* `/stats` — real-time system metrics

---

### 3️⃣ Frontend Setup

#### Install dependencies:

```bash
cd ../frontend
npm install
```

#### Create `.env.local`

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Run development server:

```bash
npm run dev
```

Frontend will start at:
👉 [http://localhost:3000](http://localhost:3000)

---

## 📤 API Endpoints

| Endpoint       | Method | Description                            |
| -------------- | ------ | -------------------------------------- |
| `/`            | GET    | Backend status check                   |
| `/analyze`     | POST   | Upload image for authenticity analysis |
| `/analyze/url` | POST   | Analyze image via public URL           |
| `/stats`       | GET    | Get live performance statistics        |

### Example `/analyze/url` request:

```bash
curl -X POST http://localhost:8000/analyze/url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/image.jpg"}'
```

Response:

```json
{
  "filename": "image.jpg",
  "final_label": "AI/Edited",
  "authenticity_score": 0.42,
  "model": {
    "label": "AI Generated",
    "confidence": 91.3
  },
  "metadata": {
    "exif_present": true,
    "software": "Adobe Photoshop",
    "possible_edit": true
  },
  "ela": {
    "ela_score": 0.48
  }
}
```

---

## 📊 Live System Stats

Endpoint: `/stats`

Returns:

```json
{
  "total_images": 45,
  "avg_time": 1.35,
  "avg_accuracy": 86.74,
  "last_update": "2025-11-05T18:50:41.002Z"
}
```

Frontend auto-refreshes every **5 seconds** to display these metrics.

---

## 🧠 Model Logic Overview

| Module               | Role                                                |
| -------------------- | --------------------------------------------------- |
| `model_inference.py` | Runs ViT/CLIP detectors, returns label + confidence |
| `metadata.py`        | Extracts EXIF + editing software info               |
| `ela.py`             | Performs error-level analysis (ELA score)           |
| `gradcam.py`         | Generates Grad-CAM heatmap overlay                  |
| `main.py`            | Combines all signals into final authenticity score  |

**Score Weighting:**

```
Authenticity = 0.75 * Model + 0.15 * Metadata + 0.10 * ELA
```

---

## 🌍 Deployment Guide

### Option 1: **Render / Railway / Hugging Face Spaces**

* Deploy FastAPI as backend service (e.g. Render free tier)
* Deploy Next.js frontend on Vercel
* Set environment variable `NEXT_PUBLIC_API_URL` in Vercel to your backend URL

### Option 2: **Docker**

Create a `Dockerfile` for backend:

```Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Then:

```bash
docker build -t photoauth-backend .
docker run -p 8000:8000 photoauth-backend
```

---

## 🧪 Example Output

**Frontend UI Sections:**

* Upload or paste URL
* Live image preview
* Grad-CAM toggle heatmap
* Authenticity Score Gauge
* Model confidence breakdown (ViT, CLIP)
* Metadata insights (EXIF, software)
* Real-time statistics footer

---

## 🛡️ License

MIT License © 2025 — Udayraj Sahu

---
