import os, requests

SYSTEM_RULES = (
    "You are a senior travel advisor at a world-class agency."
    "\n- Warm, concise, human. 2–4 sentences."
    "\n- Add concrete place anchors (areas, seasons, typical prices) when relevant."
    "\n- If snippets are provided: use to improve accuracy but never mention sources/links."
    "\n- If uncertain: be brief and propose the next step."
)

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:8b-instruct-q4_K_M")

def _ollama_generate(prompt: str) -> str:
    try:
        resp = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False,
                  "options": {"temperature": 0.6, "top_p": 0.9}},
            timeout=60,
        )
        resp.raise_for_status()
        text = (resp.json().get("response") or "").strip()
        return text
    except Exception:
        return ""

def generate_answer(question: str, context: str | None = None) -> str:
    user = (
        f"Traveler question:\n{question.strip()}\n\n"
        + (f"Useful snippets (do not cite):\n{context.strip()}\n\n" if context else "")
        + "Answer in 2–4 sentences, specific and practical."
    )
    prompt = f"<<SYS>>\n{SYSTEM_RULES}\n<</SYS>>\n\n{user}"
    out = _ollama_generate(prompt)
    if out:
        return out
    return "Sorry, I don’t have that at my fingertips. Tell me destination, dates, budget, and vibe, and I’ll tailor it fast."
