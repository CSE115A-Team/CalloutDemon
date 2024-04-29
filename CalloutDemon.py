from tkinter import *
from tkinter import ttk
from PIL import ImageTk, Image # make sure install pillow lib

import os
import random
import json

# Holds current callouts and locations
callout_dictionary = {}

# Sets the center image based on current selected map
def set_center_image(labeled = True):
    
    map_suffix = "_unlabeled.png"
    if labeled:
        map_suffix = "_labeled.png"
    
    current_map = selected_map.get().lower()
    map_path = os.path.join("images/maps/", current_map + map_suffix)
    if os.path.exists(map_path):
        map = Image.open(map_path).resize((600, 600))
        photo = ImageTk.PhotoImage(map)
        image_label.config(image = photo)
        image_label.image = photo
    
#Displaying Map
def display_image(map: StringVar, folder):
    set_center_image()
    current_callout.set("")
        
def practice_loop():
    
    # Decides if game is already being practiced
    if current_callout.get() != "":
        current_callout.set("")
        practice_button_text.set("Start Practice")
        set_center_image()
        return
    
    # Gets current maps then loads json holding callouts
    current_map = selected_map.get().lower()
    with open("settings/" + current_map + "_callouts.json") as file:
        callout_dictionary = json.load(file)
        
    # Chooses random callout
    new_callout = random.choice(list(callout_dictionary.keys()))

    current_callout.set(new_callout)
    set_center_image(labeled=False)
    practice_button_text.set("Stop Practice")
    
if __name__ == "__main__":
    
    # Creates Screen
    screen = Tk()
    screen.geometry("800x800")
    
    # Creates main form
    main_form = ttk.Frame(screen, padding=10)
    main_form.grid()
    
    # Map Options
    maps = ['Ascent', 'Bind', 'Icebox', 'Split', 'Lotus', 'Breeze', 'Sunset', 'Ascent']
    maps.sort()
    
    # Creates dropdown menu and string variable
    selected_map = StringVar(value = maps[0])
    ttk.OptionMenu(screen, selected_map, *maps).grid(column=0, row=0)
    
    # Sets center photo and logic to change it with OptionMenu
    image_label = ttk.Label(screen)
    image_label.grid(column=1, row=1)
    selected_map.trace_add('write', lambda *args: display_image())
    set_center_image()
    
    # Current callout label and string variable
    current_callout = StringVar()
    ttk.Label(screen, textvariable=current_callout).grid(column=1, row=10)
    
    # Practice button logic and string variable
    practice_button_text = StringVar(value="Start Practice")
    practice_button = ttk.Button(screen, textvariable=practice_button_text, command = practice_loop).grid(column=1, row=0)
    screen.mainloop()