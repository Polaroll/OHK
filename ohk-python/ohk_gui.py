from tkinter import *
from tkinter import ttk
import ohk_translator as ohk


def main():
    global root

    root = Tk()

    root.geometry("1000x600")
    frame = Frame(root)
    frame.pack()
    frame.master.title("One Handed Keyboard")
    root.mainloop()

def populate_frame():
    pass





main()