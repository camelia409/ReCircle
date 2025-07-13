from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from database import get_db_connection
from typing import List, Dict, Any

router = APIRouter()

@router.options("/badges/{partner_id}")
async def badges_options(partner_id: int):
    """Handle OPTIONS request for CORS preflight"""
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    )

@router.get("/badges/{partner_id}")
async def get_badges(partner_id: int) -> List[Dict[str, Any]]:
    """Get badges for a specific partner"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            SELECT name, description, earned 
            FROM badges 
            WHERE partner_id = ?
            ORDER BY earned DESC, name ASC
        """, (partner_id,))
        badges = cursor.fetchall()
        
        return [
            {
                "name": badge[0],
                "description": badge[1],
                "earned": bool(badge[2])
            }
            for badge in badges
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()

@router.get("/badges/{partner_id}/challenges")
async def get_challenges(partner_id: int) -> List[Dict[str, Any]]:
    """Get active challenges for a partner"""
    # Mock challenges data - in real app, this would come from database
    challenges = [
        {
            "name": "Claim Champion",
            "target": 10,
            "progress": 5,
            "description": "Claim 10 items this month"
        },
        {
            "name": "Monthly Donor",
            "target": 5,
            "progress": 3,
            "description": "Donate 5 items this month"
        },
        {
            "name": "Eco Warrior",
            "target": 1000,
            "progress": 750,
            "description": "Earn 1000 points"
        }
    ]
    
    return challenges 