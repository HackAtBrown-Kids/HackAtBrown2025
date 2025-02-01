from fastapi import FastAPI
from uvicorn import run

app = FastAPI()

run(app, host="0.0.0.0", port=8000, reload=True)