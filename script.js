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

function initNotifChapter() {
    const btn = document.getElementById('subscribeBtn');
    const status = document.getElementById('subscribeStatus');
    if (!btn) return;

    // GANTI ANGKA INI TIAP RILIS CHAPTER BARU
    const LATEST_CHAPTER = 9; // Sekarang chapter 9. Nanti ganti jadi 10

    // Cek status langganan
    if (localStorage.getItem('notifSubscribed') === 'true') {
        btn.textContent = '✅ Udah Langganan';
        btn.disabled = true;
        status.textContent = `Kamu bakal dapet notif Chapter ${LATEST_CHAPTER + 1}`;
    }

    btn.addEventListener('click', async () => {
        // Minta izin notifikasi ke browser
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            localStorage.setItem('notifSubscribed', 'true');
            btn.textContent = '✅ Udah Langganan';
            btn.disabled = true;
            status.textContent = `Sip! Nanti dikasih tau kalo Chapter ${LATEST_CHAPTER + 1} rilis`;

            // Kasih notif tes langsung
            new Notification('Nusa Antera', {
                body: `Makasih udah langganan! Chapter ${LATEST_CHAPTER} udah bisa dibaca sekarang`,
                icon: 'Sampul_Novel_7_Kesatria_Pelangi.png' // ganti pake sampul lo
            });
        } else {
            status.textContent = 'Izin notifikasi ditolak. Nyalain manual di setting browser ya';
        }
    });

    // Kalo ada chapter baru, langsung spam notif
    const lastNotified = localStorage.getItem('lastNotifiedChapter');
    if (localStorage.getItem('notifSubscribed') === 'true' && lastNotified != LATEST_CHAPTER) {
        new Notification('Chapter Baru Nusa Antera!', {
            body: `Chapter ${LATEST_CHAPTER}: Teman Sekamar & Mimpi Buruk udah rilis. Baca sekarang!`,
            icon: 'Sampul_Novel_7_Kesatria_Pelangi.png'
        });
        localStorage.setItem('lastNotifiedChapter', LATEST_CHAPTER);
    }
}

// Jangan lupa panggil di DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
    if (!isChapterPage()) {
        initResumeButton();
        initNotifChapter(); // ← TAMBAH INI
    }
});
