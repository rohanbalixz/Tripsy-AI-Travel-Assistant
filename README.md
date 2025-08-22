# Tripsy AI Travel Assistant ✈️

![WORKFLOW](workflow.png)

Tripsy is an **AI-powered travel assistant** that helps users plan trips, discover destinations, and generate personalized itineraries.  
It integrates **local LLMs (Ollama + LLaMA 3.1)** with a **FastAPI backend** and a **Next.js frontend**, using **DuckDuckGo Web Search RAG** for up-to-date travel recommendations.

---

## Features
- Interactive **chat-based travel assistant**
- **Web search integration** for live information (DuckDuckGo)
- **Retrieval-Augmented Generation (RAG)** pipeline for contextual accuracy
- **Local LLM inference** via Ollama (`llama3.1:8b-instruct`)
- **Fallback answers** for common FAQs
- **Frontend**: Next.js (React, TailwindCSS)
- **Backend**: FastAPI with Uvicorn
- **Deployment-ready** for cloud (AWS S3, Lambda, etc.)

---

## Tech Stack
### Backend
- **FastAPI** (Python)
- **Uvicorn** (ASGI server)
- **RAG Engine** (custom pipeline)
- **DuckDuckGo Search API**
- **Ollama local LLM**

### Frontend
- **Next.js 14**
- **React**
- **TailwindCSS**
- **TypeScript**

### Models
- **llama3.1:8b-instruct-q4_K_M** (Ollama)
- **Mistral 7B Instruct** (optional)
- **Nomic-Embed** for embeddings

---

## Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/rohanbalixz/Tripsy-AI-Travel-Assistant.git
cd Tripsy-AI-Travel-Assistant
```

### 2. Backend Setup (FastAPI)
```bash
cd tripsy
python -m venv .venv
source .venv/bin/activate   # Mac/Linux
.venv\Scripts\activate    # Windows

pip install -r requirements.txt
uvicorn tripsy.main:app --reload --host 127.0.0.1 --port 8012
```

### 3. Frontend Setup (Next.js)
```bash
cd tripsy-neo
npm install
npm run dev
```

Frontend runs on [http://localhost:3000](http://localhost:3000)  
Backend runs on [http://127.0.0.1:8012](http://127.0.0.1:8012)

---

## Project Structure
```
Tripsy-AI-Travel-Assistant/
├── tripsy/                # Backend (FastAPI + RAG + LLM)
│   ├── brain.py           # Core LLM calls
│   ├── rag_engine.py      # Retrieval-Augmented Generation pipeline
│   ├── web_search.py      # DuckDuckGo integration
│   ├── intent.py          # Intent classification
│   ├── main.py            # FastAPI entrypoint
│   └── ...
├── tripsy-neo/            # Frontend (Next.js + React)
│   ├── app/
│   │   ├── api/ask/route.ts  # API integration
│   │   ├── page.tsx         # UI
│   │   ├── layout.tsx       # Layout wrapper
│   │   └── globals.css      # Styling
├── README.md
└── requirements.txt
```

---

## Example Queries
```bash
curl -X POST http://127.0.0.1:8012/ask   -H "Content-Type: application/json"   -d '{"message":"Best sector to shop in Indore?"}'

curl -X POST http://127.0.0.1:8012/ask   -H "Content-Type: application/json"   -d '{"message":"2-day romantic plan in Malta with rough costs (EUR)?"}'
```

---

## Future Enhancements
- Add **flight & hotel booking APIs**
- Multi-lingual support
- Voice interaction
- Advanced personalization with user profiles

---

## License
MIT License © 2025 [Rohan Bali](https://github.com/rohanbalixz)
