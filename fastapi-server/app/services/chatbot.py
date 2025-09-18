from app.schemas.chat import AgentRequest, AgentResponse, AgentDependencies, UserMode
from app.services.tools import all_tools
from typing import cast
from pydantic_ai.tools import Tool
from pydantic_ai import Agent, ModelSettings, RunContext
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.azure import AzureProvider
from pydantic_ai.run import AgentRunResult
from pydantic_ai.messages import ModelMessage
from loguru import logger
from os import getenv
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

default_sys_prompt = \
"""You are FloatChat, an AI assistant that helps researchers in the field of oceanography.
When outputting any data or answering any queries, ensure that you always cite the source of your information.
"""

student_sys_prompt = \
"""Explain everything you are doing; define all terminologies, provide examples wherever possible. Keep the tone friendly and engaging, and conversations educational.
"""

researcher_sys_prompt = \
"""No need to explain basic concepts."""

model = OpenAIChatModel(
    'gpt-4o',
    provider=AzureProvider(
        azure_endpoint=getenv('AZURE_OPENAI_ENDPOINT', 'https://your-endpoint.openai.azure.com/'),
        api_version=getenv('AZURE_API_VERSION', 'your-api-version'),
        api_key=getenv('AZURE_API_KEY', 'your-api-key'),
    ),
)

agent = Agent(
    model=model,
    deps_type=AgentDependencies,
    output_type=AgentResponse,
    model_settings=model_settings,
    instructions=default_sys_prompt,
    tools=[cast(Tool[AgentDependencies], tool) for tool in all_tools], # I have no idea what I am doing.
)

@agent.system_prompt
def get_student_sys_prompt(ctx: RunContext[AgentDependencies]) -> str:
    user_mode = ctx.deps.mode
    match user_mode:
        case UserMode.RESEARCHER:
            return researcher_sys_prompt
        case UserMode.STUDENT:
            return student_sys_prompt
        case UserMode.HYBRID:
            return ""

def get_bot_response_with_new_history(request: AgentRequest, history: list[ModelMessage]) -> tuple[AgentResponse, list[ModelMessage]]:
    response: AgentRunResult[AgentResponse] = agent.run_sync(request.message, deps=request.deps, message_history=history)
    new_history = response.new_messages()
    return response.output, new_history

if __name__ == "__main__":
    response, _ = get_bot_response_with_new_history(
        AgentRequest(
            message="What is the average temperature of the ocean at a depth of 1000 meters?",
            deps=AgentDependencies(mode=UserMode.STUDENT)
        ),
        []
    )
    print(response)