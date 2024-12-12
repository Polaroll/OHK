// def main():
    
//     print()

//     user_msg = input("Input OHK message to translate: ")
//     user_msg_list = convert_msg_to_list(user_msg)
//     translated_msg = translate_msg(user_msg_list)


const input = document.querySelector('#input');
const output = document.querySelector('#output')
// var msg = []
// msg = convertMessageToArray(input.value);


input.addEventListener('keydown', tracker);
input.addEventListener('keyup', updateInput);

const finger1 = document.querySelector('#finger-1').value
const finger2 = document.querySelector('#finger-2').value
const finger3 = document.querySelector('#finger-3').value
const finger4 = document.querySelector('#finger-4').value
const finger5 = document.querySelector('#finger-5').value



var msg = []
var numberMsg = []
var outputMsg = []

const acceptedKeys = [
    finger1, finger2, finger3, finger4, finger5
]
var numTracker = 0;

function tracker(event) {
    if (acceptedKeys.includes(event.key)) {
        numTracker += 1;
        console.log(event.key);
        console.log(numTracker);
    }
}

function updateInput(event){
    if (acceptedKeys.includes(event.key)) {
        numTracker -= 1
        console.log(numTracker);
        if (numTracker === 0){
            input.value += ' ';
            msg = convertMessageToArray(input.value);
            console.log(msg);
            numberMsg = convertMessageToNumbers(msg);
            console.log(numberMsg);
            const processing = combineNumbers(numberMsg);
            outputMsg = translateMsg(processing)
            output.value = ''
            for (letter of outputMsg) {
                output.value += letter
            }
        }
    }
    else if (event.key === 'Control') {
        numTracker = 0;
    }
 }

function convertMessageToArray(userMsg) {
    const msgArray = Array.from(userMsg);
    msg = msgArray.filter(x => x !== ' ');
    return msgArray;
}

function convertMessageToNumbers(array) {
    const newArray = [];
    for(letter of array) {
        switch (letter) {
            case finger1:
                newArray.push(1)
                break
            case finger2:
                newArray.push(2)
                break
            case finger3:
                newArray.push(3)
                break
            case finger4:
                newArray.push(4)
                break
            case finger5:
                newArray.push(5)
                break
            case ' ':
                newArray.push(' ')
        }
    }
    return newArray;
}

function combineNumbers(array) {
    const numArray = []
    var newArray = [];
    for (element of array) {
        if (!(element === ' ')) {
            newArray.push(element);
            console.log(newArray)
        }
        else {
            newArray.sort()
            const string = newArray.join('')
            const number = parseInt(string)
            if (number > 0) {
                numArray.push(number)
            }
            newArray = []
        }
    }
    console.log(numArray)
    return numArray
}
        
function translateMsg(msgArray) {
    const translatedMsg = []

    for (number of msgArray) {
        var letter = ''
        switch (number) {
            case 1:
                letter = 'a'
                break
            case 2:
                letter = 'e'
                break
            case 3:
                letter = 'i'
                break
            case 4:
                letter = 'o'
                break
            case 5:
                letter = 'u'
                break
            case 12:
                letter = 'b'
                break
            case 13:
                letter = 'c'
                break
            case 14:
                letter = 'd'
                break
            case 15:
                letter = 'f'
                break
            case 23:
                letter = 'g'
                break
            case 24:
                letter = 'h'
                break
            case 25:
                letter = 'j'
                break
            case 34:
                letter = 'k'
                break
            case 35:
                letter = 'l'
                break
            case 45:
                letter = 'm'
                break
            case 123:
                letter = 'n'
                break
            case 124:
                letter = 'p'
                break
            case 125:
                letter = 'q'
                break
            case 134:
                letter = 'r'
                break
            case 135:
                letter = 's'
                break
            case 145:
                letter = 't'
                break
            case 234:
                letter = 'v'
                break
            case 235:
                letter = 'w'
                break
            case 245:
                letter = 'x'
                break
            case 345:
                letter = 'y'
                break
            case 1234:
                letter = 'z'
                break
            case 1235:
                letter = "!"
                break
            case 1245:
                letter = "?"
                break
            case 1345:
                letter = ","
                break
            case 2345:
                letter = "."
                break
            case 12345:
                letter = " "
                break
        }
        translatedMsg.push(letter)
    }
    return translatedMsg
}