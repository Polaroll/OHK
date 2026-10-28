const DEFAULT_BINDINGS = ["b", "u", "i", "o", "p"];

const CHORDS = {
    "1": "a",
    "2": "e",
    "3": "i",
    "4": "o",
    "5": "u",
    "12": "b",
    "13": "c",
    "14": "d",
    "15": "f",
    "23": "g",
    "24": "h",
    "25": "j",
    "34": "k",
    "35": "l",
    "45": "m",
    "123": "n",
    "124": "p",
    "125": "q",
    "134": "r",
    "135": "s",
    "145": "t",
    "234": "v",
    "235": "w",
    "245": "x",
    "345": "y",
    "1234": "z",
    "1235": "!",
    "1245": "?",
    "1345": ",",
    "2345": ".",
    "12345": " "
};

const BINDINGS_STORAGE_KEY = "ohk-bindings";

function loadSavedBindings() {
    try {
        const saved = JSON.parse(localStorage.getItem(BINDINGS_STORAGE_KEY));
        const valid = Array.isArray(saved)
            && saved.length === 5
            && saved.every((key) => typeof key === "string" && key.length === 1)
            && new Set(saved).size === 5;
        return valid ? saved : [...DEFAULT_BINDINGS];
    } catch {
        return [...DEFAULT_BINDINGS];
    }
}

function saveBindings(values) {
    try {
        localStorage.setItem(BINDINGS_STORAGE_KEY, JSON.stringify(values));
    } catch {
        // Storage may be unavailable; bindings simply will not persist.
    }
}
