from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from sqlalchemy import text
from app.db import engine
from loguru import logger

from contextlib import asynccontextmanager
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events"""
    # Startup
    logger.info("Starting up the application...")
    yield
    # Shutdown
    logger.info("Shutting down the application...")

app = FastAPI(
    title="FloatChat API",
    description="API for the FloatChat AI assistant using FastAPI and Pydantic AI.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.chat_api import router
app.include_router(router, prefix="/chat", tags=["chat"])

@app.get("/")
def root():
    return {"message": "Welcome to the FloatChat API. Use the /chat endpoint to interact with the AI assistant."}
    # The chat endpoint is defined at app.api.chat.router

@app.get("/count")
async def get_count():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM argo_profiles where latitude = 11.392;"))
        profiles = [profile for profile in result.fetchall()]
        for profile in profiles:
            print(profile)
    return {"profiles": profiles}

def main():
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
if __name__ == "__main__":
    main()