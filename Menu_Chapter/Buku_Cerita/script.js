let audioPlayer = new Audio();
let isPlaying = false;
let isPaused = false;

// Suara Edge Indonesia
const EDGE_VOICES = {
    "id-ID-ArdiNeural": "Ardi - Pria",
    "id-ID-GadisNeural": "Gadis - Wanita"
};

function populateVoices() {
    const voiceSelect = document.getElementById('voiceSelect');
    voiceSelect.innerHTML = '';
    
    Object.entries(EDGE_VOICES).forEach(([value, name]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = name;
        voiceSelect.appendChild(option);
    });
}

async function playText() {
    if (isPaused) {
        audioPlayer.play();
        isPaused = false;
        return;
    }
    
    stopText();
    
    const text = document.getElementById('chapterText').innerText;
    const voice = document.getElementById('voiceSelect').value;
    const speed = document.getElementById('speed').value;
    
    // Loading indicator
    document.querySelector('.tts-btn').textContent = '⏳ Loading...';
    
    try {
        // Pake proxy biar lolos CORS di Github Pages
        const response = await fetch('https://corsproxy.io/?' + encodeURIComponent('https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ssml+xml',
                'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3'
            },
            body: `<speak version='1.0' xml:lang='id-ID'>
                    <voice name='${voice}'>
                        <prosody rate='${speed}'>${text}</prosody>
                    </voice>
                   </speak>`
        });
        
        if (!response.ok) throw new Error('TTS gagal');
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        audioPlayer.src = audioUrl;
        audioPlayer.play();
        isPlaying = true;
        
        document.querySelector('.tts-btn').textContent = '▶ Play';
        
        audioPlayer.onended = () => {
            isPlaying = false;
            isPaused = false;
        };
        
    } catch (err) {
        alert('Gagal load suara Ardi. Coba refresh atau cek koneksi.');
        document.querySelector('.tts-btn').textContent = '▶ Play';
        console.error(err);
    }
}

function pauseText() {
    if (isPlaying && !isPaused) {
        audioPlayer.pause();
        isPaused = true;
    }
}

function stopText() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    isPlaying = false;
    isPaused = false;
}

// Load voices pas halaman dibuka
document.addEventListener('DOMContentLoaded', populateVoices);
