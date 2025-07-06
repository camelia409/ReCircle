from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Item models
class ItemCreate(BaseModel):
    category: str = Field(..., description="Category of the item")
    description: str = Field(..., description="Description of the item")
    location: str = Field(..., description="Location of the item")
    quantity: int = Field(..., gt=0, description="Quantity of items")

class ItemResponse(BaseModel):
    id: int
    category: str
    description: str
    location: str
    quantity: int
    status: str = "available"
    created_at: Optional[datetime] = None

# Claim models
class ClaimRequest(BaseModel):
    item_id: int = Field(..., description="ID of the item to claim")
    partner_id: int = Field(..., description="ID of the partner making the claim")

class ClaimResponse(BaseModel):
    item_id: int
    partner_id: int
    status: str
    message: str

# Impact models
class ImpactResponse(BaseModel):
    partner_id: int
    partner_name: str
    items_claimed: int
    waste_diverted_kg: float
    people_helped: int
    points: int

# Partner models
class Partner(BaseModel):
    id: int
    name: str
    location: str
    points: int

# Authentication models
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    partner_id: Optional[int] = None
    partner_name: Optional[str] = None
    token: Optional[str] = None
    message: Optional[str] = None

# Dashboard models
class DashboardStats(BaseModel):
    total_items: int
    available_items: int
    claimed_items: int
    total_partners: int
    total_waste_diverted: float
    total_people_helped: int