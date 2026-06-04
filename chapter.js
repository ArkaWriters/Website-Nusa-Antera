// === NUSA ANTERA CHAPTER SCRIPT - KHUS BAB ===

document.addEventListener('DOMContentLoaded', function() {
    initProgressBar();
    initSaveProgress();
    initRestoreProgress();
    initTTS();
});

function initProgressBar() {
    if (document.querySelector('.progress-bar')) return;

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0? (winScroll / height) * 100 : 0;
        progressBar.style.width = scrolled + '%';
    });
}

function initSaveProgress() {
    const chapterTitle = document.querySelector('h2[id^="Chapter"], h2[id^="chapter"]');
    if (!chapterTitle) return;

    const chapterId = chapterTitle.id;
    const chapterUrl = window.location.pathname;
    let saveTimer;

    function saveProgress() {
        localStorage.setItem('lastChapter', chapterId);
        localStorage.setItem('lastChapterUrl', chapterUrl);
        localStorage.setItem('scrollPos', window.scrollY);
        console.log("Progress saved:", chapterId);
    }

    window.addEventListener('scroll', () => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(saveProgress, 3000);
    });

    window.addEventListener('beforeunload', saveProgress);
}

function initRestoreProgress() {
    const savedPos = localStorage.getItem('scrollPos');
    const lastUrl = localStorage.getItem('lastChapterUrl');

    if (savedPos && window.location.pathname === lastUrl) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                window.scrollTo({ top: parseInt(savedPos), behavior: "auto" });
            }, 100);
        });
    }
}

function initTTS() {
    const synth = window.speechSynthesis;
    const voiceSelect = document.getElementById("voiceSelect");
    const speedInput = document.getElementById("speed");
    let voices = [];
    let currentUtterance;

    if (!voiceSelect ||!speedInput) return;

    function loadVoices() {
        voices = synth.getVoices();
        voiceSelect.innerHTML = "";
        voices.forEach((voice, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            if (voice.lang.includes("id")) option.selected = true;
            voiceSelect.appendChild(option);
        });
    }

    setTimeout(loadVoices, 500);
    speechSynthesis.onvoiceschanged = loadVoices;

    function getChapterText() {
        const chapterText = document.getElementById("chapterText");
        return chapterText? chapterText.innerText : "";
    }

    function splitText(text, maxLength = 180) {
        const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
        let chunks = []; let currentChunk = "";
        sentences.forEach(sentence => {
            if ((currentChunk + sentence).length > maxLength) {
                chunks.push(currentChunk);
                currentChunk = sentence;
            } else { currentChunk += sentence; }
        });
        if (currentChunk) chunks.push(currentChunk);
        return chunks;
    }

    window.playText = async function() {
        stopText();
        const text = getChapterText();
        if (!text.trim()) { alert("Text kosong"); return; }
        const chunks = splitText(text);
        for (let chunk of chunks) { await speakChunk(chunk); }
    }

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
            currentUtterance.onend = () => resolve();
            currentUtterance.onerror = () => resolve();
            setTimeout(() => synth.speak(currentUtterance), 100);
        });
    }

    window.pauseText = () => synth.pause();
    window.resumeText = () => synth.resume();
    window.stopText = () => synth.cancel();
}