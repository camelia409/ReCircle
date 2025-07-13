from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel

router = APIRouter()

class DonationLocation(BaseModel):
    lat: float
    lng: float
    location: str
    quantity: int

@router.get("/donation-locations", response_model=List[DonationLocation])
async def get_donation_locations():
    """Get donation locations for heatmap visualization"""
    # Mock data for demonstration
    mock_locations = [
        {"lat": 40.7128, "lng": -74.0060, "location": "New York", "quantity": 50},
        {"lat": 34.0522, "lng": -118.2437, "location": "Los Angeles", "quantity": 30},
        {"lat": 41.8781, "lng": -87.6298, "location": "Chicago", "quantity": 25},
        {"lat": 29.7604, "lng": -95.3698, "location": "Houston", "quantity": 20},
        {"lat": 33.7490, "lng": -84.3880, "location": "Atlanta", "quantity": 35},
        {"lat": 25.7617, "lng": -80.1918, "location": "Miami", "quantity": 15},
        {"lat": 39.9526, "lng": -75.1652, "location": "Philadelphia", "quantity": 40},
        {"lat": 32.7767, "lng": -96.7970, "location": "Dallas", "quantity": 28},
    ]
    
    return [DonationLocation(**location) for location in mock_locations] 