FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# System deps (uvicorn, build tools if needed)
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    build-essential curl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Workdir
WORKDIR /app

# Copy only requirements first for layer caching
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r /app/requirements.txt

# Copy the rest of the project (backend + tripsy package)
COPY backend /app/backend
COPY tripsy  /app/tripsy

# Expose API port
EXPOSE 8012

# Environment defaults for Milvus inside docker-compose network
ENV MILVUS_HOST=milvus \
    MILVUS_PORT=19530

# Start the FastAPI app
CMD ["python", "-m", "uvicorn", "tripsy.main:app", "--host", "0.0.0.0", "--port", "8012"]
