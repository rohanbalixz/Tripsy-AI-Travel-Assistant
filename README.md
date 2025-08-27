# 🚀 Tripsy AI Travel Assistant

An AI-powered travel companion that combines **FastAPI** (backend) and **Next.js** (frontend) to deliver real-time conversational trip planning, personalized recommendations, and contextual memory.

---

## ⚡ Quick Start (One-Liner)

```bash
# Start backend (FastAPI on port 8012) and frontend (Next.js on port 3000)
uvicorn tripsy.main:app --reload --port 8012 & NEXT_PUBLIC_TRIPSY_API="http://127.0.0.1:8012" WATCHPACK_POLLING=true npm run dev -- -p 3000
```

Backend → http://127.0.0.1:8012  
Frontend → http://127.0.0.1:3000  

---

## 🛠️ Requirements

- **Python 3.10+**
- **Node.js 18+** (we used Node v24.x in dev, but 18+ works)
- **npm** (v9+ recommended)
- Unix/macOS environment (Linux/Mac; Windows WSL2 recommended)

---

## 📂 Project Structure

```
Tripsy-AI-Travel-Assistant/
│── backend/             # FastAPI backend code
│   └── tripsy/          # Core logic (main.py, rag_engine, memory, etc.)
│── frontend/            # Next.js frontend
│   └── app/             # App Router pages and API proxy
│── requirements.txt     # Python dependencies
│── package.json         # Node.js dependencies
│── README.md            # Project documentation
```

---

## 🔧 Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/rohanbalixz/Tripsy-AI-Travel-Assistant.git
cd Tripsy-AI-Travel-Assistant
```

### 2. Backend (FastAPI)
Create a Python virtual environment and install dependencies:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

Run the FastAPI backend:
```bash
uvicorn tripsy.main:app --reload --port 8012
```

Verify it works:
```bash
curl http://127.0.0.1:8012/health
# {"status":"ok"}
```

---

### 3. Frontend (Next.js)
Navigate to frontend folder:
```bash
cd frontend
npm install
```

Run development server:
```bash
NEXT_PUBLIC_TRIPSY_API="http://127.0.0.1:8012" WATCHPACK_POLLING=true npm run dev
```

Open: [http://127.0.0.1:3000](http://127.0.0.1:3000)

---

## 🧪 Example Usage

```bash
curl -s -X POST http://127.0.0.1:8012/ask   -H "Content-Type: application/json"   -d '{"message":"Hi, I am 27yo and my name is Rohan"}'
```

Response:
```json
{"answer":"Hi Rohan! At 27, you're at the perfect age for adventure..."}
```

---

## 🌟 Features

- Conversational AI with **contextual memory**
- **RAG (Retrieval-Augmented Generation)** with fallback answers
- **Health checks** for backend monitoring
- Full-stack integration: **FastAPI + Next.js**
- Extensible: can plug in external APIs, LLMs, or Milvus/Chroma for vector search

---

## 📈 Roadmap

- [ ] Add Docker support
- [ ] Deploy to AWS/GCP
- [ ] Add user authentication
- [ ] Improve UI with animations and maps

---

## 👨‍💻 Author

Built by **Rohan Bali**  
M.S. Data Science @ University of Massachusetts Dartmouth

LinkedIn: [Rohan Bali](https://linkedin.com/in/rohanbali)  
GitHub: [rohanbalixz](https://github.com/rohanbalixz)

---

## 📜 License
MIT License
