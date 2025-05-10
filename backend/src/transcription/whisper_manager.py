from faster_whisper import WhisperModel
from typing import Optional, Dict, Any
import torch
import os
from pathlib import Path

class WhisperManager:
    def __init__(self, model_size: str = "base", device: str = "auto"):
        """
        Initialize the WhisperX manager
        
        Args:
            model_size: Size of the model to use (tiny, base, small, medium, large)
            device: Device to run the model on (auto, cpu, cuda)
        """
        self.model_size = model_size
        self.device = device
        self.model = self._load_model()
        
    def _load_model(self) -> WhisperModel:
        """Load the Whisper model"""
        try:
            return WhisperModel(
                self.model_size,
                device=self.device,
                compute_type="float16" if torch.cuda.is_available() else "float32"
            )
        except Exception as e:
            raise Exception(f"Failed to load Whisper model: {str(e)}")
    
    async def transcribe_audio(
        self,
        audio_path: str,
        language: Optional[str] = None,
        task: str = "transcribe",
        **kwargs: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Transcribe audio file using WhisperX
        
        Args:
            audio_path: Path to the audio file
            language: Language code (optional)
            task: Task type (transcribe or translate)
            **kwargs: Additional arguments for the model
            
        Returns:
            Dictionary containing transcription results
        """
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")
            
        try:
            # Transcribe the audio
            segments, info = self.model.transcribe(
                audio_path,
                language=language,
                task=task,
                **kwargs
            )
            
            # Collect all segments
            transcriptions = []
            for segment in segments:
                transcriptions.append({
                    "text": segment.text,
                    "start": segment.start,
                    "end": segment.end,
                    "confidence": segment.confidence
                })
            
            return {
                "language": info.language,
                "language_probability": info.language_probability,
                "segments": transcriptions
            }
            
        except Exception as e:
            raise Exception(f"Error during transcription: {str(e)}")
    
    async def transcribe_audio_chunk(
        self,
        audio_chunk: bytes,
        language: Optional[str] = None,
        task: str = "transcribe",
        **kwargs: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Transcribe an audio chunk (e.g., from a stream)
        
        Args:
            audio_chunk: Audio data in bytes
            language: Language code (optional)
            task: Task type (transcribe or translate)
            **kwargs: Additional arguments for the model
            
        Returns:
            Dictionary containing transcription results
        """
        try:
            # Create a temporary file for the chunk
            temp_path = Path("temp_audio_chunk.wav")
            temp_path.write_bytes(audio_chunk)
            
            # Transcribe the chunk
            result = await self.transcribe_audio(
                str(temp_path),
                language=language,
                task=task,
                **kwargs
            )
            
            # Clean up
            temp_path.unlink()
            
            return result
            
        except Exception as e:
            raise Exception(f"Error during chunk transcription: {str(e)}") 
import whisperx
import torch
import numpy as np
import wave
import io

class WhisperManager:
    def __init__(self, model_size="base"):
        """Initialize the WhisperX model with specified size"""
        # Load WhisperX model with float32 compute type
        self.model = whisperx.load_model(
            model_size,
            device="cuda" if torch.cuda.is_available() else "cpu",
            compute_type="float32"
        )
    
    def transcribe_audio_chunk(self, audio_data):
        """Transcribe audio data using WhisperX"""
        try:
            # Save the audio data to a temporary file
            with open("temp_audio.wav", "wb") as f:
                f.write(audio_data)
            
            # Transcribe the audio
            result = self.model.transcribe("temp_audio.wav")
            
            return {
                "language": result["language"],
                "segments": [{
                    "text": segment["text"],
                    "confidence": segment.get("confidence", 1.0),
                    "start": segment["start"],
                    "end": segment["end"]
                } for segment in result["segments"]]
            }
        except Exception as e:
            print(f"Error in transcription: {str(e)}")
            return {"error": str(e)} 