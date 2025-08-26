import re

_GREETING = re.compile(r"\b(hi+|hey+|hello|yo|hiya|hola|namaste|sup|good\s*(morning|afternoon|evening))\b", re.I)
_THANKS   = re.compile(r"\b(thanks|thank\s*you|appreciate\s*it|cheers)\b", re.I)
_CONFUSED = re.compile(r"\b(what\?|huh\?|confused|don.?t get it|not sure|explain)\b", re.I)
_SMALLTALK= re.compile(r"\b(how are you|wyd|what.?up|wassup|how.?going|tell me about you)\b", re.I)

def detect_intent(text: str) -> str:
    if not text:
        return "unknown"
    t = text.strip().lower()
    if _GREETING.search(t):
        return "greeting"
    if _THANKS.search(t):
        return "thanks"
    if _CONFUSED.search(t):
        return "confused"
    if _SMALLTALK.search(t):
        return "smalltalk"
    return "unknown"
