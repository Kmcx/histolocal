import json
import requests
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = FastAPI()

# Example fallback coordinates DB
fallback_locations = {
    "Çeşme": ["38.3232", "26.3052"],
    "Ephesus": ["37.9392", "27.3417"],
    "Alsancak": ["38.4321", "27.1327"],
    "Kemeraltı": ["38.4174", "27.1288"]
}

class PromptRequest(BaseModel):
    prompt: str

def parse_locations(prompt: str) -> List[str]:
    # Simple keyword matching for demo purposes
    locations = []
    for place in fallback_locations.keys():
        if place.lower() in prompt.lower():
            locations.append(place)
    return locations

def get_route(locations: List[List[str]]):
    coord_string = ";".join([f"{loc[1]},{loc[0]}" for loc in locations])
    osrm_url = f"http://router.project-osrm.org/route/v1/driving/{coord_string}?overview=full&geometries=geojson"
    response = requests.get(osrm_url)
    if response.status_code == 200:
        return response.json()['routes'][0]['geometry']
    else:
        return None

def get_public_transport_suggestions(locations: List[str]) -> str:
    suggestions = ""
    for loc in locations:
        if loc == "Çeşme":
            suggestions += "You can take Çeşme bus services from İzmir Otogar or use the Havaş airport shuttle. "
        if loc == "Ephesus":
            suggestions += "Take the train to Selçuk and then a local minibus to Ephesus. "
    return suggestions

@app.post("/generate-itinerary/")
async def generate_itinerary(prompt_request: PromptRequest):
    logging.info(f"Received itinerary generation request: {prompt_request.prompt}")
    locations = parse_locations(prompt_request.prompt)

    if not locations:
        raise HTTPException(status_code=400, detail="Could not detect locations in the prompt.")

    coordinates = [fallback_locations[loc] for loc in locations]
    route = get_route(coordinates)

    if not route:
        raise HTTPException(status_code=500, detail="Route generation failed.")

    transport_info = get_public_transport_suggestions(locations)

    return {
        "locations": locations,
        "coordinates": coordinates,
        "transport_suggestions": transport_info,
        "route_geojson": route
    }

# To run: uvicorn backend:app --host 0.0.0.0 --port 8000 --reload
