import html, requests
from urllib.parse import quote_plus
from bs4 import BeautifulSoup

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari"

def _fetch_ddg_html(query: str, max_results: int = 5):
    # Use the "html.duckduckgo.com" mirror which is more scraper-friendly
    url = f"https://html.duckduckgo.com/html/?q={quote_plus(query)}"
    r = requests.get(url, headers={"User-Agent": UA}, timeout=15)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    out = []
    for res in soup.select(".result")[:max_results]:
        a = res.select_one(".result__a")
        s = res.select_one(".result__snippet")
        title = html.unescape(a.get_text(" ", strip=True)) if a else ""
        body  = html.unescape(s.get_text(" ", strip=True)) if s else ""
        href  = a["href"] if a and a.has_attr("href") else ""
        if title or body:
            out.append({"title": title, "body": body, "href": href})
    return out

def web_search(query: str, max_results: int = 5):
    try:
        return _fetch_ddg_html(query, max_results=max_results)
    except Exception:
        return []
