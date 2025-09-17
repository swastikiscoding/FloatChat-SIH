from fastapi import APIRouter
from schemas.chat import AgentRequest, AgentResponse
from services.chatbot import get_bot_response

router = APIRouter()

@router.post("/", response_model=AgentResponse)
def chat_endpoint(request: AgentRequest):
    return get_bot_response(request)
