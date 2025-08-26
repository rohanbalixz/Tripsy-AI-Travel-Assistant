import re

_BULLET_LINE = re.compile(r'^(?:\s*[\*\-]\s+)(.+)$', re.MULTILINE)
_EXCESS_WS = re.compile(r'[ \t]+\n')  # trailing spaces
_MULTI_NL  = re.compile(r'\n{3,}')    # 3+ newlines

def clean_bullets(text: str) -> str:
    if not text:
        return text
    # Convert leading "*" or "-" bullets into "•"
    text = _BULLET_LINE.sub(lambda m: f"• {m.group(1).rstrip()}", text)
    # Tidy: remove trailing spaces and collapse excessive blank lines
    text = _EXCESS_WS.sub('\n', text)
    text = _MULTI_NL.sub('\n\n', text)
    # Trim outer whitespace
    return text.strip()
