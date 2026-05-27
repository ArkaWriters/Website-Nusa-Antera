const synth = window.speechSynthesis;

const speedInput = document.getElementById("speed");
const voiceSelect = document.getElementById("voiceSelect");

let voices = [];
let utterance = null;

// Ambil text chapter
function getChapterText() {
    const content = document.getElementById("chapterText");
    return content ? content.innerText : "";
}

// Load semua voice
function loadVoices() {
    voices = synth.getVoices();

    // Kosongkan dropdown
    voiceSelect.innerHTML = "";

    // Cari suara Indonesia
    const indoVoices = voices.filter(v => 
        v.lang.toLowerCase().includes("id")
    );

    // Kalau tidak ada suara Indo pakai semua voice
    const voiceList = indoVoices.length > 0 ? indoVoices : voices;

    voiceList.forEach((voice) => {
        const option = document.createElement("option");

        option.value = voices.indexOf(voice);
        option.textContent = `${voice.name} (${voice.lang})`;

        // Auto pilih voice Indo
        if (voice.lang === "id-ID") {
            option.selected = true;
        }

        voiceSelect.appendChild(option);
    });

    console.log("Voices Loaded:", voices);
}

// Chrome fix
loadVoices();

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
}

// Play
function playText() {

    // Stop dulu kalau masih jalan
    synth.cancel();

    const text = getChapterText();

    if (!text.trim()) {
        alert("Teks kosong!");
        return;
    }

    utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = parseFloat(speedInput.value) || 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Ambil voice terpilih
    const selectedVoice = voices[voiceSelect.value];

    if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
    } else {
        utterance.lang = "id-ID";
    }

    utterance.onstart = () => {
        console.log("Mulai membaca...");
    };

    utterance.onend = () => {
        console.log("Selesai membaca");
    };

    utterance.onerror = (e) => {
        console.error("Speech Error:", e);
    };

    synth.speak(utterance);
}

// Pause
function pauseText() {
    if (synth.speaking) {
        synth.pause();
    }
}

// Resume
function resumeText() {
    if (synth.paused) {
        synth.resume();
    }
}

// Stop
function stopText() {
    synth.cancel();
}
