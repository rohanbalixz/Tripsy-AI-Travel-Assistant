import os, re
from typing import Any, List, Dict, Optional
from fastapi import FastAPI
from pydantic import BaseModel
from .rag_engine import retrieve_and_answer
from .memory import remember, recall

app = FastAPI()

def _load_system_prompt() -> str:
    path = os.path.join(os.path.dirname(__file__), "prompt.txt")
    try:
        with open(path, "r", encoding="utf-8") as f:
            txt = f.read().strip()
            return txt or "You are Tripsy."
    except Exception:
        return "You are Tripsy."

SYS_PROMPT = _load_system_prompt()

def _to_chatty(text: str, max_sentences: int = 6) -> str:
    if not text:
        return text
    raw = text.replace("\r\n", "\n").replace("\r", "\n")
    # strip leading list bullets/numbering
    lines = []
    for ln in raw.split("\n"):
        ln = re.sub(r'^\s*(?:[-*•]+|\d+\.)\s*', '', ln)
        lines.append(ln)
    raw = " ".join(lines)
    # remove markdown noise
    raw = raw.replace("**", "").replace("*", "").replace("`", "")
    raw = re.sub(r'\s*•\s*', ' ', raw)
    raw = re.sub(r'\s+', ' ', raw).strip()
    parts = re.split(r'(?<=[.!?])\s+', raw)
    return " ".join(parts[:max_sentences]).strip()

class AskPayload(BaseModel):
    message: str
    history: Optional[List[Dict[str, Any]]] = None
    session_id: Optional[str] = None

@app.get("/health")
async def health():
    return {"ok": True}

@app.post("/ask")
async def ask(payload: AskPayload):
    user_msg = (payload.message or "").strip()
    sid = payload.session_id or "web-ui"
    hist = payload.history or []

    # stitch memory + provided history
    mem = recall(sid, limit=24)
    convo_lines: List[str] = []
    for m in (mem + hist):
        role = (m.get("role") or "user").lower()
        content = (m.get("content") or m.get("message") or "").strip()
        if not content:
            continue
        speaker = "User" if role == "user" else "Assistant"
        convo_lines.append(f"{speaker}: {content}")
    convo_lines.append(f"User: {user_msg}")
    convo_text = "\n".join(convo_lines[-24:])

    stitched = f"""SYSTEM PROMPT:
{SYS_PROMPT}

CONVERSATION (most recent last):
{convo_text}

Assistant, respond as Tripsy. Be concise, warm, and avoid markdown bullets.
Answer:"""

    # use your RAG/LLM with the stitched prompt
    answer = retrieve_and_answer(stitched)
    answer = _to_chatty(answer, max_sentences=6)

    # persist memory
    remember(sid, "user", user_msg)
    remember(sid, "assistant", answer)

    return {"answer": answer}
