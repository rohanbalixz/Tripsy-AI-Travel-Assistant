import os
from fastapi import FastAPI, Request
from pydantic import BaseModel
from ollama import Client
from backend.app import rag  # our RAG helper

app = FastAPI()

# --- RAG relevance threshold (configurable) ---
# Use RAG_SIM_THRESHOLD (preferred) or fallback to RAG_MIN_SIM. Default 0.75.
_RAG_SIM_THRESHOLD = float(os.getenv("RAG_SIM_THRESHOLD", os.getenv("RAG_MIN_SIM", "0.75")))

def _filter_and_flatten_chunks(chunks, threshold=_RAG_SIM_THRESHOLD):
    """
    Accepts list of strings or dicts like {"text": ..., "score": ...} (or {"text": ..., "distance": ...} for COSINE).
    Returns: list[str] of texts with score >= threshold. If no scores present, returns all texts.
    """
    kept = []
    any_scores = False
    for ch in chunks or []:
        if isinstance(ch, dict):
            txt = ch.get("text", "")
            score = ch.get("score")
            if score is None and "distance" in ch:
                # For COSINE in Milvus: similarity ~= 1 - distance
                try:
                    score = 1.0 - float(ch["distance"])
                except Exception:
                    score = None
            if score is not None:
                any_scores = True
                if score >= threshold:
                    if txt:
                        kept.append(txt)
            else:
                if txt:
                    kept.append(txt)
        else:
            kept.append(str(ch))
    # If we did have scores and nothing passed the threshold, return empty to force no-context fallback
    if any_scores and not kept:
        return []
    # Dedup + strip
    out = []
    seen = set()
    for t in kept:
        t = t.strip()
        if t and t not in seen:
            seen.add(t)
            out.append(t)
    return out
ollama_client = Client()

class UserMessage(BaseModel):
    message: str

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/ask")
async def ask(user_message: UserMessage):
    query = user_message.message

    # 🔍 Step 1: Retrieve relevant chunks from Milvus
    context_chunks = rag.search_chunks(query)
    context = "\n".join([c.get("text", str(c)) if isinstance(c, dict) else str(c) for c in context_chunks])

    # 🧠 Step 2: Build augmented prompt
    augmented_prompt = f"Context:\n{context}\n\nUser question: {query}\n\nAnswer:"

    # 🤖 Step 3: Send to LLM
    response = ollama_client.chat(
        model=os.getenv("LLM_MODEL", "llama3.1:8b-instruct-q4_K_M"),
        messages=[{"role": "user", "content": augmented_prompt}],
    )

    return {"answer": response["message"]["content"]}
