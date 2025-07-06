from fastapi import APIRouter, HTTPException
from database import get_db_connection
from models import ImpactResponse, DashboardStats

router = APIRouter()

@router.get("/impact/{partner_id}", response_model=ImpactResponse)
async def get_partner_impact(partner_id: int):
    """Get impact metrics for a specific partner"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get partner info
    cursor.execute("SELECT name, points FROM partners WHERE id = ?", (partner_id,))
    partner = cursor.fetchone()
    
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    # Get claims data
    cursor.execute("""
        SELECT COUNT(*) as items_claimed, SUM(i.quantity) as total_quantity
        FROM claims c
        JOIN items i ON c.item_id = i.id
        WHERE c.partner_id = ?
    """, (partner_id,))
    
    claims_data = cursor.fetchone()
    items_claimed = claims_data[0] if claims_data[0] else 0
    total_quantity = claims_data[1] if claims_data[1] else 0
    
    # Calculate impact metrics
    waste_diverted_kg = total_quantity * 0.5  # 0.5 kg per item
    people_helped = items_claimed * 10  # 10 people helped per item claimed
    
    conn.close()
    
    return ImpactResponse(
        partner_id=partner_id,
        partner_name=partner[0],
        items_claimed=items_claimed,
        waste_diverted_kg=waste_diverted_kg,
        people_helped=people_helped,
        points=partner[1]
    )

@router.get("/dashboard-stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """Get overall dashboard statistics"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get item statistics
    cursor.execute("SELECT COUNT(*) FROM items")
    total_items = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM items WHERE status = 'available'")
    available_items = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM items WHERE status = 'claimed'")
    claimed_items = cursor.fetchone()[0]
    
    # Get partner count
    cursor.execute("SELECT COUNT(*) FROM partners")
    total_partners = cursor.fetchone()[0]
    
    # Get total impact
    cursor.execute("SELECT SUM(quantity) FROM items WHERE status = 'claimed'")
    total_quantity_claimed = cursor.fetchone()[0] or 0
    
    total_waste_diverted = total_quantity_claimed * 0.5
    total_people_helped = claimed_items * 10
    
    conn.close()
    
    return DashboardStats(
        total_items=total_items,
        available_items=available_items,
        claimed_items=claimed_items,
        total_partners=total_partners,
        total_waste_diverted=total_waste_diverted,
        total_people_helped=total_people_helped
    )