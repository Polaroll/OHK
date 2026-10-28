const PROGRESS_KEY = "ohk-learn-progress";
const FINGER_NAMES = ["Thumb", "Index", "Middle", "Ring", "Pinky"];
const ITEMS_PER_LESSON = 10;

const LESSONS = [
    { id: "vowels", name: "Vowels", desc: "Single-finger chords: a, e, i, o, u.", items: ["a", "e", "i", "o", "u", "o", "a", "u", "e", "i"] },
    { id: "pairs", name: "Two-finger letters", desc: "Letters made from two fingers: b, c, d, f, g, h, j, k, l, m.", items: ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "d", "h", "c", "l", "g"] },
    { id: "triples", name: "Three-finger letters", desc: "n, p, q, r, s, t, v, w.", items: ["n", "p", "r", "s", "t", "v", "w", "q", "s", "t", "r", "n", "p", "w", "v"] },
    { id: "rare", name: "Rare letters", desc: "x, y and z.", items: ["x", "y", "z", "y", "x", "z", "z", "y", "x", "y"] },
    { id: "short-words", name: "Short words", desc: "Put letters together into three-letter words.", items: ["tea", "sun", "dog", "fit", "map", "run", "big", "hot", "cup", "web"] },
    { id: "words", name: "Longer words", desc: "Longer words using the whole alphabet.", items: ["chord", "finger", "thumb", "typing", "simple", "keyboard", "practice", "hand"] },
    { id: "phrases", name: "Phrases", desc: "Spaces and punctuation: a five-finger press for space, and more.", items: ["hello world.", "one hand!", "can you type?", "yes, i can.", "keep going."] }
];

const FINGERING_BY_CHAR = Object.fromEntries(Object.entries(CHORDS).map(([fingering, char]) => [char, fingering]));

const el = (id) => document.getElementById(id);
const lessonList = el("lesson-list");
const lessonTitle = el("lesson-title");
const lessonDesc = el("lesson-desc");
const session = el("session");
const summary = el("summary");
const startRow = el("start-row");
const startButton = el("start-lesson");
const target = el("target");
const fingerRow = el("finger-row");
const hintLine = el("hint-line");
const capture = el("capture");
const captureText = el("capture-text");
const feedback = el("feedback");
const progressText = el("progress-text");
const accuracyText = el("accuracy-text");
const progressFill = el("progress-fill");
const showHints = el("show-hints");

const bindingKeys = loadSavedBindings();
const keyToFinger = new Map(bindingKeys.map((key, index) => [key.toLowerCase(), index + 1]));
const activeKeys = new Set();
const chordKeys = new Set();

let progress = loadProgress();
let selectedIndex = 0;
let run = null;

function loadProgress() {
    try {
        return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
    } catch {
        return {};
    }
}

function saveProgress() {
    try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch {
        // Progress will last for this visit only.
    }
}

function describeChar(char) {
    return char === " " ? "space" : `"${char}"`;
}

function fingersFor(char) {
    return (FINGERING_BY_CHAR[char] || "").split("").map(Number);
}

function percent(correct, attempts) {
    return attempts ? Math.round((correct / attempts) * 100) : 100;
}

function renderLessonList() {
    lessonList.replaceChildren(...LESSONS.map((lesson, index) => {
        const item = document.createElement("li");
        const button = document.createElement("button");
        const record = progress[lesson.id];

        button.type = "button";
        button.className = "lesson-button";
        button.setAttribute("aria-current", String(index === selectedIndex));
        button.innerHTML = '<span class="lesson-name"></span><span class="lesson-badge"></span><span class="lesson-meta"></span>';
        button.querySelector(".lesson-name").textContent = `${index + 1}. ${lesson.name}`;
        button.querySelector(".lesson-badge").textContent = record ? `\u2713 ${record.best}%` : "";
        button.querySelector(".lesson-meta").textContent = record
            ? `Completed \u00b7 best accuracy ${record.best}%`
            : "Not started";
        button.addEventListener("click", () => selectLesson(index));
        item.append(button);
        return item;
    }));
}

function selectLesson(index) {
    selectedIndex = index;
    run = null;
    clearChord();
    const lesson = LESSONS[index];
    lessonTitle.textContent = `${index + 1}. ${lesson.name}`;
    lessonDesc.textContent = lesson.desc;
    session.hidden = true;
    summary.hidden = true;
    startRow.hidden = false;
    startButton.disabled = false;
    startButton.textContent = progress[lesson.id] ? "Practice again" : "Start lesson";
    renderLessonList();
}

function startLesson() {
    const lesson = LESSONS[selectedIndex];
    run = { items: [...lesson.items], item: 0, char: 0, correct: 0, attempts: 0, misses: 0, done: false };
    session.hidden = false;
    summary.hidden = true;
    startRow.hidden = true;
    feedback.textContent = "";
    feedback.className = "feedback";
    renderStep();
    capture.focus();
}

function renderStep() {
    const word = run.items[run.item];
    const char = word[run.char];
    const total = run.items.reduce((sum, item) => sum + item.length, 0);
    const doneCount = run.items.slice(0, run.item).reduce((sum, item) => sum + item.length, 0) + run.char;

    target.replaceChildren(...[...word].map((c, index) => {
        const span = document.createElement("span");
        span.className = "ch" + (index < run.char ? " is-done" : index === run.char ? " is-current" : "");
        span.textContent = c === " " ? "\u2423" : c;
        return span;
    }));
    target.setAttribute("aria-label", `Target: ${word}. Current character: ${describeChar(char)}.`);

    const needed = fingersFor(char);
    const reveal = showHints.checked || run.misses >= 2;
    fingerRow.replaceChildren(...FINGER_NAMES.map((name, index) => {
        const box = document.createElement("div");
        box.className = "finger" + (reveal && needed.includes(index + 1) ? " is-needed" : "");
        box.dataset.finger = String(index + 1);
        box.innerHTML = "<strong></strong><span></span>";
        box.querySelector("strong").textContent = bindingKeys[index];
        box.querySelector("span").textContent = `${index + 1} ${name}`;
        return box;
    }));
    hintLine.textContent = reveal
        ? `${describeChar(char)} = ${needed.map((n) => `${n} ${FINGER_NAMES[n - 1]} (${bindingKeys[n - 1]})`).join(" + ")}`
        : "Hints hidden. Two wrong tries will reveal them.";

    progressText.textContent = `Letter ${doneCount + 1} of ${total}`;
    accuracyText.textContent = `Accuracy ${percent(run.correct, run.attempts)}%`;
    progressFill.style.width = `${(doneCount / total) * 100}%`;
    updatePressed();
}

function updatePressed() {
    fingerRow.querySelectorAll(".finger").forEach((box) => {
        const key = bindingKeys[Number(box.dataset.finger) - 1].toLowerCase();
        box.classList.toggle("is-pressed", activeKeys.has(key));
    });
}

function setCapture(message, active) {
    captureText.textContent = message;
    capture.classList.toggle("is-active", active);
}

function clearChord(message) {
    activeKeys.clear();
    chordKeys.clear();
    if (run && !run.done) {
        updatePressed();
    }
    if (message) {
        setCapture(message, false);
    }
}

function giveFeedback(message, good) {
    feedback.textContent = message;
    feedback.className = "feedback " + (good ? "is-good" : "is-bad");
}

function evaluateChord() {
    const pressed = [...chordKeys].map((key) => keyToFinger.get(key)).sort((a, b) => a - b).join("");
    const word = run.items[run.item];
    const expected = word[run.char];
    const letter = CHORDS[pressed];

    run.attempts += 1;
    if (letter === expected) {
        run.correct += 1;
        run.misses = 0;
        giveFeedback(`Correct! ${describeChar(expected)}`, true);
        run.char += 1;
        if (run.char >= word.length) {
            run.char = 0;
            run.item += 1;
        }
        if (run.item >= run.items.length) {
            finishLesson();
            return;
        }
    } else {
        run.misses += 1;
        giveFeedback(
            letter
                ? `That was ${describeChar(letter)}. Look for ${describeChar(expected)} and try again.`
                : `Those fingers don't make a letter. Look for ${describeChar(expected)} and try again.`,
            false
        );
    }
    renderStep();
}

function finishLesson() {
    run.done = true;
    const lesson = LESSONS[selectedIndex];
    const accuracy = percent(run.correct, run.attempts);
    const previous = progress[lesson.id];
    progress[lesson.id] = { best: Math.max(accuracy, previous ? previous.best : 0), completed: true };
    saveProgress();
    renderLessonList();

    session.hidden = true;
    startRow.hidden = true;
    summary.hidden = false;
    el("summary-title").textContent = accuracy >= 90 ? "Excellent work!" : "Lesson complete";
    el("summary-text").textContent = `${run.correct} correct out of ${run.attempts} chords \u2014 ${accuracy}% accuracy.`;
    el("next-lesson").hidden = selectedIndex >= LESSONS.length - 1;
    summary.querySelector("button").focus();
}

function keyFrom(event) {
    return event.key.toLowerCase();
}

capture.addEventListener("keydown", (event) => {
    if (!run || run.done) {
        return;
    }
    const key = keyFrom(event);
    if (key === "escape") {
        event.preventDefault();
        clearChord("Chord cancelled. Ready when you are.");
        return;
    }
    if (!keyToFinger.has(key)) {
        return;
    }
    event.preventDefault();
    if (event.repeat || activeKeys.has(key)) {
        return;
    }
    activeKeys.add(key);
    chordKeys.add(key);
    updatePressed();
    setCapture(`Holding ${[...chordKeys].sort().join(" + ")}. Release all keys to check.`, true);
});

capture.addEventListener("keyup", (event) => {
    if (!run || run.done) {
        return;
    }
    const key = keyFrom(event);
    if (!keyToFinger.has(key)) {
        return;
    }
    event.preventDefault();
    activeKeys.delete(key);
    updatePressed();
    if (activeKeys.size === 0 && chordKeys.size > 0) {
        evaluateChord();
        chordKeys.clear();
        if (run && !run.done) {
            setCapture("Ready for the next chord.", false);
        }
    }
});

capture.addEventListener("focus", () => setCapture("Listening. Hold your chord, then release.", false));
capture.addEventListener("blur", () => clearChord("Paused. Click here to continue."));
window.addEventListener("blur", () => clearChord("Paused. Click here to continue."));
showHints.addEventListener("change", () => {
    if (run && !run.done) {
        renderStep();
    }
});
startButton.addEventListener("click", startLesson);
el("retry-lesson").addEventListener("click", startLesson);
el("next-lesson").addEventListener("click", () => {
    selectLesson(selectedIndex + 1);
    startLesson();
});
el("reset-progress").addEventListener("click", () => {
    progress = {};
    saveProgress();
    selectLesson(0);
});

const firstIncomplete = LESSONS.findIndex((lesson) => !progress[lesson.id]);
selectLesson(firstIncomplete === -1 ? 0 : firstIncomplete);

