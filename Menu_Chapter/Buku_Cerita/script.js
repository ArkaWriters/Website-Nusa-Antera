const synth = window.speechSynthesis;
const voiceSelect = document.getElementById("voiceSelect");
const speedInput = document.getElementById("speed");

let voices = [];
let currentUtterance;

// =========================
// LOAD VOICES + DETECT INDO
// =========================
function loadVoices() {
    voices = synth.getVoices();
    voiceSelect.innerHTML = "";

    let hasIndoVoice = false;

    voices.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;

        if (voice.lang.includes("id")) {
            option.selected = true;
            hasIndoVoice = true;
        }

        voiceSelect.appendChild(option);
    });

    // Kalo nggak ada suara Indo, munculin banner panduan
    showIndoVoiceGuide(!hasIndoVoice);

    console.log("VOICE LOADED:", voices);
}

// =========================
// BANNER PANDUAN DOWNLOAD
// =========================
function showIndoVoiceGuide(show) {
    let guide = document.getElementById("indoVoiceGuide");

    if (show) {
        if (!guide) {
            guide = document.createElement("div");
            guide.id = "indoVoiceGuide";
            guide.style.cssText = `
                background:#2a1a1a; border:1px solid #ff4d4d; color:#fff;
                padding:12px; border-radius:8px; margin:10px 0; font-size:14px;
            `;
            guide.innerHTML = `
                <b>⚠️ Suara Bahasa Indonesia belum ada di HP kamu</b><br>
                Suara bakal kedengeran bule. Biar natural, install dulu:<br>
                <button id="btnGuideAndroid" style="margin:5px; padding:6px 10px;">Android</button>
                <button id="btnGuideiPhone" style="margin:5px; padding:6px 10px;">iPhone</button>
                <button id="btnTutupGuide" style="margin:5px; padding:6px 10px;">Tutup</button>
            `;
            voiceSelect.parentNode.insertBefore(guide, voiceSelect);

            document.getElementById("btnGuideAndroid").onclick = () => {
                alert("Android:\n1. Buka Settings\n2. Cari 'Text-to-speech'\n3. Google TTS > Install voice data\n4. Pilih Bahasa Indonesia > Download");
            };
            document.getElementById("btnGuideiPhone").onclick = () => {
                alert("iPhone:\n1. Settings > Accessibility\n2. Spoken Content > Voices\n3. Indonesian > Download Damayanti");
            };
            document.getElementById("btnTutupGuide").onclick = () => {
                guide.remove();
            };
        }
    } else {
        if (guide) guide.remove();
    }
}

// Chrome kadang butuh delay
setTimeout(loadVoices, 500);
speechSynthesis.onvoiceschanged = () => {
    loadVoices();
};

// =========================
// SPEAK PER CHUNK - FORCE LANG ID
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
        }

        // KUNCI: Paksa bahasanya Indonesia meski voicenya English
        currentUtterance.lang = 'id-ID';

        currentUtterance.onend = () => resolve();
        currentUtterance.onerror = (e) => {
            console.error("ERROR:", e);
            resolve();
        };

        setTimeout(() => {
            synth.speak(currentUtterance);
        }, 100);
    });
}

// =========================
// SISANYA SAMA KAYAK PUNYA LO
// =========================
function getChapterText() {
    return document.getElementById("chapterText").innerText;
}

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

function pauseText() { synth.pause(); }
function resumeText() { synth.resume(); }
function stopText() { synth.cancel(); }
