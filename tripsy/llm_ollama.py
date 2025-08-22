import os, json, requests

OLLAMA_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434").rstrip("/")
MODEL = os.getenv("OLLAMA_MODEL", "mistral:7b-instruct")

def ollama_chat(prompt: str) -> str:
    # Streaming off for simplicity; use /api/chat for multi-turn if needed.
    resp = requests.post(f"{OLLAMA_URL}/api/generate",
                         json={"model": MODEL, "prompt": prompt, "stream": False},
                         timeout=120)
    resp.raise_for_status()
    data = resp.json()
    return data.get("response", "").strip()
