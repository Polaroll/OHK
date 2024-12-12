def main():
    
    print()

    user_msg = input("Input OHK message to translate: ")
    user_msg_list = convert_msg_to_list(user_msg)
    translated_msg = translate_msg(user_msg_list)

    character_count = 0
    for character in translated_msg:
        character_count += 1
        print(character, end="")
        if character == "." or character == "?" or character == "!":
            print()
            character_count = 0
        if character_count > 100 and character == " " : 
            print()
            character_count = 0

def convert_msg_to_list(user_msg):
    # Converts the user message to a list to allow for easy comparison of inputs in translation
    user_msg_list = user_msg.split()
    return user_msg_list

def translate_msg(user_msg_list):
    # sorts out the numbers inputed from the OHK in ascending order
    for letter in range(len(user_msg_list)):
        if len(user_msg_list[letter]) > 1 :
            letter_sort = list(user_msg_list[letter])
            letter_sort.sort()
            user_msg_list[letter] = "".join(letter_sort)
        
        user_msg_list[letter] = int(user_msg_list[letter])
    
        # Translates the users button inputs into letters
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

    return user_msg_list
    


if __name__ == "__main__":
    main()