from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel

router = APIRouter()

class ForecastItem(BaseModel):
    category: str
    quantity: int

@router.get("/forecast/{partner_id}", response_model=List[ForecastItem])
async def get_forecast(partner_id: int):
    """Get AI-driven donation forecasts for the next 30 days"""
    # Mock AI predictions based on partner behavior
    # In a real implementation, this would use TensorFlow.js or similar
    mock_forecasts = [
        {"category": "Clothing", "quantity": 45},
        {"category": "Electronics", "quantity": 28},
        {"category": "Food", "quantity": 52},
        {"category": "Furniture", "quantity": 22},
    ]
    
    # Adjust based on partner_id for variety
    if partner_id == 1:
        # Community Aid - focuses on clothing and food
        mock_forecasts = [
            {"category": "Clothing", "quantity": 60},
            {"category": "Food", "quantity": 65},
            {"category": "Electronics", "quantity": 20},
            {"category": "Furniture", "quantity": 15},
        ]
    elif partner_id == 2:
        # Green Cycle - focuses on electronics and furniture
        mock_forecasts = [
            {"category": "Electronics", "quantity": 40},
            {"category": "Furniture", "quantity": 35},
            {"category": "Clothing", "quantity": 30},
            {"category": "Food", "quantity": 25},
        ]
    
    return [ForecastItem(**forecast) for forecast in mock_forecasts] 