import chromadb

# Connect to database
db = chromadb.PersistentClient(path="./histolocal_db")
collection = db.get_collection("izmir_locations")

# Test query
results = collection.query(query_texts=["Historical places in Izmir"], n_results=4)
print("ChromaDB Results:", results)
