import re

BULLET = "•"

def _strip_md_bold(s: str) -> str:
    # remove **bold** while keeping text
    return re.sub(r"\*\*(.+?)\*\*", r"\1", s)

def _lists_to_bullets(s: str) -> str:
    # convert common markdown list starters to bullets
    #   - "• " stays as-is
    #   - "* ", "- ", "• " at line starts -> "• "
    s = re.sub(r"(?m)^(?:\s*[\-\*]\s+)", BULLET + " ", s)
    # convert numbered lists "1. ", "2) " to "• "
    s = re.sub(r"(?m)^\s*\d+[\.\)]\s+", BULLET + " ", s)
    return s

def _dedupe_bullets(s: str) -> str:
    # collapse accidental double bullets
    return re.sub(r"(?m)^(?:\s*"+re.escape(BULLET)+r"\s*){2,}", BULLET+" ", s)

def _tidy_whitespace(s: str) -> str:
    # normalize extra blank lines
    s = re.sub(r"\n{3,}", "\n\n", s.strip())
    return s

def clean_format(text: str) -> str:
    """
    Enforce: no markdown asterisks for bullets/bold. Use '• ' bullets only.
    """
    if not isinstance(text, str):
        return text
    s = text
    s = _strip_md_bold(s)
    s = _lists_to_bullets(s)
    s = _dedupe_bullets(s)
    s = _tidy_whitespace(s)
    return s
