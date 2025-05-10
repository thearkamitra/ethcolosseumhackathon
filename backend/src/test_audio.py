import asyncio
import websockets
import sounddevice as sd
import numpy as np
import json

async def test_audio_recording():
    print("Attempting to connect to WebSocket server...")
    # Connect to WebSocket
    uri = "ws://localhost:8000/ws/audio"
    async with websockets.connect(uri) as websocket:
        print("Successfully connected to WebSocket server")
        print("Recording... (Press Ctrl+C to stop)")
        
        try:
            while True:
                print("Waiting for transcription...")
                # Wait for transcription results
                response = await websocket.recv()
                result = json.loads(response)
                print("\nTranscription received:")
                print(f"Language: {result['language']}")
                print(f"Text: {result['segments'][0]['text']}")
                print(f"Confidence: {result['segments'][0]['confidence']:.2f}")
        except KeyboardInterrupt:
            print("\nStopping recording...")
            await websocket.send("stop")
            print("Recording stopped")
        except Exception as e:
            print(f"Error during recording: {str(e)}")

if __name__ == "__main__":
    print("Starting audio test...")
    try:
        asyncio.run(test_audio_recording())
    except KeyboardInterrupt:
        print("\nTest stopped by user")
    except Exception as e:
        print(f"Test failed with error: {str(e)}") 