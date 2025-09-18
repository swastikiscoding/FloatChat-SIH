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

model_settings = ModelSettings(
    max_tokens=512,
    #temperature=0.2,
    #top_p=0.95,
    timeout=120,
    parallel_tool_calls=True,
    #seed=42,
    #presence_penalty=0.0,
    #frequency_penalty=0.0,
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
                "role": "system",
                "content": "You are a helpful assistant.",
            },
            {
                "role": "user",
                "content": "I am going to Paris, what should I see?",
            },
            {
                "role": "assistant",
                "content": "Paris, the capital of France, is known for its stunning architecture, art museums, historical landmarks, and romantic atmosphere. Here are some of the top attractions to see in Paris:\n \n 1. The Eiffel Tower: The iconic Eiffel Tower is one of the most recognizable landmarks in the world and offers breathtaking views of the city.\n 2. The Louvre Museum: The Louvre is one of the world's largest and most famous museums, housing an impressive collection of art and artifacts, including the Mona Lisa.\n 3. Notre-Dame Cathedral: This beautiful cathedral is one of the most famous landmarks in Paris and is known for its Gothic architecture and stunning stained glass windows.\n \n These are just a few of the many attractions that Paris has to offer. With so much to see and do, it's no wonder that Paris is one of the most popular tourist destinations in the world.",
            },
            {
                "role": "user",
                "content": "What is so great about #1?",
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
    model_settings=model_settings,
    instructions=default_sys_prompt,
    #tools=all_tools,
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
    logger.info(f"Request message: {request.message}")
    logger.info(f"Request deps: {request.deps}")
    logger.info(f"Message history: {history}")
    response: AgentRunResult[AgentResponse] = agent.run_sync(request.message, deps=request.deps, message_history=history)
    logger.info(f"Raw model response: {response}")
    new_history = response.new_messages()
    logger.info(f"New message history: {new_history}")
    logger.info(f"Agent output: {response.output}")
    return response.output, new_history

if __name__ == "__main__":
    test_credentials()
    response, _ = get_bot_response_with_new_history(
        AgentRequest(
            message="What is the average temperature of the ocean at a depth of 1000 meters?",
            deps=AgentDependencies(mode=UserMode.STUDENT)
        ),
        []
    )
    print(response)