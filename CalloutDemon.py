from tkinter import *
from tkinter import ttk

if __name__ == "__main__":
    screen = Tk()
    screen.geometry("300x300")
    
    main_form = ttk.Frame(screen, padding=10)
    main_form.grid()
    
    # Map Options
    maps = ['Ascent', 'Bind', 'Icebox', 'Split', 'Lotus', 'Breeze', 'Sunset']
    maps.sort()
    
    # Create a menu options
    selected_map = StringVar()
    selected_map.set('Ascent')
    
    # Creates dropdown
    ttk.OptionMenu(screen, selected_map, *maps).grid(column=0, row=0)
    
    screen.mainloop()