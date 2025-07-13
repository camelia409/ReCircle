from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

router = APIRouter()

class CategorizeRequest(BaseModel):
    description: str

class CategorizeResponse(BaseModel):
    suggestedCategory: str

@router.options("/categorize-description")
async def categorize_description_options():
    """Handle OPTIONS request for CORS preflight"""
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    )

@router.post("/categorize-description", response_model=CategorizeResponse)
async def categorize_description(request: CategorizeRequest):
    """Use NLP to suggest category based on description"""
    description = request.description.lower()
    
    # Keyword mapping for category suggestions
    clothing_keywords = ["shirt", "pants", "dress", "jacket", "coat", "sweater", "jeans", "t-shirt", "blouse", "skirt", "shoes", "boots", "sneakers", "hat", "scarf", "gloves"]
    electronics_keywords = ["phone", "laptop", "computer", "tv", "television", "tablet", "ipad", "iphone", "android", "charger", "cable", "headphones", "speaker", "camera", "printer"]
    food_keywords = ["can", "canned", "food", "rice", "beans", "pasta", "soup", "vegetables", "fruits", "bread", "cereal", "snacks", "chips", "cookies", "beverages", "drinks"]
    furniture_keywords = ["chair", "table", "sofa", "couch", "bed", "desk", "bookshelf", "cabinet", "dresser", "lamp", "mirror", "rug", "carpet", "mattress", "pillow"]
    
    # Count matches for each category
    clothing_matches = sum(1 for keyword in clothing_keywords if keyword in description)
    electronics_matches = sum(1 for keyword in electronics_keywords if keyword in description)
    food_matches = sum(1 for keyword in food_keywords if keyword in description)
    furniture_matches = sum(1 for keyword in furniture_keywords if keyword in description)
    
    # Find the category with the most matches
    matches = [
        ("Clothing", clothing_matches),
        ("Electronics", electronics_matches),
        ("Food", food_matches),
        ("Furniture", furniture_matches)
    ]
    
    best_match = max(matches, key=lambda x: x[1])
    
    if best_match[1] > 0:
        return CategorizeResponse(suggestedCategory=best_match[0])
    else:
        return CategorizeResponse(suggestedCategory="Clothing")  # Default fallback 