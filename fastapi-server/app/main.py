from fastapi import FastAPI
import uvicorn
from sqlalchemy import text
from db import engine
app = FastAPI()

@app.get("/")
async def read_root():
    return {"Hello": "World!!!"}

@app.get("/count")
async def get_count():
    
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM argo_profiles where latitude = 11.392;"))
        profiles = [profile for profile in result.fetchall()]
        for profile in profiles:
            print(profile)
    return {"profiles": profiles}

def main():
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
if __name__ == "__main__":
    main()