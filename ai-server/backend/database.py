import chromadb

# Initialize vector database
db = chromadb.PersistentClient(path="./histolocal_db")
collection = db.get_or_create_collection("izmir_locations")

# Store historical locations
collection.add(
    documents=[
        "Konak Square is the main hub of Izmir, a great starting point for tourists.",
        "Agora of Smyrna is an ancient Roman marketplace, located near Konak.",
        "Kadifekale is a fortress with amazing views, about 15 minutes from Konak by taxi.",
        "Izmir Clock Tower is a famous landmark in Konak Square.",
        "Kordon is a beautiful waterfront area, reachable in 15 minutes from Alsancak.",
        "Ephesus is an ancient city near Izmir, known for its well-preserved ruins."
    ],
    ids=["1", "2", "3", "4", "5", "6"]
)

print("Historical sites stored in ChromaDB ✅")
