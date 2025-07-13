from fastapi import APIRouter, HTTPException
from typing import List, Dict
from pydantic import BaseModel
from datetime import datetime, timedelta

router = APIRouter()

class CategoryData(BaseModel):
    Clothing: int
    Electronics: int
    Food: int
    Furniture: int

class DonationTrend(BaseModel):
    date: str
    categories: CategoryData

@router.get("/donation-trends", response_model=List[DonationTrend])
async def get_donation_trends():
    """Get donation trends for the last 7 days"""
    # Generate mock data for the last 7 days
    trends = []
    base_date = datetime.now() - timedelta(days=6)
    
    # Mock trend data with realistic variations
    mock_data = [
        {"Clothing": 25, "Electronics": 15, "Food": 30, "Furniture": 10},
        {"Clothing": 30, "Electronics": 20, "Food": 35, "Furniture": 12},
        {"Clothing": 28, "Electronics": 18, "Food": 32, "Furniture": 15},
        {"Clothing": 35, "Electronics": 22, "Food": 40, "Furniture": 18},
        {"Clothing": 32, "Electronics": 25, "Food": 38, "Furniture": 20},
        {"Clothing": 40, "Electronics": 28, "Food": 45, "Furniture": 22},
        {"Clothing": 38, "Electronics": 30, "Food": 42, "Furniture": 25},
    ]
    
    for i, data in enumerate(mock_data):
        date = base_date + timedelta(days=i)
        trend = DonationTrend(
            date=date.strftime("%Y-%m-%d"),
            categories=CategoryData(**data)
        )
        trends.append(trend)
    
    return trends 