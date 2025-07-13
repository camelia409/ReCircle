from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class AdminKPIs(BaseModel):
    totalDonations: int
    wasteDiverted: float
    activePartners: int
    avgClaimTime: float

@router.get("/admin-kpis", response_model=AdminKPIs)
async def get_admin_kpis():
    """Get admin dashboard key performance indicators"""
    # Mock KPI data
    return AdminKPIs(
        totalDonations=1247,
        wasteDiverted=623.5,  # kg
        activePartners=12,
        avgClaimTime=2.3  # hours
    ) 