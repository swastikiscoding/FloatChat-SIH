from fastapi import APIRouter
from app.schemas.chat import AgentRequest, AgentResponse, ChatResponse
from app.services.chatbot import get_bot_response_with_new_history
from pydantic_ai.messages import ModelMessage

router = APIRouter()

@router.post("/", response_model=ChatResponse)
def chat_endpoint(request: AgentRequest, history: list[ModelMessage] = []) -> ChatResponse:
    chat_response, new_history = get_bot_response_with_new_history(request, history)
    print("New History:", new_history)
    return chat_response
