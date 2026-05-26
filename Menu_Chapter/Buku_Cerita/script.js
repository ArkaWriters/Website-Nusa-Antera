const synth = window.speechSynthesis;
const speedInput = document.getElementById("speed");
const voiceSelect = document.getElementById("voiceSelect");
let voices = [];
let utterance;

// Ambil semua teks dari chapter-content otomatis
function getChapterText() {
    const content = document.getElementById("chapterText");
    return content.innerText; // Ambil semua teks <p> di dalamnya
}

function loadVoices() {
    voices = synth.getVoices();
    voiceSelect.innerHTML = "";
    
    const indoVoices = voices.filter(voice => voice.lang === 'id-ID');
    
    if(indoVoices.length === 0) {
        const option = document.createElement("option");
        option.textContent = "Suara Indo nggak ada 😢 Buka di HP aja";
        option.disabled = true;
        voiceSelect.appendChild(option);
        
        // Kasih pilihan English biar tetep bunyi
        voices.forEach((voice, index) => {
            const opt = document.createElement("option");
            opt.value = index;
            opt.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(opt);
        });
    } else {
        indoVoices.forEach((voice) => {
            const option = document.createElement("option");
            option.value = voices.indexOf(voice);
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
    }
}
    
    // Filter cuma suara Indonesia biar gampang
    const indoVoices = voices.filter(voice => voice.lang.includes('id'));
    const voiceList = indoVoices.length > 0 ? indoVoices : voices;
    
    voiceList.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = voices.indexOf(voice); // index asli
        option.textContent = `${voice.name} (${voice.lang})`;
        if(voice.lang.includes('id-ID')) option.selected = true; // Auto pilih Indo
        voiceSelect.appendChild(option);
    });

loadVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
}

function playText() {
    stopText(); // Stop dulu kalo lagi jalan
    utterance = new SpeechSynthesisUtterance(getChapterText());
    utterance.rate = parseFloat(speedInput.value);
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = "id-ID";
    
    const selectedVoice = voices[voiceSelect.value];
    if(selectedVoice) utterance.voice = selectedVoice;
    
    utterance.onend = () => { console.log("Selesai dibacakan Kang Arka"); };
    
    synth.speak(utterance);
}

function pauseText() { synth.pause(); }
function resumeText() { synth.resume(); }
function stopText() { synth.cancel(); }