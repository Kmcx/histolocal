import requests
from fastapi import FastAPI
from pydantic import BaseModel
from logger import logger  # Import logger

app = FastAPI()

OLLAMA_SERVER_URL = "http://localhost:11434/api/generate"

class ChatRequest(BaseModel):
    prompt: str

@app.post("/ask-ai/")
def ask_ai(request: ChatRequest):
    """Send user queries to Ollama AI for tour recommendations."""
    try:
        logger.info(f"Received AI request: {request.prompt}")
        response = requests.post(OLLAMA_SERVER_URL, json={"model": "mistral", "prompt": request.prompt})
        logger.info("AI response generated successfully.")
        return response.json()
    except Exception as e:
        logger.error(f"Error in AI processing: {str(e)}")
        return {"error": "AI response failed"}
