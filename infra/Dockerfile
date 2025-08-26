# syntax=docker/dockerfile:1
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl && \
    rm -rf /var/lib/apt/lists/*

# Requirements (both root and backend)
COPY requirements.txt /app/requirements.txt
COPY backend/requirements.txt /app/backend-requirements.txt

RUN pip install --upgrade pip && \
    pip install -r /app/backend-requirements.txt && \
    pip install -r /app/requirements.txt

# App code
COPY . /app

# Runtime env
ENV MILVUS_HOST=milvus \
    MILVUS_PORT=19530 \
    MILVUS_COLLECTION=tripsy_docs \
    OLLAMA_BASE=http://ollama:11434 \
    APP_HOST=0.0.0.0 \
    APP_PORT=8012

EXPOSE 8012
CMD ["uvicorn", "tripsy.main:app", "--host", "0.0.0.0", "--port", "8012"]
