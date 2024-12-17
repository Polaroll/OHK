from pynput import keyboard

def on_press(key):
    try:
        # Attempt to print the character associated with the key
        print(f'Key {key.char} pressed')
    except AttributeError:
        # If the key doesn't have a char attribute (e.g., special keys)
        print(f'Special key {key} pressed')


def on_release(key):
    print(f'Key {key} released')
    # Stop the listener if the escape key is pressed
    if key == keyboard.Key.esc:
        return False

# Set up the listener for keyboard events
with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
    listener.join()