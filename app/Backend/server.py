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
