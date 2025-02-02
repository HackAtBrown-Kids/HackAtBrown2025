from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import player_router
from models import Room

app = FastAPI(title="Fun Game API")

app.rooms: dict[str, Room] = {}

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"]
)

app.include_router(player_router)

@app.get("/")
async def root():
    return {"message": "Check /docs for documentation"}
