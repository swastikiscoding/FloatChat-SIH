from pydantic import BaseModel, Field
from enum import Enum
import pandas as pd
from pydantic_ai import ModelRetry

class UserMode(Enum):
    HYBRID = 0
    STUDENT = 1
    RESEARCHER = 2

class AgentDependencies(BaseModel):
    mode: UserMode = Field(..., description="Mode of the assistant. Options are HYBRID (0), STUDENT (1), RESEARCHER (2).")
    output: dict[str, pd.DataFrame] = Field(default_factory=dict)

    def store(self, value: pd.DataFrame) -> str:
        """Store the output in deps and return the reference such as Out[1] to be used by the LLM."""
        ref = f'Out[{len(self.output) + 1}]'
        self.output[ref] = value
        return ref

    def get(self, ref: str) -> pd.DataFrame:
        if ref not in self.output:
            raise ModelRetry(
                f'Error: {ref} is not a valid variable reference. Check the previous messages and try again.'
            )
        return self.output[ref]

class AgentRequest(BaseModel):
    message: str = Field(..., description="User's message to the assistant. Example: 'What is the average temperature of the ocean at a depth of 1000 meters?'")
    deps: AgentDependencies = Field(..., description="Dependencies for the agent.")

class AgentResponse(BaseModel):
    reply: str = Field(..., description="Assistant's reply to the user's message.")