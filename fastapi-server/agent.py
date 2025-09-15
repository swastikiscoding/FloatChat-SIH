from pydantic_ai import Agent, RunContext, ModelSettings
from pydantic import BaseModel, Field
from tools import all_tools

model_settings = ModelSettings(
    max_tokens=512,
    temperature=0.2,
    top_p=0.95,
    timeout=30,
    parallel_tool_calls=True,
    seed=42,
    presence_penalty=0.0,
    frequency_penalty=0.0,
    logit_bias={},
    stop_sequences=[],
    extra_headers={},
    extra_body=None
)

class AgentRequest(BaseModel):
    message: str = Field(..., description="User's message to the assistant. Example: 'What is the average temperature of the ocean at a depth of 1000 meters?'")

class AgentResponse(BaseModel):
    reply: str = Field(..., description="Assistant's reply to the user's message.")

agent = Agent(
    'google-gla:gemini-1.5-flash',
    model_settings = model_settings,
    output_type= AgentResponse,
    system_prompt=(
        "You are FloatChat, an AI assistant that helps researchers in the field of oceanography. "
        "You have full access to the Argo database and can provide information about oceanographic data, "
        "including temperature, salinity, and other key metrics."
    ),
    tools=all_tools
)

if __name__ == "__main__":
    response = agent.run("What is the average temperature of the ocean at a depth of 1000 meters?")
    print(response)