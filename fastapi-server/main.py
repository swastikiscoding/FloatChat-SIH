from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from agent import agent, AgentRequest, AgentResponse

app = FastAPI()

@app.post("/chat")
async def chat(req: AgentRequest) -> AgentResponse:
    agent_result = await agent.run(req.message)
    return agent_result.output

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
