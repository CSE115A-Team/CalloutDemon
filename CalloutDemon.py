from tkinter import *
from tkinter import ttk
from PIL import ImageTk, Image # make sure install pillow lib
import os

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
    
    #Displaying Map
    def display_image(map: StringVar, folder):
        map_name = map.get()
        map_path = os.path.join(folder, map_name.lower() + "_labeled.png")
        if os.path.exists(map_path):
            map = Image.open(map_path)
            map = map.resize((600, 600))
            photo = ImageTk.PhotoImage(map)
            image_label.config(image = photo)
            image_label.image = photo
            
    default_map = os.path.join(map_folder, 'ascent_labeled.png')
    default_map = ImageTk.PhotoImage(Image.open(default_map).resize((600,600)))

    image_label = ttk.Label(screen, image=default_map)
    image_label.grid(column=1, row=1)
    selected_map.trace_add('write', lambda *args: display_image(selected_map, map_folder))
    
    screen.mainloop()