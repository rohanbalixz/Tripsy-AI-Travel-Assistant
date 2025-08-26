import re, requests
from bs4 import BeautifulSoup
from readability import Document

def fetch_page_text(url: str, timeout: int = 12) -> str:
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 "
                          "(KHTML, like Gecko) Chrome Safari"
        }
        r = requests.get(url, headers=headers, timeout=timeout)
        r.raise_for_status()
        html = r.text
        # Use readability to get main article text
        doc = Document(html)
        summary_html = doc.summary(html_partial=True)
        soup = BeautifulSoup(summary_html, "lxml")
        # Remove nav/script/style
        for t in soup(["script","style","nav","footer","header","aside"]):
            t.decompose()
        text = re.sub(r"\s+", " ", soup.get_text(" ", strip=True)).strip()
        # Fallback to plain page if readability too short
        if len(text) < 400:
            soup2 = BeautifulSoup(html, "lxml")
            for t in soup2(["script","style","nav","footer","header","aside"]):
                t.decompose()
            text = re.sub(r"\s+", " ", soup2.get_text(" ", strip=True)).strip()
        return text[:12000]
    except Exception:
        return ""
