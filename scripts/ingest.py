import os
import argparse
from typing import List

from pymilvus import (
    connections,
    FieldSchema, CollectionSchema, DataType,
    Collection, utility
)
from sentence_transformers import SentenceTransformer


COLLECTION_NAME = "tripsy_docs"
EMBED_MODEL = "nomic-ai/nomic-embed-text-v1"
EMBED_DIM = 768  # dim for nomic-embed-text-v1
MAX_TEXT_LEN = 8192  # VarChar max length in Milvus


def ensure_collection() -> Collection:
    """Create the collection + index if it doesn't exist, then return it."""
    if not utility.has_collection(COLLECTION_NAME):
        fields = [
            FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
            FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=MAX_TEXT_LEN),
            FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=EMBED_DIM),
        ]
        schema = CollectionSchema(fields=fields, description="Tripsy RAG documents")
        collection = Collection(name=COLLECTION_NAME, schema=schema)
        # Simple, free-tier friendly index; Milvus will pick defaults
        collection.create_index(
            field_name="embedding",
            index_params={"index_type": "AUTOINDEX", "metric_type": "COSINE", "params": {}},
        )
    else:
        collection = Collection(name=COLLECTION_NAME)
    return collection


def chunk_text(text: str, max_chars: int = 1200) -> List[str]:
    """Simple char-based chunking to keep under VarChar limit & improve retrieval."""
    text = text.strip()
    if not text:
        return []
    chunks = []
    for i in range(0, len(text), max_chars):
        chunk = text[i:i + max_chars]
        chunks.append(chunk)
    return chunks


def embed_and_ingest(data_dir: str):
    # Connect to Milvus
    connections.connect(alias="default", host="127.0.0.1", port="19530")

    # Ensure collection exists
    collection = ensure_collection()

    # Load embedding model
    model = SentenceTransformer(EMBED_MODEL, trust_remote_code=True)

    all_chunks: List[str] = []
    # Collect chunks from files
    for root, _, files in os.walk(data_dir):
        for fname in files:
            file_path = os.path.join(root, fname)
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    text = f.read()
            except Exception as e:
                print(f"[skip] Could not read {file_path}: {e}")
                continue

            # Make chunks
            chunks = chunk_text(text)
            if not chunks:
                continue

            all_chunks.extend(chunks)

    if not all_chunks:
        print("No text chunks found to ingest.")
        return

    # Embed in batches
    BATCH = 64
    inserted = 0
    for start in range(0, len(all_chunks), BATCH):
        batch_texts = all_chunks[start:start + BATCH]
        embeddings = model.encode(batch_texts, batch_size=32, show_progress_bar=False, normalize_embeddings=True)
        # Insert: order of fields must match schema (excluding auto_id primary key)
        mr = collection.insert([batch_texts, embeddings.tolist()])
        inserted += len(batch_texts)

    collection.flush()
    try:
        collection.load()
    except Exception:
        pass

    print(f"Ingestion completed. Inserted {inserted} chunks into '{COLLECTION_NAME}'.")
    print("You can now query Milvus-backed RAG in Tripsy.")
    

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=str, required=True, help="Path to data folder")
    args = parser.parse_args()
    embed_and_ingest(args.data)
