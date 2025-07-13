from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class ImpactData(BaseModel):
    wasteSavedKg: float
    co2ReducedKg: float

@router.get("/impact/{partner_id}", response_model=ImpactData)
async def get_impact(partner_id: int):
    """Get environmental impact data for a partner"""
    # Mock impact data based on partner_id
    if partner_id == 1:
        # Community Aid - high impact
        return ImpactData(
            wasteSavedKg=125.5,
            co2ReducedKg=25.1
        )
    elif partner_id == 2:
        # Green Cycle - medium impact
        return ImpactData(
            wasteSavedKg=85.2,
            co2ReducedKg=17.0
        )
    else:
        # Default for other partners
        return ImpactData(
            wasteSavedKg=45.8,
            co2ReducedKg=9.2
        )