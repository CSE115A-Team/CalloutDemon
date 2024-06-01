import json
import random
import eel
import os

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
def get_random_image(map_name):
    images_directory = os.path.join('web', 'images', 'maps', 'Vocal', map_name.lower())
    try:
        images = os.listdir(images_directory)
        print(f"Accessing directory: {images_directory}")
        print(f"Found images: {images}")
        if images:
            selected_image = random.choice(images)
            print(f"Selected image: {selected_image}")
            return selected_image
        else:
            return None
    except Exception as e:
        print(f"Failed to access directory {images_directory}: {str(e)}")
        return None

if __name__ == "__main__":
    eel.start('index.html', size=(800, 800))  # Start the Eel application with the specified window size
