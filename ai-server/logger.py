import logging

def setup_logger():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
        handlers=[
            logging.FileHandler("server.log"),  # Log to a file
            logging.StreamHandler()  # Log to console
        ]
    )
    return logging.getLogger("ollama_server")

logger = setup_logger()
