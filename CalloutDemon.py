from tkinter import *
from tkinter import ttk
from PIL import ImageTk, Image

if __name__ == "__main__":
    screen = Tk()
    screen.geometry("800x800")
    
    main_form = ttk.Frame(screen, padding=10)
    main_form.grid()
    
    # Map Options
    maps = ['Ascent', 'Bind', 'Icebox', 'Split', 'Lotus', 'Breeze', 'Sunset', 'Ascent']
    maps.sort()
    
    # Create a menu options
    selected_map = StringVar()
    selected_map.set('Ascent')
    
    # Creates dropdown
    ttk.OptionMenu(screen, selected_map, *maps).grid(column=0, row=0)
    
    #Map Folder
    unlabeld_map = {
        'Ascent' : 'Ascent.png',
        'Bind' : 'Bind.png',
        'Icebox' : 'Icebox.png',
        'Split' : 'Split.png',
        'Lotus' : 'Lotus.png',
        'Breeze' : 'Breeze.png',
        'Sunset' : 'Sunset.png',
    }
    
    #Displaying Map
    def display_image(selected_map):
        map_name = selected_map.get()
        map_path = unlabeld_map.get(map_name)
        if map_path:
            map = Image.open(map_path)
            map = map.resize((600, 600))
            photo = ImageTk.PhotoImage(map)
            image_label.config(image = photo)
            image_label.image = photo

    image_label = ttk.Label(screen)
    image_label.grid(column=1, row=1)
    selected_map.trace_add('write', lambda *args: display_image(selected_map))
    display_image(selected_map)
    
    screen.mainloop()