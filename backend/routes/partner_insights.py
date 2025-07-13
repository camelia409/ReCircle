from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class PartnerInsight(BaseModel):
    mostClaimed: str
    impactScore: int

@router.get("/partner-insights/{partner_id}", response_model=PartnerInsight)
async def get_partner_insights(partner_id: int):
    """Get partner-specific insights and analytics"""
    # Mock insights based on partner_id
    if partner_id == 1:
        # Community Aid
        return PartnerInsight(
            mostClaimed="Clothing",
            impactScore=85
        )
    elif partner_id == 2:
        # Green Cycle
        return PartnerInsight(
            mostClaimed="Electronics",
            impactScore=75
        )
    else:
        # Default for other partners
        return PartnerInsight(
            mostClaimed="Food",
            impactScore=65
        ) 