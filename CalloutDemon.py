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

if __name__ == "__main__":
    eel.start('index.html', size=(800, 900))  # Start the Eel application with the specified window size
