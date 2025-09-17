from fastapi import APIRouter
from schemas.chat import AgentRequest, AgentResponse
from app.services.chatbot import get_bot_response_with_new_history
from pydantic_ai.messages import ModelMessage

router = APIRouter()

@router.post("/", response_model=AgentResponse)
def chat_endpoint(request: AgentRequest, history: list[ModelMessage] = []):
    return get_bot_response_with_new_history(request, history)
