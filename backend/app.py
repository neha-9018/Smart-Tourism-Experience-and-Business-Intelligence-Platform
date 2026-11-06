import os
from fastapi import FastAPI
from pydantic import BaseSettings

class Settings(BaseSettings):
    # MySQL connection settings (environment based, not used by the health endpoint)
    DB_HOST: str = os.getenv('DB_HOST', 'localhost')
    DB_PORT: int = int(os.getenv('DB_PORT', 3306))
    DB_USER: str = os.getenv('DB_USER', '')
    DB_PASSWORD: str = os.getenv('DB_PASSWORD', '')
    DB_NAME: str = os.getenv('DB_NAME', 'Hotel_Management')

    class Config:
        env_file = '.env'

settings = Settings()

app = FastAPI(title="Tourism360 FastAPI Backend", version="0.1.0")

@app.get("/api/health")
def health_check():
    """Simple health check endpoint returning status OK."""
    return {"status": "ok"}

