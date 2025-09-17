from pydantic import BaseModel, Field

class AgentRequest(BaseModel):
    message: str = Field(..., description="User's message to the assistant. Example: 'What is the average temperature of the ocean at a depth of 1000 meters?'")

class AgentResponse(BaseModel):
    reply: str = Field(..., description="Assistant's reply to the user's message.")