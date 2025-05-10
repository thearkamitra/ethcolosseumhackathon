import sounddevice as sd
import numpy as np
import wave
import io
import time
from llm.chain import LangChainManager
from transcription.whisper_manager import WhisperManager

# Initialize managers
llm_manager = LangChainManager()
whisper_manager = WhisperManager(model_size="base")

# Audio recording settings
SAMPLE_RATE = 16000
CHANNELS = 1
SILENCE_THRESHOLD = 0.005  # Lower threshold to detect silence more easily
SILENCE_DURATION = 0.3  # Shorter silence duration for more frequent transcription
MIN_AUDIO_LENGTH = 0.5  # Shorter minimum audio length
MAX_AUDIO_LENGTH = 5.0  # Maximum audio length before forcing transcription

def chat(message: str):
    """Send a message to the LLM and get a response"""
    try:
        response = llm_manager.generate_response(message)
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}

def agent(message: str):
    """Send a message to the agent and get a response"""
    try:
        response = llm_manager.run_agent(message)
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}

def transcribe_audio(audio_data: bytes):
    """Transcribe an audio file"""
    try:
        result = whisper_manager.transcribe_audio_chunk(audio_data)
        return result
    except Exception as e:
        return {"error": str(e)}

def process_audio_stream(audio_queue, callback):
    """Process audio data and detect silence"""
    print("Starting audio processing")
    audio_buffer = []
    silence_counter = 0
    recording = True
    last_process_time = time.time()
    
    while recording:
        try:
            print("Waiting for audio data...", end='\r')
            data = audio_queue.get()
            audio_buffer.extend(data.flatten())
            current_time = time.time()
            
            # Check for silence or max length
            if np.abs(data).mean() < SILENCE_THRESHOLD:
                silence_counter += len(data) / SAMPLE_RATE
            else:
                silence_counter = 0
            
            # Process audio if silence detected or max length reached
            audio_length = len(audio_buffer) / SAMPLE_RATE
            if ((silence_counter >= SILENCE_DURATION and audio_length >= MIN_AUDIO_LENGTH) or 
                audio_length >= MAX_AUDIO_LENGTH):
                print("\nProcessing audio...")
                # Convert buffer to WAV format
                buffer = io.BytesIO()
                with wave.open(buffer, 'wb') as wf:
                    wf.setnchannels(CHANNELS)
                    wf.setsampwidth(2)  # 16-bit audio
                    wf.setframerate(SAMPLE_RATE)
                    wf.writeframes(np.array(audio_buffer).tobytes())
                
                # Transcribe the audio
                result = whisper_manager.transcribe_audio_chunk(buffer.getvalue())
                if result and "segments" in result:
                    for segment in result["segments"]:
                        print(f"\nTranscription: {segment['text']}")
                
                # Reset buffer and silence counter
                audio_buffer = []
                silence_counter = 0
                last_process_time = current_time
                
        except KeyboardInterrupt:
            print("\nAudio processing cancelled")
            recording = False
            break
        except Exception as e:
            print(f"\nError processing audio: {str(e)}")
            break

def audio_callback(indata, frames, time, status, audio_queue):
    """Callback function for audio input"""
    if status:
        print(f"\nAudio callback status: {status}")
    try:
        audio_queue.put(indata.copy())
    except Exception as e:
        print(f"\nError in audio callback: {str(e)}")

if __name__ == "__main__":
    print("Starting audio listening and transcription...")
    print("Speak into your microphone. Press Ctrl+C to stop.")
    
    from queue import Queue
    audio_queue = Queue()
    
    # Create the callback with the queue
    callback = lambda indata, frames, time, status: audio_callback(
        indata, frames, time, status, audio_queue
    )
    
    print("Starting audio stream...")
    try:
        with sd.InputStream(samplerate=SAMPLE_RATE, channels=CHANNELS, callback=callback):
            print("Audio stream started successfully")
            process_audio_stream(audio_queue, None)
    except KeyboardInterrupt:
        print("\nStopping audio recording...")
    except Exception as e:
        print(f"\nError: {str(e)}") 