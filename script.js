// === NUSA ANTERA MAIN SCRIPT - GLOBAL ===

function isChapterPage() {
    return window.location.pathname.toLowerCase().includes('chapter');
}

document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();

    // Tombol lanjut cuma muncul di index/menu-chapter
    if (!isChapterPage()) {
        initResumeButton();
    }
});

function initDarkMode() {
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

function initResumeButton() {
    const lastChapter = localStorage.getItem('lastChapter');
    const lastUrl = localStorage.getItem('lastChapterUrl');
    const menuBox = document.querySelector('.chapter-box'); // ← UDAH GUE GANTI

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
