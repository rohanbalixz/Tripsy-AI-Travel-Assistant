import sys
from .web_search import web_search
from .brain import generate_answer

def retrieve_and_answer(query: str) -> str:
    """
    Retrieves web context (if available) and generates a warm, human-like answer.
    No keyword hacks — fully conversational and complete.
    """
    # 🔹 Try web search for context
    ctx_lines = []
    try:
        results = web_search(query, 3)
        for r in results:
            if r.get("body"):
                ctx_lines.append(r["body"])
    except Exception as e:
        print(f"[RAG] web search error: {e}", file=sys.stderr, flush=True)

    web_ctx = "\n".join(ctx_lines[:5]) if ctx_lines else ""

    # 🔹 Enhanced system-style context
    context = (
        "You are Tripsy, a warm and interactive travel companion. "
        "Always give detailed, human-like responses in a friendly tone. "
        "If the user asks for an itinerary, make sure to cover ALL requested days clearly. "
        "Use web snippets for factual grounding, but never mention sources/links. "
        "End with a natural follow-up question or suggestion to keep the chat going.\n\n"
    )
    if web_ctx:
        context += "Here are some relevant travel notes:\n" + web_ctx

    ans = generate_answer(query, context=context)
    print(f"[RAG] generated ans len={len(ans)}", file=sys.stderr, flush=True)
    return ans
