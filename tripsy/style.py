from typing import List, Dict

# Builds a short directive from memory (age/vibe-aware), plus strict format rules.
def build_style_directive(history: List[Dict]) -> str:
    tone = "neutral, warm"
    # naive heuristics to pick a tone; expand later
    for rec in reversed(history[-10:]):
        if rec.get("role") == "user":
            txt = (rec.get("content") or "").lower()
            if any(w in txt for w in ["bro", "lol", "vibe", "genz"]):
                tone = "Gen Z, lively but concise"
                break
            if any(w in txt for w in ["business", "meeting", "formal"]):
                tone = "professional, succinct"
                break

    return (
        "STYLE DIRECTIVE:\n"
        f"- Tone: {tone}.\n"
        "- Format: no lists, no bullets, no asterisks, no markdown headings. "
        "Answer in 3–5 crisp sentences. Keep it conversational and human, like a great concierge.\n"
        "- Never use •, -, *, or numbered lists. No emoji.\n"
        "- Keep facts grounded; if unsure, say so briefly.\n"
    )
