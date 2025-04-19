import json
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import logging
import re
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import chromadb

# Load environment variables
load_dotenv()
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load category-place suggestions and fallback coordinates from JSON
script_dir = os.path.dirname(__file__)
file_path = os.path.join(script_dir, "place_category_suggestions.json")

try:
    with open(file_path, "r", encoding="utf-8") as f:
        place_category_suggestions = json.load(f)
    print(f"✅ JSON loaded successfully from {file_path}")
    print(f"➡️ Loaded districts: {list(place_category_suggestions.keys())[:5]}... (total: {len(place_category_suggestions)})")
except FileNotFoundError:
    print(f"❌ File not found: {file_path}")
    place_category_suggestions = {}
except json.JSONDecodeError as e:
    print(f"❌ JSON decode error: {e}")
    place_category_suggestions = {}
except Exception as e:
    print(f"❌ Unexpected error while loading JSON: {e}")
    place_category_suggestions = {}

fallback_locations = {
    name: data["coordinates"] for name, data in place_category_suggestions.items() if "coordinates" in data
}

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
chroma_client = chromadb.PersistentClient(path="./histolocal_db")
chroma_collection = chroma_client.get_collection("izmir_locations")

class PromptRequest(BaseModel):
    prompt: str
    context: Optional[dict] = None

def parse_locations(prompt: str) -> tuple[list[str], list[str]]:
    print(f"[DEBUG] Running parse_locations with prompt: {prompt}")
    matched_static = [place for place in fallback_locations if place.lower() in prompt.lower()]
    matched_chroma = []

    try:
        results = chroma_collection.query(query_texts=[prompt], n_results=5) 

        print(f"[DEBUG] ChromaDB results: {results}")
        if results and "documents" in results:
            for doc in results["documents"][0]:
                place = doc.split(" is ")[0].strip()
                if place in fallback_locations and place not in matched_static:
                    matched_chroma.append(place)
    except Exception as e:
        print(f"❌ Chroma query failed: {e}")

    return matched_static, matched_chroma


def parse_date_from_text(prompt: str) -> Optional[str]:
    date_match = re.search(r'(\d{1,2})\s*(January|February|March|April|May|June|July|August|September|October|November|December)', prompt, re.IGNORECASE)
    if date_match:
        day = date_match.group(1)
        month = date_match.group(2)
        return f"{day} {month} 2025"
    return None

def get_route(locations: List[List[str]]):
    coord_string = ";".join([f"{loc[1]},{loc[0]}" for loc in locations])
    url = f"http://router.project-osrm.org/route/v1/driving/{coord_string}?overview=full&geometries=geojson"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()['routes'][0]['geometry']
    return None

def get_public_transport(locations: List[str]) -> str:
    suggestions = []
    for loc in locations:
        info = place_category_suggestions.get(loc, {}).get("transport")
        if info:
            suggestions.append(f"{loc}: {info}")
    return "\n".join(suggestions) if suggestions else "Transport info not available."

def get_weather(place: str, date: str) -> str:
    if not WEATHER_API_KEY:
        return "Weather API key not set."
    url = f"http://api.weatherapi.com/v1/forecast.json?key={WEATHER_API_KEY}&q={place}&days=3"
    res = requests.get(url)
    if res.status_code != 200:
        return "Weather info not available."
    data = res.json()
    return f"Weather in {place} on {date}: {data['forecast']['forecastday'][0]['day']['condition']['text']} with an average temperature of {data['forecast']['forecastday'][0]['day']['avgtemp_c']}°C."

@app.post("/generate-itinerary/")
async def generate_itinerary(req: PromptRequest):
    try:
        prompt = req.prompt
        ctx = req.context or {}
        ctx.setdefault("stage", None)

        print(f"[DEBUG] Incoming prompt: {prompt}")
        print(f"[DEBUG] Context: {ctx}")

        # 🔁 Reset or initial prompt
        if not ctx.get("stage") or re.search(r"(new|reset|again).*?(plan|itinerary|tour)", prompt, re.IGNORECASE):
            return {
                "response": "Hello!\nI'll assist you step-by-step to create the perfect travel plan in Izmir!\n\nLet's start with which places would you like to visit? (You can type Çeşme, Konak.. etc)",
                "awaiting": "locations",
                "context": {"stage": "awaiting_locations", "locations": [], "category": ""}
            }

        # ➕ Merge intent
        new_locations, _ = parse_locations(prompt)
        print(f"[DEBUG] Matched locations: {new_locations}")

        new_cats = [c.strip().lower() for c in re.split(r",| and ", prompt)
                    if c.strip() in {k.lower() for loc in place_category_suggestions.values() for k in loc.keys()}]

        if ctx.get("stage") == "awaiting_locations":
            if not new_locations:
                return {
                    "response": "Which locations in Izmir would you like to visit? (e.g. Çeşme, Konak...)",
                    "awaiting": "locations",
                    "context": ctx
                }
            ctx["locations"] = new_locations
            ctx["stage"] = "awaiting_category"
            return {
                "response": "What type of tour are you interested in? (e.g. historical sites, city life, beaches)",
                "awaiting": "category",
                "context": ctx
            }

        if ctx.get("stage") == "awaiting_category":
            if not new_cats:
                return {
                    "response": "Please specify what type of tour you're interested in (e.g. historical sites, city life, beaches)",
                    "awaiting": "category",
                    "context": ctx
                }
            ctx["category"] = ", ".join(sorted(set(new_cats)))
            ctx["stage"] = "awaiting_date"
            return {
                "response": "What date do you plan to travel? (e.g. 15 April)",
                "awaiting": "date",
                "context": ctx
            }

        if ctx.get("stage") == "awaiting_date":
            if "locations" not in ctx or not ctx["locations"]:
                ctx["stage"] = "awaiting_locations"
                return {
                    "response": "Let's start over.\nWhich locations in Izmir would you like to visit? (e.g. Çeşme, Konak...)",
                    "awaiting": "locations",
                    "context": ctx
                }

            if "category" not in ctx or not ctx["category"]:
                ctx["stage"] = "awaiting_category"
                return {
                    "response": "Please specify what type of tour you're interested in (e.g. historical sites, city life, beaches)",
                    "awaiting": "category",
                    "context": ctx
                }

            date = parse_date_from_text(prompt)
            if not date:
                return {
                    "response": "Please provide your travel date in a format like '15 April'.",
                    "awaiting": "date",
                    "context": ctx
                }
            ctx["travel_date"] = date
            ctx["stage"] = "completed"

        if ctx.get("stage") == "completed":
            locs = ctx.get("locations", [])
            if not locs:
                return {
                    "response": "I couldn't find the locations. Let's start again.\nWhich places would you like to visit in Izmir? (e.g. Konak, Çeşme...)",
                    "awaiting": "locations",
                    "context": {"stage": "awaiting_locations", "locations": [], "category": ""}
                }

            raw_category = ctx.get("category", "")
            if not raw_category:
                ctx["stage"] = "awaiting_category"
                return {
                    "response": "Please specify what type of tour you're interested in (e.g. historical sites, city life, beaches)",
                    "awaiting": "category",
                    "context": ctx
                }

            categories = [c.strip().lower() for c in re.split(r",| and ", raw_category) if c.strip()]
            coords = [fallback_locations[l] for l in locs if l in fallback_locations]
            route = get_route(coords) if len(coords) > 1 else None
            transport = get_public_transport(locs)
            weather_summary = "\n".join(get_weather(l, ctx["travel_date"]) for l in locs if l in fallback_locations)

            itinerary_locations = []
            suggested_places = []
            for loc in locs:
                itinerary_locations.append(loc)
                all_keys = place_category_suggestions.get(loc, {})
                normalized_keys = {k.lower(): k for k in all_keys}
                for category in categories:
                    actual_key = normalized_keys.get(category)
                    if actual_key:
                        entries = place_category_suggestions[loc][actual_key]
                        itinerary_locations.extend(entries)
                        suggested_places.append(f"{loc} ({actual_key}): " + ", ".join(entries))

            return {
                "response": f"Here is your itinerary:\n\nItinerary Locations: {', '.join(locs)} (type: {raw_category})\n\nSuggested Places:\n{chr(10).join(suggested_places)}\n\nTransport Info:\n{transport}\n\nWeather Forecast:\n{weather_summary}\n\n{'Route is included.' if route else 'No route available for a single location.'}",
                "awaiting": None,
                "context": ctx,
                "route_geojson": route
            }

    except Exception as e:
        print("❌ UNHANDLED EXCEPTION in generate_itinerary:", e)
        return {
            "response": f"Internal server error: {str(e)}",
            "awaiting": None,
            "context": {}
        }
 