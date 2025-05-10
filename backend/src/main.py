import sounddevice as sd
import numpy as np
import wave
import io
import time
from src.llm.chain import LangChainManager
from src.transcription.whisper_manager import WhisperManager

# Initialize managers
llm_manager = LangChainManager()
whisper_manager = WhisperManager(model_size="base")

# Audio recording settings
SAMPLE_RATE = 16000
CHANNELS = 1
SILENCE_THRESHOLD = 0.01  # Adjust this value based on your needs
SILENCE_DURATION = 1.0  # Duration of silence in seconds to stop recording

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
    
    while recording:
        try:
            print("Waiting for audio data...")
            data = audio_queue.get()
            print(f"Received audio data chunk of size: {len(data)}")
            audio_buffer.extend(data.flatten())
            
            # Check for silence
            if np.abs(data).mean() < SILENCE_THRESHOLD:
                silence_counter += len(data) / SAMPLE_RATE
                print(f"Silence detected: {silence_counter:.2f}s")
                if silence_counter >= SILENCE_DURATION:
                    print("Processing audio after silence...")
                    # Convert buffer to WAV format
                    buffer = io.BytesIO()
                    with wave.open(buffer, 'wb') as wf:
                        wf.setnchannels(CHANNELS)
                        wf.setsampwidth(2)  # 16-bit audio
                        wf.setframerate(SAMPLE_RATE)
                        wf.writeframes(np.array(audio_buffer).tobytes())
                    
                    print("Sending audio for transcription...")
                    # Transcribe the audio
                    result = whisper_manager.transcribe_audio_chunk(buffer.getvalue())
                    print(f"Transcription result: {result}")
                    callback(result)
                    
                    # Reset buffer and silence counter
                    audio_buffer = []
                    silence_counter = 0
                    print("Reset audio buffer and silence counter")
            else:
                silence_counter = 0
                
        except KeyboardInterrupt:
            print("Audio processing cancelled")
            recording = False
            break
        except Exception as e:
            print(f"Error processing audio: {str(e)}")
            break

def audio_callback(indata, frames, time, status, audio_queue):
    """Callback function for audio input"""
    if status:
        print(f"Audio callback status: {status}")
    try:
        print(f"Audio callback: received {len(indata)} frames")
        audio_queue.put(indata.copy())
    except Exception as e:
        print(f"Error in audio callback: {str(e)}")

if __name__ == "__main__":
    print("Starting audio listening and transcription...")
    
    def result_callback(result):
        print("\nTranscription received:")
        print(f"Language: {result['language']}")
        print(f"Text: {result['segments'][0]['text']}")
        print(f"Confidence: {result['segments'][0]['confidence']:.2f}")
    
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
            print("Listening... (Press Ctrl+C to stop)")
            process_audio_stream(audio_queue, result_callback)
    except KeyboardInterrupt:
        print("\nStopping audio recording...")
    except Exception as e:
        print(f"Error: {str(e)}") 