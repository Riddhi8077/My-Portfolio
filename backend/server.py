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
from datetime import datetime, timezone, timedelta
import httpx
import json


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

#mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
# client = AsyncIOMotorClient(mongo_url)
# db = client[os.environ['DB_NAME']]

app = FastAPI(title="Riddhi Pachehara Portfolio API")
api_router = APIRouter(prefix="/api")

LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"
LEETCODE_CACHE_TTL_SECONDS = 30 * 60
leetcode_cache = {}

LEETCODE_PROFILE_QUERY = """
query portfolioLeetCodeProfile($username: String!) {
  allQuestionsCount {
    difficulty
    count
  }
  matchedUser(username: $username) {
    username
    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
    profile {
      ranking
    }
    userCalendar {
      streak
      totalActiveDays
      submissionCalendar
    }
    badges {
      id
      displayName
      icon
      creationDate
    }
  }
  recentAcSubmissionList(username: $username, limit: 20) {
    id
    title
    titleSlug
    timestamp
  }
  userContestRanking(username: $username) {
    attendedContestsCount
    rating
    globalRanking
    totalParticipants
    topPercentage
    badge {
      name
    }
  }
}
"""


def _empty_leetcode_payload(username: str, source: str = "fallback", error: Optional[str] = None):
    return {
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
        "contestRating": None,
        "contestGlobalRanking": None,
        "acceptanceRate": None,
        "currentStreak": 0,
        "longestStreak": 0,
        "totalActiveDays": 0,
        "lastActiveDate": None,
        "submissionCalendar": {},
        "dailyActivity": [],
        "recentSubmissions": [],
        "badges": [],
        "source": source,
        "cached": False,
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "error": error,
    }


def _parse_calendar(raw_calendar):
    if not raw_calendar:
        return {}
    if isinstance(raw_calendar, str):
        try:
            raw_calendar = json.loads(raw_calendar)
        except json.JSONDecodeError:
            return {}
    parsed = {}
    for key, value in raw_calendar.items():
        try:
            parsed[str(int(key))] = int(value)
        except (TypeError, ValueError):
            continue
    return parsed


def _calendar_day_key(timestamp: int):
    return datetime.fromtimestamp(timestamp, timezone.utc).strftime("%Y-%m-%d")


def _daily_activity(calendar):
    return [
        {
            "date": _calendar_day_key(int(timestamp)),
            "timestamp": int(timestamp),
            "count": int(count),
        }
        for timestamp, count in sorted(calendar.items(), key=lambda item: int(item[0]))
    ]


def _longest_streak(calendar):
    active_days = sorted({int(int(ts) / 86400) for ts, count in calendar.items() if int(count) > 0})
    if not active_days:
        return 0
    longest = current = 1
    for index in range(1, len(active_days)):
        if active_days[index] == active_days[index - 1] + 1:
            current += 1
        else:
            longest = max(longest, current)
            current = 1
    return max(longest, current)


def _current_streak(calendar):
    active_days = {int(int(ts) / 86400) for ts, count in calendar.items() if int(count) > 0}
    if not active_days:
        return 0
    today = int(datetime.now(timezone.utc).timestamp() / 86400)
    cursor = today if today in active_days else today - 1
    streak = 0
    while cursor in active_days:
        streak += 1
        cursor -= 1
    return streak


def _normalise_leetcode_payload(username: str, payload: dict):
    matched_user = payload.get("matchedUser") or {}
    if not matched_user:
        return _empty_leetcode_payload(username, error="LeetCode user not found")

    stats = matched_user.get("submitStatsGlobal", {}).get("acSubmissionNum", [])
    stats_by_difficulty = {item.get("difficulty", "").lower(): item for item in stats}
    totals_by_difficulty = {
        item.get("difficulty", "").lower(): item
        for item in payload.get("allQuestionsCount", [])
    }
    all_stats = stats_by_difficulty.get("all", {})
    easy_stats = stats_by_difficulty.get("easy", {})
    medium_stats = stats_by_difficulty.get("medium", {})
    hard_stats = stats_by_difficulty.get("hard", {})

    accepted = int(all_stats.get("count") or 0)
    submissions = int(all_stats.get("submissions") or 0)
    acceptance_rate = round((accepted / submissions) * 100, 1) if submissions else None

    calendar = _parse_calendar(matched_user.get("userCalendar", {}).get("submissionCalendar"))
    daily_activity = _daily_activity(calendar)
    last_active = daily_activity[-1]["date"] if daily_activity else None

    contest = payload.get("userContestRanking") or {}
    badges = [
        {
            "id": badge.get("id"),
            "name": badge.get("displayName"),
            "icon": badge.get("icon"),
            "date": badge.get("creationDate"),
        }
        for badge in matched_user.get("badges", [])[:8]
        if badge.get("displayName")
    ]

    recent_submissions = [
        {
            "id": submission.get("id"),
            "title": submission.get("title"),
            "titleSlug": submission.get("titleSlug"),
            "timestamp": int(submission.get("timestamp") or 0),
            "submittedAt": datetime.fromtimestamp(
                int(submission.get("timestamp") or 0), timezone.utc
            ).isoformat() if submission.get("timestamp") else None,
        }
        for submission in payload.get("recentAcSubmissionList", [])
    ]

    user_calendar = matched_user.get("userCalendar") or {}
    return {
        "username": matched_user.get("username") or username,
        "totalSolved": accepted,
        "easySolved": int(easy_stats.get("count") or 0),
        "mediumSolved": int(medium_stats.get("count") or 0),
        "hardSolved": int(hard_stats.get("count") or 0),
        "totalQuestions": int(totals_by_difficulty.get("all", {}).get("count") or 0),
        "totalEasy": int(totals_by_difficulty.get("easy", {}).get("count") or 800),
        "totalMedium": int(totals_by_difficulty.get("medium", {}).get("count") or 1700),
        "totalHard": int(totals_by_difficulty.get("hard", {}).get("count") or 750),
        "ranking": matched_user.get("profile", {}).get("ranking"),
        "contestRating": round(contest.get("rating"), 1) if contest.get("rating") else None,
        "contestGlobalRanking": contest.get("globalRanking"),
        "contestTopPercentage": contest.get("topPercentage"),
        "acceptanceRate": acceptance_rate,
        "currentStreak": int(user_calendar.get("streak") or _current_streak(calendar)),
        "longestStreak": _longest_streak(calendar),
        "totalActiveDays": int(user_calendar.get("totalActiveDays") or len(daily_activity)),
        "lastActiveDate": last_active,
        "submissionCalendar": calendar,
        "dailyActivity": daily_activity,
        "recentSubmissions": recent_submissions,
        "badges": badges,
        "source": "leetcode-graphql",
        "cached": False,
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "error": None,
    }


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
    cache_key = username.lower().strip()
    cached = leetcode_cache.get(cache_key)
    now = datetime.now(timezone.utc)
    if cached and now - cached["stored_at"] < timedelta(seconds=LEETCODE_CACHE_TTL_SECONDS):
        payload = dict(cached["payload"])
        payload["cached"] = True
        return payload

    try:
        async with httpx.AsyncClient(
            timeout=12.0,
            headers={
                "Content-Type": "application/json",
                "Referer": f"https://leetcode.com/{username}/",
                "User-Agent": "Mozilla/5.0 Portfolio LeetCode Dashboard",
            },
        ) as http:
            response = await http.post(
                LEETCODE_GRAPHQL_URL,
                json={
                    "query": LEETCODE_PROFILE_QUERY,
                    "variables": {"username": username},
                    "operationName": "portfolioLeetCodeProfile",
                },
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"LeetCode returned HTTP {response.status_code}",
            )

        data = response.json()
        if data.get("errors"):
            raise HTTPException(status_code=502, detail=data["errors"])

        normalised = _normalise_leetcode_payload(username, data.get("data") or {})
        if normalised.get("error"):
            raise HTTPException(status_code=404, detail=normalised["error"])

        leetcode_cache[cache_key] = {"stored_at": now, "payload": normalised}
        return normalised

    except Exception as e:
        logger.warning(f"LeetCode proxy failed: {e}")
        if cached:
            payload = dict(cached["payload"])
            payload["cached"] = True
            payload["error"] = "Showing cached LeetCode data because the live request failed."
            return payload
        return _empty_leetcode_payload(
            username,
            source="fallback",
            error="Unable to load live LeetCode data right now.",
        )


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
