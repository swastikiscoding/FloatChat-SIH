from app.schemas.chat import AgentRequest, AgentResponse
from app.services.tools import all_tools
from pydantic_ai import Agent, RunContext, ModelSettings
from loguru import logger
from dotenv import load_dotenv
load_dotenv()

model_settings = ModelSettings(
    max_tokens=512,
    temperature=0.2,
    top_p=0.95,
    timeout=120,
    parallel_tool_calls=True,
    seed=42,
    presence_penalty=0.0,
    frequency_penalty=0.0,
    logit_bias={},
    stop_sequences=[],
    extra_headers={},
    extra_body=None,
)

agent = Agent(
    'google-gla:gemini-1.5-flash',
    model_settings = model_settings,
    output_type= AgentResponse,
    system_prompt=(
        "You are FloatChat, an AI assistant that helps researchers in the field of oceanography. "
    ),
    tools=all_tools
)

def get_bot_response(request: AgentRequest) -> AgentResponse:
    return agent.run_sync(request.message).output

if __name__ == "__main__":
    response: AgentResponse = agent.run_sync("What is the average temperature of the ocean at a depth of 1000 meters?").output
    print(response)