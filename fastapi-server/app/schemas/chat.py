from pydantic import BaseModel, Field, model_validator
from typing_extensions import Self
from dataclasses import dataclass, field
from enum import Enum
import pandas as pd
from pydantic_ai import ModelRetry
#from argopy import DataFetcher as ArgopyDataFetcher

kinds = {'line', 'bar', 'scatter'}

class UserMode(Enum):
    HYBRID = 0
    STUDENT = 1
    RESEARCHER = 2

class Plot_Data(BaseModel):
    title: str = Field(..., description="Title of the plot.")
    kind: str = Field(..., description=f"Type of the plot: can only be one of {list(kinds)}.")
    x_label: str = Field(..., description="Label for the X-axis.")
    y_label: str = Field(..., description="Label for the Y-axis.")
    x: list[float | int | str] = Field(..., description="X-axis data points. Can be numeric or date strings.")
    y: list[float | int | str] = Field(..., description="Y-axis data points. Can be numeric or date strings.")
    x_type: str = Field(default="numeric", description="Type of x-axis data: 'numeric' or 'datetime'")
    y_type: str = Field(default="numeric", description="Type of y-axis data: 'numeric' or 'datetime'")

    @model_validator(mode="after")
    def check_xy_length(self) -> Self:
        if len(self.x) != len(self.y):
            raise ValueError("Length of x and y must be the same.")
        return self
    
    @model_validator(mode="after")
    def check_kind(self) -> Self:
        if self.kind not in kinds:
            raise ValueError(f"Invalid plot kind: {self.kind}. Must be one of {kinds}.")
        return self

@dataclass
class AgentDependencies:
    mode: UserMode = field(default_factory=lambda: UserMode.HYBRID)
    output: dict[str, pd.DataFrame] = field(default_factory=dict)
    plots_data: list[Plot_Data] = field(default_factory=list)

    def store_dataframe(self, value: pd.DataFrame) -> str:
        """Store the output in deps and return the reference such as Out[1] to be used by the LLM."""
        ref = f'Out[{len(self.output) + 1}]'
        self.output[ref] = value
        return ref
    
    def store_plot_data(self, plot_data: Plot_Data) -> None:
        """Store the plot data in deps to be sent to the frontend."""
        self.plots_data.append(plot_data)

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
    """Agent's raw response data structure."""
    reply: str = Field(..., description="Assistant's reply to the user's message.")

class ChatResponse(BaseModel):
    """Actual response sent to the frontend via the endpoint."""
    message: str = Field(..., description="Assistant's reply to the user's message.")
    plots_data: list[Plot_Data] = Field(default_factory=list, description="List of plot data to be rendered on the frontend.")

    class Config:
        arbitrary_types_allowed = True # Plot_Data contains a list which is not a pydantic type