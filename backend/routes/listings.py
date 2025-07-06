from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from database import get_db_connection
from models import ItemCreate, ItemResponse, ClaimRequest, ClaimResponse
import logging

router = APIRouter()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/listings", response_model=ItemResponse)
async def create_listing(item: ItemCreate):
    """Create a new surplus item listing"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            INSERT INTO items (category, description, location, quantity, status)
            VALUES (?, ?, ?, ?, 'available')
        """, (item.category, item.description, item.location, item.quantity))
        
        item_id = cursor.lastrowid
        conn.commit()
        
        # Mock notification
        logger.info(f"New item available: {item.description} at {item.location}")
        
        return ItemResponse(
            id=item_id,
            category=item.category,
            description=item.description,
            location=item.location,
            quantity=item.quantity,
            status="available"
        )
    
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.get("/listings", response_model=List[ItemResponse])
async def get_listings(category: Optional[str] = None, location: Optional[str] = None, status: Optional[str] = None):
    """Get all surplus item listings with optional filters"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT id, category, description, location, quantity, status FROM items WHERE 1=1"
    params = []
    
    if category:
        query += " AND category = ?"
        params.append(category)
    
    if location:
        query += " AND location = ?"
        params.append(location)
    
    if status:
        query += " AND status = ?"
        params.append(status)
    
    query += " ORDER BY id DESC"
    
    cursor.execute(query, params)
    items = cursor.fetchall()
    conn.close()
    
    return [ItemResponse(
        id=item[0],
        category=item[1],
        description=item[2],
        location=item[3],
        quantity=item[4],
        status=item[5]
    ) for item in items]

@router.post("/claim", response_model=ClaimResponse)
async def claim_item(claim: ClaimRequest):
    """Claim an available item"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if item exists and is available
        cursor.execute("SELECT id, status FROM items WHERE id = ?", (claim.item_id,))
        item = cursor.fetchone()
        
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        
        if item[1] != "available":
            raise HTTPException(status_code=400, detail="Item is not available")
        
        # Update item status
        cursor.execute("UPDATE items SET status = 'claimed' WHERE id = ?", (claim.item_id,))
        
        # Add claim record
        cursor.execute("""
            INSERT INTO claims (item_id, partner_id)
            VALUES (?, ?)
        """, (claim.item_id, claim.partner_id))
        
        # Add points to partner (10 points per claim)
        cursor.execute("UPDATE partners SET points = points + 10 WHERE id = ?", (claim.partner_id,))
        
        conn.commit()
        
        logger.info(f"Item {claim.item_id} claimed by partner {claim.partner_id}")
        
        return ClaimResponse(
            item_id=claim.item_id,
            partner_id=claim.partner_id,
            status="claimed",
            message="Item claimed successfully"
        )
    
    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.get("/categories")
async def get_categories():
    """Get all available categories"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT category FROM items ORDER BY category")
    categories = [row[0] for row in cursor.fetchall()]
    conn.close()
    return categories

@router.get("/locations")
async def get_locations():
    """Get all available locations"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT location FROM items ORDER BY location")
    locations = [row[0] for row in cursor.fetchall()]
    conn.close()
    return locations