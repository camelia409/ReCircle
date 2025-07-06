from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
import json
import os
from database import init_db, get_db_connection
from models import ItemCreate, ItemResponse, ClaimRequest, ClaimResponse, ImpactResponse, Partner, LoginRequest, LoginResponse
from routes import listings, impact
import sqlite3
from typing import List

# Initialize FastAPI app
app = FastAPI(title="ReCircle Platform API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()
    load_sample_data()

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
        print("Skipping sample data loading...")
        conn.close()
        return
    
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
    
    conn.commit()
    conn.close()

# Include routers
app.include_router(listings.router, prefix="/api", tags=["listings"])
app.include_router(impact.router, prefix="/api", tags=["impact"])

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