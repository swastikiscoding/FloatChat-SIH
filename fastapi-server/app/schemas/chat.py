from pydantic import BaseModel, Field
from enum import Enum

class UserMode(Enum):
    HYBRID = 0
    STUDENT = 1
    RESEARCHER = 2

class AgentDependencies(BaseModel):
    mode: UserMode = Field(..., description="Mode of the assistant. Options are HYBRID (0), STUDENT (1), RESEARCHER (2).")

class AgentRequest(BaseModel):
    message: str = Field(..., description="User's message to the assistant. Example: 'What is the average temperature of the ocean at a depth of 1000 meters?'")
    deps: AgentDependencies = Field(..., description="Dependencies for the agent.")

class AgentResponse(BaseModel):
    reply: str = Field(..., description="Assistant's reply to the user's message.")