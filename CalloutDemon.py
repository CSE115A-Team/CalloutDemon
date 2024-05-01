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

def handle_map_click(event):
    # Load callouts with their coordinates
    current_map = selected_map.get().lower()
    with open(f"settings/{current_map}_callouts.json") as file:
        callouts = json.load(file)

    # Determine if the click is within any callout area
    for callout, coords in callouts.items():
        if coords['x'] <= event.x <= coords['x'] + coords['width'] and \
           coords['y'] <= event.y <= coords['y'] + coords['height']:
            print(f"Clicked on callout: {callout}")
            return
    print("Clicked outside any callout")

# def handle_map_click(event):
    # # Get the coordinates of the click relative to the top-left corner of the image
    # x = event.x
    # y = event.y
    # print(f"Map clicked at ({x}, {y})")
    # # Additional functionality will be added here to respond to the click

#Displaying Map
def display_image():
    set_center_image()
    current_callout.set("")

def toggle_canvas_transparency(event):
    global canvas_transparent
    canvas_transparent = not canvas_transparent
    if canvas_transparent:
        screen.wm_attributes("-topmost", True) # Sets window at top most
        screen.wm_attributes("-alpha", "0.1")  # Set transparent
        practice_button.config(state='disabled') #Disables button
    else:
        screen.wm_attributes("-alpha", 1.0)  # Disable transparency   
        screen.wm_attributes("-topmost", False) #Disables top most priority
        practice_button.config(state='normal') #Enables button
        

def practice_loop():
    
    # Decides if game is already being practiced
    if current_callout.get() != "":
        current_callout.set("")
        practice_button_text.set("Start Practice")
        set_center_image()
        # Unbind Mouse Click
        image_label.unbind("<Button-1>") 
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

    # Bind Mouse Click
    image_label.bind("<Button-1>", handle_map_click)

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
    image_label = Label(screen)
    image_label.grid(column=1, row=1)
    selected_map.trace_add('write', lambda *args: display_image())
    set_center_image()
    
    # Current callout label and string variable
    current_callout = StringVar()
    ttk.Label(screen, textvariable=current_callout).grid(column=1, row=10)
    
    # Practice button logic and string variable
    practice_button_text = StringVar(value="Start Practice")
    practice_button = ttk.Button(screen, textvariable=practice_button_text, command = practice_loop, state='normal')
    practice_button.grid(column=1, row=0)
    
    # Toggle canvas transparency on pressing "m"
    canvas_transparent = False
    screen.bind("m", toggle_canvas_transparency)
    


    screen.mainloop()