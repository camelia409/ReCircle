from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class ChatbotRequest(BaseModel):
    message: str

class ChatbotResponse(BaseModel):
    response: str

@router.post("/chatbot", response_model=ChatbotResponse)
async def chatbot_response(request: ChatbotRequest):
    """Get chatbot response based on user message"""
    message = request.message.lower()
    
    # Simple rule-based responses
    if any(word in message for word in ["donate", "how to donate", "donation"]):
        return ChatbotResponse(
            response="To donate items, go to the Donation page and fill out the form with your item details. We'll help you categorize and schedule pickup."
        )
    elif any(word in message for word in ["claim", "how to claim", "claiming"]):
        return ChatbotResponse(
            response="Partners can claim items from the ItemMatch section on their dashboard. Items are recommended based on your location and needs."
        )
    elif any(word in message for word in ["badge", "challenge", "achievement"]):
        return ChatbotResponse(
            response="Complete challenges to earn badges! Try claiming 10 items this month for the 'Community Star' badge."
        )
    elif any(word in message for word in ["impact", "environmental", "sustainability"]):
        return ChatbotResponse(
            response="Every item donated helps reduce waste and CO2 emissions. Check your Impact Calculator to see your environmental contribution."
        )
    elif any(word in message for word in ["help", "support", "assistance"]):
        return ChatbotResponse(
            response="I can help you with donations, claims, badges, and impact tracking. Just ask me anything about ReCircle!"
        )
    else:
        return ChatbotResponse(
            response="I'm here to help with ReCircle questions! Try asking about donations, claims, badges, or environmental impact."
        ) 