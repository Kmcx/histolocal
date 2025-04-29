import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "mistral")
    LOG_LEVEL = os.getenv("LOG_LEVEL", "info")
