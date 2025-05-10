from fastapi import FastAPI, HTTPException, Request, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
import base64
from typing import Optional
from transcription.whisper_manager import WhisperManager

# Initialize FastAPI app
app = FastAPI(title="ConversAIge API")

# Initialize WhisperManager
whisper_manager = WhisperManager(model_size="base")

# Add CORS middleware to allow frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you would specify the exact origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model for chat endpoint
class ChatRequest(BaseModel):
    message: str

# For storing basic chat history (would use a proper database in production)
chat_history = []

@app.get("/")
async def root():
    return {"message": "Welcome to the ConversAIge API"}

@app.post("/chat")
async def chat(request: ChatRequest):
    """Handle chat messages from the user"""
    try:
        # Store the incoming message
        chat_history.append({"role": "user", "content": request.message})
        
        # Generate a simple response based on the message content
        response = generate_response(request.message)
        
        # Store the response
        chat_history.append({"role": "assistant", "content": response})
        
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/agent")
async def agent(request: ChatRequest):
    """Agent-based processing with additional tools"""
    try:
        # Similar to chat but with "agent" capabilities
        response = f"Agent response to: {request.message}\n\nI would help you with your insurance policy inquiry."
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transcribe")
async def transcribe(audio: Optional[UploadFile] = File(None)):
    """Transcribe audio to text using WhisperX"""
    try:
        if not audio:
            raise HTTPException(status_code=400, detail="No audio file provided")
            
        # Log information about the uploaded file
        file_info = f"Received file: {audio.filename}, content_type: {audio.content_type}"
        print(file_info)
        
        # Save the uploaded file temporarily
        temp_path = f"temp_{audio.filename}"
        try:
            with open(temp_path, "wb") as buffer:
                content = await audio.read()
                buffer.write(content)
            
            # Transcribe the audio using WhisperX
            transcription = whisper_manager.transcribe(temp_path)
            
            # Clean up the temporary file
            os.remove(temp_path)
            
            # Format the response
            return {
                "segments": [
                    {
                        "text": transcription,
                        "start": 0,
                        "end": 0
                    }
                ],
                "debug_info": file_info
            }
            
        except Exception as e:
            # Clean up the temporary file if it exists
            if os.path.exists(temp_path):
                os.remove(temp_path)
            raise e
            
    except Exception as e:
        print(f"Transcription error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def generate_response(message: str) -> str:
    """Generate a simple response based on the message content"""
    message = message.lower()
    
    if "hello" in message or "hi" in message:
        return "Hello! I'm your insurance concierge. How can I help you today?"
    
    if "policy" in message:
        return "I can help you with your policy. Could you provide your policy number so I can look up the details?"
    
    if "claim" in message:
        return "To file a claim, I'll need some details about the incident. Could you tell me what happened and when it occurred?"
    
    if "quote" in message:
        return "I'd be happy to help you get a quote. What type of insurance are you interested in? We offer auto, home, life, and health insurance."
    
    # Default response
    return "Thank you for your message. As your insurance concierge, I'm here to help with any questions about your policy, claims, or coverage. How can I assist you today?"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 