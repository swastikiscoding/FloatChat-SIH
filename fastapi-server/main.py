from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from agent import agent, ChatRequest, ChatResponse

app = FastAPI()

@app.post("/chat")
async def chat(req: ChatRequest): # I have no idea what I am doing. Gotta fix this
    agent_result = await agent.run(req.message)
    result = agent_result.new_messages  # Use the correct attribute from AgentRunResult
    return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
