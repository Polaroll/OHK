const bindingInputs = [...document.querySelectorAll(".binding input")];
const bindingRows = [...document.querySelectorAll(".binding")];
const input = document.querySelector("#input");
const output = document.querySelector("#output");
const bindingMessage = document.querySelector("#binding-message");
const captureStatus = document.querySelector("#capture-status");
const statusText = document.querySelector("#status-text");
const keyTableBody = document.querySelector("#key-table-body");
const focusCaptureButton = document.querySelector("#focus-capture");
const clearOutputButton = document.querySelector("#clear-output");
const resetBindingsButton = document.querySelector("#reset-bindings");

const activeKeys = new Set();
const chordKeys = new Set();
const enteredChords = [];

let bindings = new Map();
let bindingsAreValid = true;

function normaliseKey(key) {
    return key.toLowerCase();
}

function getBindings() {
    return bindingInputs.map((inputElement) => normaliseKey(inputElement.value.trim()));
}

function updateBindings() {
    const values = getBindings();
    const invalidValue = values.some((value) => value.length !== 1);
    const hasDuplicates = new Set(values).size !== values.length;

    if (invalidValue || hasDuplicates) {
        bindingsAreValid = false;
        bindingMessage.textContent = invalidValue
            ? "Enter one character for every finger."
            : "Each finger needs a different key.";
        bindingMessage.classList.add("is-error");
        return;
    }

    bindingsAreValid = true;
    saveBindings(values);
    bindings = new Map(values.map((value, index) => [value, index + 1]));
    bindingMessage.textContent = "Your key bindings are ready.";
    bindingMessage.classList.remove("is-error");
}

function setStatus(message, isActive = false) {
    statusText.textContent = message;
    captureStatus.classList.toggle("is-active", isActive);
}

function updatePressedBindings() {
    bindingRows.forEach((row, index) => {
        const key = bindingInputs[index].value;
        row.classList.toggle("is-pressed", activeKeys.has(normaliseKey(key)));
    });
}

function updateTranslation() {
    input.value = enteredChords.map((entry) => entry.keys.join(" + ")).join("  |  ");
    output.value = enteredChords.map((entry) => entry.letter).join("");
}

function completeChord() {
    const fingerPositions = [...chordKeys]
        .map((key) => bindings.get(key))
        .sort((left, right) => left - right)
        .join("");

    const letter = CHORDS[fingerPositions];
    if (letter) {
        enteredChords.push({ keys: [...chordKeys].sort(), letter });
        updateTranslation();
        setStatus(`Translated ${letter === " " ? "a space" : `"${letter}"`}. Ready for the next chord.`);
    }

    chordKeys.clear();
}

function resetActiveChord(message = "Current chord cancelled. Ready when you are.") {
    activeKeys.clear();
    chordKeys.clear();
    updatePressedBindings();
    setStatus(message);
}

function handleKeyDown(event) {
    if (!bindingsAreValid || document.activeElement !== input) {
        return;
    }

    const key = normaliseKey(event.key);

    if (key === "escape") {
        event.preventDefault();
        resetActiveChord();
        return;
    }

    if (key === "backspace") {
        event.preventDefault();
        enteredChords.pop();
        updateTranslation();
        setStatus("Removed the last chord.");
        return;
    }

    if (!bindings.has(key)) {
        return;
    }

    event.preventDefault();
    if (event.repeat || activeKeys.has(key)) {
        return;
    }

    activeKeys.add(key);
    chordKeys.add(key);
    updatePressedBindings();
    setStatus(`Holding ${[...chordKeys].sort().join(" + ")}. Release all keys to translate.`, true);
}

function handleKeyUp(event) {
    if (!bindingsAreValid || document.activeElement !== input) {
        return;
    }

    const key = normaliseKey(event.key);
    if (!bindings.has(key)) {
        return;
    }

    event.preventDefault();
    activeKeys.delete(key);
    updatePressedBindings();

    if (activeKeys.size === 0 && chordKeys.size > 0) {
        completeChord();
    }
}

function renderKeyTable() {
    keyTableBody.replaceChildren(
        ...Object.entries(CHORDS).map(([fingering, letter]) => {
            const row = document.createElement("tr");
            const fingeringCell = document.createElement("td");
            const letterCell = document.createElement("td");

            fingeringCell.textContent = fingering;
            letterCell.textContent = letter === " " ? "Space" : letter.toUpperCase();
            row.append(fingeringCell, letterCell);
            return row;
        })
    );
}

bindingInputs.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
        inputElement.value = normaliseKey(inputElement.value.slice(-1));
        updateBindings();
        resetActiveChord("Bindings updated. Focus the practice area to continue.");
    });
});

focusCaptureButton.addEventListener("click", () => {
    if (bindingsAreValid) {
        input.focus();
        setStatus("Practice area focused. Hold a chord to begin.");
    }
});

clearOutputButton.addEventListener("click", () => {
    enteredChords.length = 0;
    updateTranslation();
    resetActiveChord("Your practice text is clear.");
    input.focus();
});

resetBindingsButton.addEventListener("click", () => {
    bindingInputs.forEach((inputElement, index) => {
        inputElement.value = DEFAULT_BINDINGS[index];
    });
    updateBindings();
    resetActiveChord("Default keys restored. Focus the practice area to begin.");
});

input.addEventListener("keydown", handleKeyDown);
input.addEventListener("keyup", handleKeyUp);
input.addEventListener("blur", () => resetActiveChord("Practice paused. Focus the input area to continue."));
window.addEventListener("blur", () => resetActiveChord("Practice paused. Focus the input area to continue."));

const savedBindings = loadSavedBindings();
bindingInputs.forEach((inputElement, index) => {
    inputElement.value = savedBindings[index];
});
updateBindings();
renderKeyTable();

