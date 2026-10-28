# """Small Tkinter-based GUI creator for buttons and input fields."""

# import tkinter as tk
# from tkinter import ttk
# from typing import Callable, Optional


# class GUI:
# 	"""Build a simple window using fluent button and input helpers."""

# 	def __init__(self, title: str = "OHK GUI", width: int = 400, height: int = 250):
# 		self.root = tk.Tk()
# 		self.root.title(title)
# 		self.root.geometry(f"{width}x{height}")
# 		self.root.minsize(250, 150)
# 		self._content = ttk.Frame(self.root, padding=16)
# 		self._content.pack(fill="both", expand=True)
# 		self._row = 0
# 		self.inputs: dict[str, tk.StringVar] = {}

# 	def add_input(self, name: str, label: Optional[str] = None,
# 				  default: str = "") -> tk.Entry:
# 		"""Add a labelled input field and return its Entry widget."""
# 		ttk.Label(self._content, text=label or name).grid(
# 			row=self._row, column=0, sticky="w", padx=(0, 8), pady=5
# 		)
# 		value = tk.StringVar(value=default)
# 		entry = ttk.Entry(self._content, textvariable=value)
# 		entry.grid(row=self._row, column=1, sticky="ew", pady=5)
# 		self.inputs[name] = value
# 		self._row += 1
# 		self._content.columnconfigure(1, weight=1)
# 		return entry

# 	def get_input(self, name: str) -> str:
# 		"""Return the current value of a named input field."""
# 		if name not in self.inputs:
# 			raise KeyError(f"Unknown input: {name}")
# 		return self.inputs[name].get()

# 	def add_button(self, text: str, command: Optional[Callable[[], None]] = None) -> ttk.Button:
# 		"""Add a button. Its callback is invoked when it is clicked."""
# 		button = ttk.Button(self._content, text=text, command=command)
# 		button.grid(row=self._row, column=0, columnspan=2, sticky="ew", pady=(10, 0))
# 		self._row += 1
# 		return button

# 	def run(self) -> None:
# 		"""Start the GUI event loop."""
# 		self.root.mainloop()


# if __name__ == "__main__":
# 	app = GUI()
# 	app.add_input("name", "Name")
# 	app.add_button("Show name", lambda: print(app.get_input("name")))
# 	app.run()
