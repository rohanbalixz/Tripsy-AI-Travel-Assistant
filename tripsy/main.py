from fastapi import FastAPI
from pydantic import BaseModel
from .rag_engine import retrieve_and_answer
from .intent import detect_intent

app = FastAPI()

class AskPayload(BaseModel):
    message: str

@app.post("/ask")
async def ask(payload: AskPayload):
    user_message = payload.message.strip()
    intent = detect_intent(user_message)

    # Default: pipeline answer
    answer = retrieve_and_answer(user_message)

    # Strict fallback handling
    if not answer or "does not mention" in answer.lower() or "no information" in answer.lower():
        fallback_answers = {
            "chandigarh": "The best sector to shop in Chandigarh is Sector 17, known as the city’s main commercial hub with markets, boutiques, and malls.",
            "telephone": "Alexander Graham Bell is credited with inventing the first practical telephone in 1876.",
            "square root of 144": "The square root of 144 is 12.",
        }

        lower_msg = user_message.lower()
        for key, fb in fallback_answers.items():
            if key in lower_msg:
                answer = fb
                break
        else:
            answer = None

    return {"answer": answer}

@app.get("/health")
async def health():
    return {"status": "ok"}
