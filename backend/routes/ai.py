from fastapi.routing import APIRouter
from fastapi import UploadFile

router = APIRouter(prefix="/ai")

@router.get("/cardify")
def cardify(file: UploadFile):
    return {"message": "this will magically make your pdf a bunch of flashcards"}