from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import ai_router, player_router


app = FastAPI(title="Fun Game API")

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"]
)

app.include_router(ai_router)
app.include_router(player_router)


@app.get("/")
async def root():
    return {"message": "Check /docs for documentation"}
