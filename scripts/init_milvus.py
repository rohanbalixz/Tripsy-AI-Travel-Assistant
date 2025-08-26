from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility

# Connect to local Milvus (Docker mapped to 19530)
connections.connect("default", host="127.0.0.1", port="19530")

COLLECTION_NAME = "tripsy_chunks"

# Drop existing collection if you're iterating
if utility.has_collection(COLLECTION_NAME):
    utility.drop_collection(COLLECTION_NAME)

# Schema: text chunk + 768-dim embedding (works with free nomic-embed-text)
fields = [
    FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
    FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=8192),
    FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=768),
]
schema = CollectionSchema(fields, description="Tripsy AI RAG chunks")

col = Collection(name=COLLECTION_NAME, schema=schema)

# Index for fast ANN search (HNSW = good default)
index_params = {
    "index_type": "HNSW",
    "metric_type": "IP",
    "params": {"M": 16, "efConstruction": 200}
}
col.create_index(field_name="embedding", index_params=index_params)

# Load into memory
col.load()
print(f"Initialized Milvus collection: {COLLECTION_NAME}")
