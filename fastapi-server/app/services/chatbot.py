from app.schemas.chat import AgentRequest, AgentResponse, AgentDependencies, UserMode
from app.services.tools import all_tools
from pydantic_ai import Agent, ModelSettings, RunContext
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.azure import AzureProvider
from pydantic_ai.run import AgentRunResult
from pydantic_ai.messages import ModelMessage
from loguru import logger
from openai import AzureOpenAI
from os import getenv
from dotenv import load_dotenv
load_dotenv()

default_sys_prompt = \
"""You are FloatChat, an AI assistant that helps researchers in the field of oceanography.
When outputting any data or answering any queries, ensure that you always cite the source of your information.

Please don't call the same tools with the same parameters repeatedly.
"""

student_sys_prompt = \
"""Explain everything you are doing; define all terminologies, provide examples for concepts wherever possible.
Keep the tone friendly and engaging, and conversations educational.
"""

researcher_sys_prompt = \
"""No need to explain basic concepts."""

model = OpenAIChatModel(
    getenv('MODEL_NAME', 'gpt-5-nano'),
    provider=AzureProvider(
        azure_endpoint=getenv('AZURE_ENDPOINT'),
        api_version=getenv('AZURE_API_VERSION'),
        api_key=getenv('AZURE_API_KEY'),
    ),
)

def test_credentials():
    client = AzureOpenAI(
        api_version=getenv('AZURE_API_VERSION'),
        azure_endpoint=getenv('AZURE_ENDPOINT', ''),
        api_key=getenv('AZURE_API_KEY'),
    )
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "What is the capital of France? Answer in one word.",
            }
        ],
        max_completion_tokens=16384,
        model=getenv('MODEL_NAME', 'gpt-5-nano')
    )
    print(response.choices[0].message.content)

agent = Agent(
    model=model,
    deps_type=AgentDependencies,
    output_type=AgentResponse,
    instructions=default_sys_prompt,
    tools=all_tools,
    #model_settings=ModelSettings()
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
    logger.info(f"User message: {request.message}")
    logger.info(f"Bot response: {response.output.reply}")
    return response.output, new_history

if __name__ == "__main__":
    #test_credentials()
    response: AgentResponse
    response, history = get_bot_response_with_new_history(
        AgentRequest(
            message="get me the max temperature from float 6902746, cycle 1, only",
            deps=AgentDependencies(mode=UserMode.STUDENT)
        ),
        []
    )
    # The logger should print the response.