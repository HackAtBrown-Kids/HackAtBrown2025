from fastapi import UploadFile, File, HTTPException, APIRouter
from fastapi.responses import JSONResponse
import openai
from openai import OpenAI
from PyPDF2 import PdfReader
import os
from dotenv import load_dotenv
import csv
from io import BytesIO
from random import shuffle

load_dotenv()

openai_api_key = os.environ.get("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key)

ai_router = APIRouter(prefix="/ai")

@ai_router.post("/pdf-to-flashcard")
async def pdf_flashcard(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    contents = await file.read()
    pdf_stream = BytesIO(contents)
    try:
        reader = PdfReader(pdf_stream)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing PDF: {str(e)}")

    # Return the parsed text
    return convert_to_flashcards(text)

@ai_router.post("/text-to-flashcard")
async def text_flashcard(text: str):
    return convert_to_flashcards(text)

def convert_to_flashcards(text: str):
    # divide text into smaller sections
    max_words = 1000
    if len(text.split(" ")) > max_words:
        return HTTPException(status_code=429, detail="Too many words")
    
    messages = [{"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": 'Using the given text, create a set of multiple choice questions, each with 4 total answer options that a student can use to study for a test. ' +
                 'There should be 3 incorrect choices and 1 correct choice. Give your output as a CSV file, with labels of "question", "correct_answer", "incorrect_answer_1", ' +  
                 '"incorrect_answer_2", and "incorrect_answer_3". Try your best to cover all of the material in the document. ' + 
                 f'Only output the CSV file, and say nothing else. \n Text: {text}' }]
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.7,
        max_tokens=2048
    )
    
    response_from_api = response.choices[0].message.content
    # remove beginning and ending formatting from response
    csv_text = response_from_api[len("```csv\n"):-len("```")]
    
    reader = csv.reader(csv_text.splitlines())
    header = next(reader, None)
    questions = []
    try:
        for row in reader:
            row = row[:5]
            for i in range(len(row)):
                row[i] = row[i].replace('"', "")
                row[i] = row[i].replace("\\", "")
            shuffled_answers = row[1:]
            shuffle(shuffled_answers)
            question = {
                "question": row[0],
                "correct": row[1].strip(),
                "choices": shuffled_answers
            }
            questions.append(question)
    except:
        return csv_text
        
    return questions