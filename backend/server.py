from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
#from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import httpx


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

#mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
# client = AsyncIOMotorClient(mongo_url)
# db = client[os.environ['DB_NAME']]

app = FastAPI(title="Riddhi Pachehara Portfolio API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    subject: Optional[str] = Field(default="", max_length=200)
    message: str = Field(..., min_length=1, max_length=4000)


class ContactMessage(BaseModel):
    id: str
    name: str
    email: str
    subject: Optional[str] = ""
    message: str
    created_at: str


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Riddhi Pachehara Portfolio API", "status": "online"}


@api_router.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}


#@api_router.post("/contact", response_model=ContactMessage)
#async def create_contact_message(payload: ContactMessageCreate):
    #doc = {
      #  "id": str(uuid.uuid4()),
      #  "name": payload.name.strip(),
       # "email": payload.email,
        #"subject": (payload.subject or "").strip(),
        #"message": payload.message.strip(),
        #"created_at": datetime.now(timezone.utc).isoformat(),
    #}
    #await db.contact_messages.insert_one(doc)
   # logger.info(f"New contact message from {doc['email']}")
    # Return a plain dict (avoid _id leaking)
    #return ContactMessage(**doc)


#@api_router.get("/contact", response_model=List[ContactMessage])
#async def list_contact_messages():
   # rows = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
   # return [ContactMessage(**r) for r in rows]


@api_router.get("/leetcode/{username}")
async def leetcode_stats(username: str):

    fallback = {
        "username": username,
        "totalSolved": 0,
        "easySolved": 0,
        "mediumSolved": 0,
        "hardSolved": 0,
        "totalQuestions": 0,
        "totalEasy": 800,
        "totalMedium": 1700,
        "totalHard": 750,
        "ranking": None,
        "submissionCalendar": {},
        "source": "fallback",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as http:
            response = await http.get(
                f"https://leetcode-api-faisalshohag.vercel.app/{username}"
            )

        if response.status_code != 200:
            return fallback

        data = response.json()

        return {
            "username": username,
            "totalSolved": data.get("totalSolved", 0),
            "easySolved": data.get("easySolved", 0),
            "mediumSolved": data.get("mediumSolved", 0),
            "hardSolved": data.get("hardSolved", 0),
            "totalQuestions": data.get("totalQuestions", 0),
            "totalEasy": data.get("totalEasy", 800),
            "totalMedium": data.get("totalMedium", 1700),
            "totalHard": data.get("totalHard", 750),
            "ranking": data.get("ranking"),
            "submissionCalendar": {},
            "source": "live",
        }

    except Exception as e:
        logger.warning(f"LeetCode proxy failed: {e}")
        return fallback


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)


#@app.on_event("shutdown")
#async def shutdown_db_client():
   # try:
   #     client.close()
   # except:
    #    pass
