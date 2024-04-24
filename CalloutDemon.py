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
    labeled_maps = ['ascent', 'bind', 'breeze', 'fracture', 'haven', 'icebox', 'pearl', 'ascent']
    labeled_maps.sort()
    
    # Create a menu options
    selected_map = StringVar()
    selected_map.set('Ascent')
    selected_map_labeled = StringVar()
    selected_map_labeled.set('ascent')
    
    # Creates dropdown
    ttk.OptionMenu(screen, selected_map, *maps).grid(column=0, row=0)
    ttk.OptionMenu(screen, selected_map_labeled, *labeled_maps).grid(column=10, row=0)
    
    #Map Folder
    unlabeled_map = "Maps"
    labeled_maps_folder = "labeled_maps"
    
    #Displaying Map
    def display_image(map, folder):
        map_name = map.get()
        map_path = os.path.join(folder, map_name.lower() + ".png")
        if os.path.exists(map_path):
            map = Image.open(map_path)
            map = map.resize((600, 600))
            photo = ImageTk.PhotoImage(map)
            image_label.config(image = photo)
            image_label.image = photo

    image_label = ttk.Label(screen)
    image_label.grid(column=1, row=1)
    selected_map.trace_add('write', lambda *args: display_image(selected_map, unlabeled_map))
    selected_map_labeled.trace_add('write', lambda *args: display_image(selected_map_labeled, labeled_maps_folder))
    display_image(selected_map, unlabeled_map)
    display_image(selected_map_labeled, labeled_maps_folder)
    
    screen.mainloop()