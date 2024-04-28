from tkinter import *
from tkinter import ttk
from PIL import ImageTk, Image # make sure install pillow lib
import os

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
        set_center_image()
        return
    
    current_callout.set("Omen Tree")
    set_center_image(labeled=False)
    
    
    
            
if __name__ == "__main__":
    screen = Tk()
    screen.geometry("800x800")
    
    main_form = ttk.Frame(screen, padding=10)
    main_form.grid()
    
    # Map Options
    maps = ['Ascent', 'Bind', 'Icebox', 'Split', 'Lotus', 'Breeze', 'Sunset', 'Ascent']
    maps.sort()
    
    # Create a menu options
    selected_map = StringVar(value = maps[0])
    
    # Creates dropdown
    ttk.OptionMenu(screen, selected_map, *maps).grid(column=0, row=0)
    
    #Map Folder
    map_folder = os.path.join("images/maps")
            
    default_map = os.path.join(map_folder, 'ascent_labeled.png')
    default_map = ImageTk.PhotoImage(Image.open(default_map).resize((600,600)))

    image_label = ttk.Label(screen, image=default_map)
    image_label.grid(column=1, row=1)
    selected_map.trace_add('write', lambda *args: display_image(selected_map, map_folder))
    
    # Label to hold callout
    current_callout = StringVar()
    ttk.Label(screen, textvariable=current_callout).grid(column=1, row=10)
    
    practice_button = ttk.Button(screen, text="Start/Stop Practice", command = practice_loop).grid(column=1, row=0)
    screen.mainloop()