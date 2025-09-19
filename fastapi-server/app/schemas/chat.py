from pydantic import BaseModel, Field
from dataclasses import dataclass, field
from enum import Enum
import pandas as pd
from pydantic_ai import ModelRetry
#from argopy import DataFetcher as ArgopyDataFetcher

class UserMode(Enum):
    HYBRID = 0
    STUDENT = 1
    RESEARCHER = 2

@dataclass
class AgentDependencies:
    #argo_fetcher: 'ArgopyDataFetcher' = field(default_factory=lambda: ArgopyDataFetcher(), metadata={"description": "Argopy DataFetcher instance for loading Argo data."})
    mode: UserMode = field(default_factory=lambda: UserMode.HYBRID, metadata={"description": "Mode of the assistant. Options are HYBRID (0), STUDENT (1), RESEARCHER (2)."})
    output: dict[str, pd.DataFrame] = field(default_factory=dict)

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
    message: str = Field(..., description="User's message to the assistant.")
    deps: AgentDependencies = Field(..., description="Dependencies for the agent.")

    class Config:
        arbitrary_types_allowed = True # AgentDependencies contains a pd.DataFrame which is not a pydantic type

class AgentResponse(BaseModel):
    reply: str = Field(..., description="Assistant's reply to the user's message.")