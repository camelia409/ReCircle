from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel

router = APIRouter()

class MapData(BaseModel):
    lat: float
    lng: float
    type: str  # "partner" or "donation"
    name: str
    location: str

@router.get("/admin-map-data", response_model=List[MapData])
async def get_admin_map_data():
    """Get geospatial data for admin map visualization"""
    # Mock map data with partners and donations
    mock_data = [
        # Partners
        {"lat": 40.7128, "lng": -74.0060, "type": "partner", "name": "Community Aid", "location": "New York"},
        {"lat": 34.0522, "lng": -118.2437, "type": "partner", "name": "Green Cycle", "location": "Los Angeles"},
        {"lat": 41.8781, "lng": -87.6298, "type": "partner", "name": "Eco Warriors", "location": "Chicago"},
        {"lat": 29.7604, "lng": -95.3698, "type": "partner", "name": "Food Bank Central", "location": "Houston"},
        
        # Donations
        {"lat": 40.7589, "lng": -73.9851, "type": "donation", "name": "Donation Center", "location": "Manhattan"},
        {"lat": 40.7505, "lng": -73.9934, "type": "donation", "name": "Clothing Drive", "location": "Brooklyn"},
        {"lat": 34.0736, "lng": -118.2400, "type": "donation", "name": "Electronics Hub", "location": "Hollywood"},
        {"lat": 34.1016, "lng": -118.3267, "type": "donation", "name": "Furniture Collection", "location": "Beverly Hills"},
    ]
    
    return [MapData(**item) for item in mock_data] 