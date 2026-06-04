// === NUSA ANTERA MAIN SCRIPT ===
// Last Update: 2026-10-05

function isChapterPage() {
    const result = window.location.pathname.toLowerCase().includes('chapter');
    console.log('PATH:', window.location.pathname);
    console.log('IS CHAPTER:', result);
    return result;
}

document.addEventListener('DOMContentLoaded', function() {

    // =================================
    // 1. MODE SATRIA / DARK MODE - AKTIF DI SEMUA HALAMAN
    // =================================
    initDarkMode();

    // =================================
    // 2. FITUR KHUS CHAPTER DOANG
    // =================================
    if (isChapterPage()) {
        initProgressBar();
        initSaveProgress();
        initRestoreProgress();
        initTTS(); // TTS cuma di chapter
    }

    // =================================
    // 3. TOMBOL LANJUTKAN BACA - AKTIF DI INDEX/MENU DOANG
    // =================================
    if (!isChapterPage()) {
        initResumeButton();
    }

    // =================================
    // 4. TTS BEDA SUARA PER KARAKTER [NEXT]
    // =================================
    // initCharacterVoice();
});

// === SEMUA FUNGSI TARO DI BAWAH ===

function initDarkMode() {
    // Cek dulu biar tombolnya nggak dobel
    if (document.querySelector('.light-toggle')) return;

    const lightToggle = document.createElement('button');
    lightToggle.className = 'light-toggle';
    lightToggle.innerHTML = '☀️ Mode Cahaya';
    document.body.appendChild(lightToggle);

    if(localStorage.getItem('lightMode') === 'true') {
        document.body.classList.add('light-mode');
        lightToggle.innerHTML = '🌙 Mode Satria';
    }

    lightToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('lightMode', isLight);
        lightToggle.innerHTML = isLight? '🌙 Mode Satria' : '☀️ Mode Cahaya';
    });
}

function initProgressBar() {
    // Cek biar progress bar nggak dobel
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

    if (chapterTitle) {
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
}

function initResumeButton() {
    const lastChapter = localStorage.getItem('lastChapter');
    const lastUrl = localStorage.getItem('lastChapterUrl');
    const menuBox = document.querySelector('.menu-chapter');

    if (lastChapter && lastUrl && menuBox &&!isChapterPage()) {
        if (!document.querySelector('.resume-btn')) {
            const resumeBtn = document.createElement('a');
            resumeBtn.href = lastUrl;
            resumeBtn.className = 'resume-btn show';
            resumeBtn.innerHTML = `📖 Lanjutkan Baca ${lastChapter}`;
            menuBox.prepend(resumeBtn);
        }
    }
}

function initRestoreProgress() {
    const savedPos = localStorage.getItem('scrollPos');
    const lastUrl = localStorage.getItem('lastChapterUrl');

    if (savedPos && window.location.pathname === lastUrl) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                window.scrollTo({
                    top: parseInt(savedPos),
                    behavior: "auto"
                });
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

    if (!voiceSelect ||!speedInput) {
        console.log("TTS: voiceSelect/speedInput nggak ketemu. Skip initTTS");
        return;
    }

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

    window.playText = async function() {
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
            currentUtterance.onerror = (e) => {
                console.error("ERROR:", e);
                resolve();
            };

            setTimeout(() => synth.speak(currentUtterance), 100);
        });
    }

    window.pauseText = () => synth.pause();
    window.resumeText = () => synth.resume();
    window.stopText = () => synth.cancel();
}
