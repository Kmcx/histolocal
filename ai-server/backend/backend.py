import json
import requests
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
import logging
import re
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = FastAPI()

# Enable CORS for all origins (adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Example fallback coordinates DB
fallback_locations = {
    "Çeşme": ["38.3232", "26.3052"],
    "Ephesus": ["37.9392", "27.3417"],
    "Alsancak": ["38.4321", "27.1327"],
    "Kemeraltı": ["38.4174", "27.1288"]
}

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")  # Stored securely in .env

class PromptRequest(BaseModel):
    prompt: str

def parse_locations(prompt: str) -> List[str]:
    locations = []
    for place in fallback_locations.keys():
        if place.lower() in prompt.lower():
            locations.append(place)
    return locations

def parse_dates(prompt: str) -> Optional[str]:
    date_match = re.search(r'\b(\d{4}-\d{2}-\d{2})\b', prompt)
    if date_match:
        return date_match.group(1)
    return None

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
            suggestions += "You can take Çeşme buses from İzmir Otogar or use Havaş airport shuttle. "
        if loc == "Ephesus":
            suggestions += "Take the train to Selçuk and then a minibus to Ephesus. "
        if loc == "Alsancak":
            suggestions += "Alsancak is easily reachable by İZBAN and ESHOT buses from many parts of İzmir. "
    return suggestions

def get_weather_forecast(place: str, date: Optional[str]) -> str:
    if not WEATHER_API_KEY:
        return "Weather API key not set."
    query_param = place
    url = f"http://api.weatherapi.com/v1/forecast.json?key={WEATHER_API_KEY}&q={query_param}&days=3"
    response = requests.get(url)
    if response.status_code != 200:
        return "Weather info not available."
    data = response.json()
    forecast_text = f"Weather for {place}: {data['forecast']['forecastday'][0]['day']['condition']['text']}, Avg Temp: {data['forecast']['forecastday'][0]['day']['avgtemp_c']}°C. "
    return forecast_text

@app.post("/generate-itinerary/")
async def generate_itinerary(prompt_request: PromptRequest):
    logging.info(f"Received itinerary generation request: {prompt_request.prompt}")

    locations = parse_locations(prompt_request.prompt)
    travel_date = parse_dates(prompt_request.prompt)

    if not locations:
        raise HTTPException(status_code=400, detail="Could not detect locations in the prompt.")

    coordinates = [fallback_locations[loc] for loc in locations]
    transport_info = get_public_transport_suggestions(locations)

    weather_info = ""
    if travel_date:
        for loc in locations:
            weather_info += get_weather_forecast(loc, travel_date) + "\n"

    route = None
    if len(coordinates) >= 2:
        route = get_route(coordinates)
        if not route:
            raise HTTPException(status_code=500, detail="Route generation failed.")

    # Construct dynamic response message
    response_msg = f"Here is your itinerary:\n\nStops: {', '.join(locations)}"
    if transport_info:
        response_msg += f"\n\nTransport: {transport_info}"
    if weather_info:
        response_msg += f"\n\nWeather:\n{weather_info.strip()}"
    if route:
        response_msg += f"\n\nRoute has been generated based on driving distance."
    else:
        response_msg += f"\n\nNo route generated (only one location detected)."

    return {
        "response": response_msg,
        "locations": locations,
        "coordinates": coordinates,
        "transport_suggestions": transport_info,
        "weather_info": weather_info.strip(),
        "route_geojson": route
    }
