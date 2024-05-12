import json
import random
import eel
import os
import wave
import io
import base64
import ffmpeg

eel.init('web')  # Initialize Eel with the 'web' directory

@eel.expose
def get_random_callout(map_name):
    json_path = os.path.join('web', 'settings', map_name.lower() + '_callouts.json')
    try:
        with open(json_path, 'r') as file:
            callouts = json.load(file)
            # Select a random callout name
            callout_name = random.choice(list(callouts.keys()))
            # Fetch the corresponding data
            callout_data = callouts[callout_name]
            return callout_name, callout_data
    except Exception as e:
        print(f"Failed to read {json_path}: {str(e)}")
        return None

@eel.expose
def receive_coordinates(x, y):
    print(f"Clicked at x: {x}, y: {y}")
    
    
@eel.expose
def receive_audio_data(audio_chunks):
    
    # Convert opus to PCM encoded data
    opus_data = base64.b64decode(audio_chunks)
    # print(audio_chunks)
    
    opus_io = io.BytesIO(opus_data)
    
    pcm_audio, _ = (
        ffmpeg.input('pipe:0')
        .output('pipe:1', format='s16le', acodec='pcm_s16le', ar='44100', ac='2')
        .run(input=opus_io, capture_stdout=True, capture_stderr=True)
    )

    # Write PCM data to a WAV file
    with wave.open("output.wav", "wb") as wav_file:
        wav_file.setnchannels(2)
        wav_file.setsampwidth(2)
        wav_file.setframerate(44100)
        wav_file.writeframes(pcm_audio)

    print("Audio data received and saved as WAV!")

if __name__ == "__main__":
    eel.start('index.html', size=(800, 800))  # Start the Eel application with the specified window size
