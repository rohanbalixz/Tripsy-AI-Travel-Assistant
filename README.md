# 🚀 Tripsy: AI Travel Assistant

Tripsy is your **personal AI-powered travel companion** that helps you explore destinations, plan itineraries, and get personalized recommendations — all through a seamless **web + backend** setup.

---

## ✨ Features

- 🧠 **Conversational AI** with memory (remembers your name, age, and context)
- 🌍 **RAG-powered knowledge** to answer travel queries with real-world data
- 🗺️ **Globally-localized examples**
- ⚡ **FastAPI backend** serving `/ask` and `/health` endpoints
- 💻 **Next.js 15 frontend** with modern UI (React + Tailwind)
- 🔄 **End-to-End flow:** Web UI → Backend → AI Engine → Response
- 🐳 **Docker-ready** (can be containerized easily)

---

## 📂 Project Structure

```
Tripsy-AI-Travel-Assistant/
├── backend/                # FastAPI backend service
│   ├── app/
│   │   ├── main.py         # API entrypoint (/ask, /health)
│   │   ├── rag.py          # Retrieval-Augmented Generation logic
│   │   ├── requirements.txt
│   │   └── ...
│
├── tripsy/                 # Core AI assistant logic
│   ├── main.py             # Finalized AI model + memory
│   ├── memory.py           # Remember/recall session data
│   ├── rag_engine.py       # Query retrieval & response
│   └── ...
│
├── tripsy-neo/             # Frontend (Next.js 15)
│   ├── app/                # Next.js App Router (pages)
│   ├── components/         # UI components
│   ├── public/             # Static assets
│   ├── package.json
│   ├── next.config.cjs
│   └── ...
│
├── run.sh                  # Script to start backend + frontend together
├── README.md               # This file
└── .gitignore
```

---

## ⚡ Quick Start

### 1️⃣ Clone the repo
```bash
git clone https://github.com/rohanbalixz/Tripsy-AI-Travel-Assistant.git
cd Tripsy-AI-Travel-Assistant
```

### 2️⃣ Setup backend (FastAPI)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r app/requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8012 --reload
```

The backend should now be live at:
```
http://127.0.0.1:8012/health
```

### 3️⃣ Setup frontend (Next.js 15)
```bash
cd ../tripsy-neo
npm install
export NEXT_PUBLIC_TRIPSY_API="http://127.0.0.1:8012"
npm run dev -- -p 3000
```

The frontend should now be live at:
```
http://127.0.0.1:3000
```

### 4️⃣ Test API directly (optional)
```bash
curl -s -X POST http://127.0.0.1:8012/ask \
  -H "Content-Type: application/json" \
  -d '{"message":"Hi, I am Rohan, 27 yo in Boston"}'
```

---

## 🛠️ Using `run.sh` (One-command start)

We provide a helper script to start both backend & frontend together:

```bash
chmod +x run.sh
./run.sh
```

This will:
- Start backend at `http://127.0.0.1:8012`
- Start frontend at `http://127.0.0.1:3000`

---

## 📦 Deployment

- Docker-ready with minimal changes (Dockerfile included)
- Environment variables:
  - `NEXT_PUBLIC_TRIPSY_API` → Backend URL
  - `LLM_MODEL` → Model selection (default: `llama3.1:8b-instruct-q4_K_M`)
  - `RAG_SIM_THRESHOLD` → Similarity threshold for retrieval

---

## 🤝 Contributing

We welcome contributions! Please fork, create a feature branch, and submit PRs.  
Focus areas: **UI polish, better memory handling, new integrations (maps, flights, hotels).**

---

## 📜 License

MIT © 2025 [Rohan Bali](https://github.com/rohanbalixz)

---

> 🌟 Tripsy is more than a project — it's your **AI-powered travel buddy** for the future of exploration.
