from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import uvicorn
import json
import os
from database import init_db, get_db_connection
from models import ItemCreate, ItemResponse, ClaimRequest, ClaimResponse, ImpactResponse, Partner, LoginRequest, LoginResponse
from routes import listings, impact, donation_locations, donation_trends, forecast, partner_insights, admin_kpis, admin_map_data, chatbot, categorize_description, badges, donations
import sqlite3
from typing import List

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    load_sample_data()
    yield
    # Shutdown
    pass

# Initialize FastAPI app
app = FastAPI(title="ReCircle Platform API", version="1.0.0", lifespan=lifespan)

# Add CORS middleware with proper configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

def load_sample_data():
    """Load sample data into the database"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Load sample data from JSON
    try:
        sample_data_path = os.path.join(os.path.dirname(__file__), "data", "sample_data.json")
        with open(sample_data_path, "r") as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Warning: Sample data file not found at {sample_data_path}")
        print("Creating default sample data...")
        
        # Create default sample data
        default_partners = [
            {"id": 1, "name": "Community Aid", "location": "New York, NY", "points": 1250},
            {"id": 2, "name": "Green Cycle", "location": "Los Angeles, CA", "points": 980},
            {"id": 3, "name": "Eco Warriors", "location": "Chicago, IL", "points": 750},
            {"id": 4, "name": "Sustainable Future", "location": "Houston, TX", "points": 620},
            {"id": 5, "name": "Recycle Heroes", "location": "Phoenix, AZ", "points": 450}
        ]
        
        default_items = [
            {"id": 1, "category": "Clothing", "description": "Men's shirts - Various sizes, good condition", "location": "New York, NY", "quantity": 50, "status": "available"},
            {"id": 2, "category": "Electronics", "description": "Laptops - Dell and HP, working condition", "location": "Los Angeles, CA", "quantity": 10, "status": "available"},
            {"id": 3, "category": "Food", "description": "Canned goods - Vegetables, fruits, and beans", "location": "Chicago, IL", "quantity": 100, "status": "available"},
            {"id": 4, "category": "Furniture", "description": "Office chairs - Ergonomic, like new", "location": "Houston, TX", "quantity": 15, "status": "available"},
            {"id": 5, "category": "Clothing", "description": "Women's dresses - Summer collection", "location": "Phoenix, AZ", "quantity": 25, "status": "available"},
            {"id": 6, "category": "Electronics", "description": "Tablets - iPads and Android tablets", "location": "New York, NY", "quantity": 8, "status": "available"},
            {"id": 7, "category": "Food", "description": "Rice and pasta - Bulk quantities", "location": "Los Angeles, CA", "quantity": 200, "status": "available"},
            {"id": 8, "category": "Furniture", "description": "Desks - Wooden, various sizes", "location": "Chicago, IL", "quantity": 12, "status": "available"},
            {"id": 9, "category": "Clothing", "description": "Children's clothes - All ages", "location": "Houston, TX", "quantity": 75, "status": "available"},
            {"id": 10, "category": "Electronics", "description": "Smartphones - Various brands", "location": "Phoenix, AZ", "quantity": 5, "status": "available"},
            {"id": 11, "category": "Food", "description": "Baby food and formula", "location": "New York, NY", "quantity": 150, "status": "available"},
            {"id": 12, "category": "Furniture", "description": "Bookshelves - Metal and wood", "location": "Los Angeles, CA", "quantity": 20, "status": "available"},
            {"id": 13, "category": "Clothing", "description": "Winter coats and jackets", "location": "Chicago, IL", "quantity": 40, "status": "available"},
            {"id": 14, "category": "Electronics", "description": "Monitors - 24-inch and 27-inch", "location": "Houston, TX", "quantity": 6, "status": "available"},
            {"id": 15, "category": "Food", "description": "Snack foods and beverages", "location": "Phoenix, AZ", "quantity": 300, "status": "available"},
            {"id": 16, "category": "Clothing", "description": "Shoes - Athletic and casual", "location": "New York, NY", "quantity": 30, "status": "claimed"},
            {"id": 17, "category": "Electronics", "description": "Printers - Laser and inkjet", "location": "Los Angeles, CA", "quantity": 4, "status": "claimed"},
            {"id": 18, "category": "Food", "description": "Cereal and breakfast items", "location": "Chicago, IL", "quantity": 80, "status": "claimed"},
            {"id": 19, "category": "Furniture", "description": "Sofas and couches", "location": "Houston, TX", "quantity": 3, "status": "claimed"},
            {"id": 20, "category": "Clothing", "description": "Professional attire", "location": "Phoenix, AZ", "quantity": 35, "status": "claimed"}
        ]
        
        data = {"ngos": default_partners, "surplus_items": default_items}
    
    # Insert NGOs/Partners
    for ngo in data["ngos"]:
        cursor.execute("""
            INSERT OR IGNORE INTO partners (id, name, location, points)
            VALUES (?, ?, ?, ?)
        """, (ngo["id"], ngo["name"], ngo["location"], ngo["points"]))
    
    # Insert surplus items
    for item in data["surplus_items"]:
        cursor.execute("""
            INSERT OR IGNORE INTO items (id, category, description, location, quantity, status)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (item["id"], item["category"], item["description"], item["location"], item["quantity"], item["status"]))
    
    # Insert sample badges
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            partner_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            earned BOOLEAN DEFAULT FALSE,
            earned_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (partner_id) REFERENCES partners (id)
        )
    """)
    
    # Insert sample badges for partner 1
    sample_badges = [
        (1, "Eco Hero", "Achieved 100+ points", True, "2024-06-01"),
        (1, "Community Star", "Completed 5+ claims", True, "2024-06-02"),
        (1, "Donation Champion", "Donated 50+ items", False, None),
        (2, "Eco Hero", "Achieved 100+ points", True, "2024-06-01"),
        (2, "Community Star", "Completed 5+ claims", False, None),
        (3, "Eco Hero", "Achieved 100+ points", False, None),
    ]
    
    for badge in sample_badges:
        cursor.execute("""
            INSERT OR IGNORE INTO badges (partner_id, name, description, earned, earned_at)
            VALUES (?, ?, ?, ?, ?)
        """, badge)
    
    # Insert sample claims
    sample_claims = [
        (16, 1),
        (17, 2),
        (18, 1),
        (19, 3),
        (20, 2),
    ]
    
    for claim in sample_claims:
        cursor.execute("""
            INSERT OR IGNORE INTO claims (item_id, partner_id)
            VALUES (?, ?)
        """, claim)
    
    conn.commit()
    conn.close()

# Include routers
app.include_router(listings.router, prefix="/api", tags=["listings"])
app.include_router(impact.router, prefix="/api", tags=["impact"])
app.include_router(donation_locations.router, prefix="/api", tags=["donation_locations"])
app.include_router(donation_trends.router, prefix="/api", tags=["donation_trends"])
app.include_router(forecast.router, prefix="/api", tags=["forecast"])
app.include_router(partner_insights.router, prefix="/api", tags=["partner_insights"])
app.include_router(admin_kpis.router, prefix="/api", tags=["admin_kpis"])
app.include_router(admin_map_data.router, prefix="/api", tags=["admin_map_data"])
app.include_router(chatbot.router, prefix="/api", tags=["chatbot"])
app.include_router(categorize_description.router, prefix="/api", tags=["categorize_description"])
app.include_router(badges.router, prefix="/api", tags=["badges"])
app.include_router(donations.router, prefix="/api", tags=["donations"])

# Authentication endpoints
@app.post("/api/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Mock login endpoint"""
    if request.username == "ngo1" and request.password == "test":
        return LoginResponse(
            success=True,
            partner_id=1,
            partner_name="Community Aid",
            token="mock_token_123"
        )
    elif request.username == "ngo2" and request.password == "test":
        return LoginResponse(
            success=True,
            partner_id=2,
            partner_name="Green Cycle",
            token="mock_token_456"
        )
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/partners", response_model=List[Partner])
async def get_partners():
    """Get all partners for leaderboard"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, location, points FROM partners ORDER BY points DESC")
    partners = cursor.fetchall()
    conn.close()
    
    return [Partner(id=p[0], name=p[1], location=p[2], points=p[3]) for p in partners]



# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "ReCircle API is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)