from __future__ import annotations
import json, time
from pathlib import Path
from typing import List, Dict, Any

DATA_DIR = Path(__file__).with_name("data")
DATA_DIR.mkdir(parents=True, exist_ok=True)
MEM_PATH = DATA_DIR / "memory.jsonl"

def remember(session_id: str, role: str, content: str) -> None:
    rec = {
        "ts": time.time(),
        "session_id": session_id,
        "role": role,
        "content": (content or "").strip(),
    }
    with open(MEM_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")

def recall(session_id: str, limit: int = 20) -> List[Dict[str, Any]]:
    if not MEM_PATH.exists():
        return []
    rows: List[Dict[str, Any]] = []
    with open(MEM_PATH, "r", encoding="utf-8") as f:
        for line in f:
            try:
                rec = json.loads(line)
                if rec.get("session_id") == session_id:
                    rows.append(rec)
            except Exception:
                continue
    return rows[-limit:]
