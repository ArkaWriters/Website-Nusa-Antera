const synth = window.speechSynthesis;

const voiceSelect = document.getElementById("voiceSelect");
const speedInput = document.getElementById("speed");

let voices = [];
let currentUtterance;

// =========================
// LOAD VOICES (CHROME FIX)
// =========================
function loadVoices() {
    voices = synth.getVoices();

    voiceSelect.innerHTML = "";

    voices.forEach((voice, index) => {
        const option = document.createElement("option");

        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;

        // auto pilih indo kalau ada
        if (voice.lang.includes("id")) {
            option.selected = true;
        }

        voiceSelect.appendChild(option);
    });

    console.log("VOICE LOADED:", voices);
}

// Chrome kadang butuh delay
setTimeout(loadVoices, 500);

speechSynthesis.onvoiceschanged = () => {
    loadVoices();
};

// =========================
// AMBIL TEXT
// =========================
function getChapterText() {
    return document.getElementById("chapterText").innerText;
}

// =========================
// POTONG TEXT PANJANG
// =========================
function splitText(text, maxLength = 180) {
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];

    let chunks = [];
    let currentChunk = "";

    sentences.forEach(sentence => {

        if ((currentChunk + sentence).length > maxLength) {
            chunks.push(currentChunk);
            currentChunk = sentence;
        } else {
            currentChunk += sentence;
        }

    });

    if (currentChunk) chunks.push(currentChunk);

    return chunks;
}

// =========================
// PLAY TEXT
// =========================
async function playText() {

    stopText();

    const text = getChapterText();

    if (!text.trim()) {
        alert("Text kosong");
        return;
    }

    const chunks = splitText(text);

    for (let chunk of chunks) {

        await speakChunk(chunk);

    }
}

// =========================
// SPEAK PER CHUNK
// =========================
function speakChunk(text) {

    return new Promise((resolve) => {

        currentUtterance = new SpeechSynthesisUtterance(text);

        currentUtterance.rate = parseFloat(speedInput.value) || 1;
        currentUtterance.pitch = 1;
        currentUtterance.volume = 1;

        const selectedVoice = voices[voiceSelect.value];

        if (selectedVoice) {
            currentUtterance.voice = selectedVoice;
            currentUtterance.lang = selectedVoice.lang;
        }

        currentUtterance.onend = () => {
            resolve();
        };

        currentUtterance.onerror = (e) => {
            console.error("ERROR:", e);
            resolve();
        };

        // Chrome fix delay
        setTimeout(() => {
            synth.speak(currentUtterance);
        }, 100);

    });
}

// =========================
// CONTROL
// =========================
function pauseText() {
    synth.pause();
}

function resumeText() {
    synth.resume();
}

function stopText() {
    synth.cancel();
}
