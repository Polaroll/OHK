def main():
    
    print() # Spacer

    button_map = {1: '1', 2: '2', 3: '3', 4: '4', 5: '5'}

    button_map = remap_buttons(button_map)
    msg = input("Input OHK message to translate: ") # String
    msg_list = convert_msg_to_list(msg) # List of strings
    preprocessed_msg_list = preprocess_msg(msg_list, button_map)

    translated_msg = translate_msg(preprocessed_msg_list)

    print() # Spacer

    terminal_print(translated_msg)

    print() # Spacer

def convert_msg_to_list(user_msg):
    ''' Converts the user message to a list to allow for easy comparison of inputs in translation '''
    user_msg_list = user_msg.split()
    return user_msg_list

def preprocess_msg(user_msg_list, button_map):
    ''' Converts from button map to numbers and sorts the numbers in each letter '''


    # Takes each list item and converts each char in the list item to int according to the button map
    for i in range(len(user_msg_list)): 
        letter_list = list(user_msg_list[i]) 

        # Converts each letter's chars into integers according to button mapping
        for j in range(len(letter_list)): 
            for key, button in button_map.items(): 
                if letter_list[j] == button:
                    letter_list[j] = key

        letter_list.sort()
        user_msg_list[i] = "".join(letter_list)
        user_msg_list[i] = int(user_msg_list[i])

    return user_msg_list

def translate_msg(user_msg_list):
    ''' Receives a list of numbers then translates them into letters '''

    for letter in range(len(user_msg_list)):

        match user_msg_list[letter]:
            case 1:
                user_msg_list[letter] = "a"
            case 2:
                user_msg_list[letter] = "e"
            case 3:
                user_msg_list[letter] = "i"
            case 4:
                user_msg_list[letter] = "o"
            case 5:
                user_msg_list[letter] = "u"
            case 12:
                user_msg_list[letter] = "b"
            case 13:
                user_msg_list[letter] = "c"
            case 14:
                user_msg_list[letter] = "d"
            case 15:
                user_msg_list[letter] = "f"
            case 23:
                user_msg_list[letter] = "g"
            case 24:
                user_msg_list[letter] = "h"
            case 25:
                user_msg_list[letter] = "j"
            case 34:
                user_msg_list[letter] = "k"
            case 35:
                user_msg_list[letter] = "l"
            case 45:
                user_msg_list[letter] = "m"
            case 123:
                user_msg_list[letter] = "n"
            case 124:
                user_msg_list[letter] = "p"
            case 125:
                user_msg_list[letter] = "q"
            case 134:
                user_msg_list[letter] = "r"
            case 135:
                user_msg_list[letter] = "s"
            case 145:
                user_msg_list[letter] = "t"
            case 234:
                user_msg_list[letter] = "v"
            case 235:
                user_msg_list[letter] = "w"
            case 245:
                user_msg_list[letter] = "x"
            case 345:
                user_msg_list[letter] = "y"
            case 1234:
                user_msg_list[letter] = "z"
            case 1235:
                user_msg_list[letter] = "!"
            case 1245:
                user_msg_list[letter] = "?"
            case 1345:
                user_msg_list[letter] = ","
            case 2345:
                user_msg_list[letter] = "."
            case 12345:
                user_msg_list[letter] = " "
            case _:
                user_msg_list[letter] = "error"

    return user_msg_list
    
def remap_buttons(button_map):
    ''' Gets the keys the user wishes to use for the OHK '''

    button_1 = input("Key for thumb: ").lower()
    button_2 = input("Key for pointer: ").lower()
    button_3 = input("Key for middle: ").lower()
    button_4 = input("Key for ring: ").lower()
    button_5 = input("Key for pinky: ").lower()
    button_map = {'1': button_1, '2': button_2, '3': button_3, '4': button_4, '5': button_5}
    return button_map

def terminal_print(msg):
    ''' Prints the message in a user friendly way '''
    char_count = 0
    for char in msg:
        char_count += 1
        print(char, end="")
        if char == "." or char == "?" or char == "!":
            print()
            char_count = 0
        if char_count > 100 and char == " " : 
            print()
            char_count = 0

if __name__ == "__main__":
    main()