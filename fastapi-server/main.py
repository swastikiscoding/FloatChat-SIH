from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from agent import agent, AgentRequest, AgentResponse
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

@app.post("/chat")
async def chat(req: AgentRequest) -> AgentResponse:
    agent_result = await agent.run(req.message)
    return agent_result.output

@app.get("/")
async def root():
    return {"message": "Welcome to the FloatChat API. Use the /chat endpoint to interact with the AI assistant."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
