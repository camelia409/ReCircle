from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from database import get_db_connection
from typing import Optional

router = APIRouter()

class DonationRequest(BaseModel):
    category: str
    description: str
    location: str
    quantity: int
    source: Optional[str] = "customer"

class DonationResponse(BaseModel):
    success: bool
    message: str
    donation_id: Optional[int] = None

@router.options("/donations")
async def donations_options():
    """Handle OPTIONS request for CORS preflight"""
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    )

@router.post("/donations", response_model=DonationResponse)
async def create_donation(donation: DonationRequest):
    """Create a new donation"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Validate input
        if not donation.category or not donation.description or not donation.location:
            raise HTTPException(status_code=400, detail="Category, description, and location are required")
        
        if donation.quantity <= 0:
            raise HTTPException(status_code=400, detail="Quantity must be greater than 0")
        
        cursor.execute("""
            INSERT INTO items (category, description, location, quantity, status)
            VALUES (?, ?, ?, ?, ?)
        """, (
            donation.category,
            donation.description,
            donation.location,
            donation.quantity,
            "available"
        ))
        
        donation_id = cursor.lastrowid
        conn.commit()
        
        return DonationResponse(
            success=True,
            message="Donation created successfully",
            donation_id=donation_id
        )
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()

@router.get("/donations")
async def get_donations():
    """Get all donations"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            SELECT id, category, description, location, quantity, status, created_at
            FROM items
            ORDER BY created_at DESC
        """)
        donations = cursor.fetchall()
        
        return [
            {
                "id": d[0],
                "category": d[1],
                "description": d[2],
                "location": d[3],
                "quantity": d[4],
                "status": d[5],
                "created_at": d[6]
            }
            for d in donations
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close() 