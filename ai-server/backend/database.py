import chromadb

client = chromadb.PersistentClient(path="./histolocal_db")
collection = client.get_or_create_collection("izmir_locations")

# Clear existing for testing (optional)
# collection.delete()

# Example data
historical_sites = [
    "Agora of Smyrna is an ancient Roman marketplace near Konak.",
    "Ephesus was a major Greek city with well-preserved ruins.",
    "Çeşme is a coastal town known for beaches, windsurfing and historical castles.",
    "Karsiyaka offers scenic ferry rides, parks, and vibrant markets.",
    "Alsancak is famous for its nightlife, waterfront, and historic architecture.",
    "Kemeralti is a historical bazaar with Ottoman-era buildings and narrow alleys.",
    "Kadifekale is a hilltop fortress with panoramic views and Roman history.",
    "Foça is a small seaside town with ancient roots and serene beaches.",
    "Şirince is a wine-producing village with Greek architecture and peaceful vibes.",
    "Urla is known for vineyards, farm-to-table cuisine, and art villages."
]

# Add to ChromaDB
collection.add(
    documents=historical_sites,
    ids=[str(i + 1) for i in range(len(historical_sites))]
)

print("✅ Historical locations stored in ChromaDB.")
