@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');

:root {
    --bg-dark: #0f0f0f;
    --text-dark: #e8e8e8;
    --bg-light: #f8f5ed;
    --text-light: #1a1a1a;
    --accent: #c9a959;
}

body {
    font-family: Arial, sans-serif;
    background-color: #1a1a1a;
    color: #f0f0f0;
    margin: 0;
    padding: 20px;
    line-height: 1.6;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background-color: #2b2b2b;
    padding: 30px;
    border-radius: 10px;
}

h2 {
    color: #ff6b6b;
    text-shadow: 0 0 8px rgba(255, 107, 107, 0.4);
}

/* === NAVIGASI CHAPTER - 1 VERSI DOANG === */
.chapter-nav ul {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    list-style: none;
    padding: 0;
    margin: 30px 0;
}

.chapter-nav li { flex: 1; }

.chapter-nav a {
    display: block;
    text-align: center;
    background: #1f1f1f;
    color: #4ecdc4;
    text-decoration: none;
    font-size: 14px;
    padding: 12px 10px;
    border: 1px solid #444;
    border-radius: 6px;
    transition: 0.2s;
}

.chapter-nav a:hover {
    background: #262626;
    color: #ffd93d;
    border-color: #ffd93d;
    box-shadow: 0 0 10px rgba(255, 217, 61, 0.3);
    transform: translateY(-2px);
}

/* === ISI CHAPTER === */
.chapter-content {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    line-height: 1.8;
    color: #e0e0e0;
}

.chapter-content p {
    margin-bottom: 20px;
    text-align: justify;
}

/* === BOX === */
.chapter-box, .header-box {
    background-color: #1f1f1f;
    padding: 25px;
    margin: 30px 0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
.chapter-box { border-left: 4px solid #4ecdc4; }
.header-box { border-left: 4px solid #ffd93d; display: flex; gap: 25px; }

/* === TTS ULTRA MINI + RESPONSIVE HP === */
.tts-box {
    background: #1a1a1a;
    padding: 5px 8px;
    margin: 12px -20px;
    border-top: 1px solid #4ecdc4;
    width: calc(100% + 40px);
}

.tts-header {
    font-size: 11px;
    margin: 0 0 3px 0;
    opacity: 0.7;
    display: flex;
    cursor: pointer;
}
.tts-header::after {
    content: "▼";
    margin-left: auto;
    font-size: 9px;
    transition: 0.2s;
}
.tts-box.collapsed .tts-header::after { transform: rotate(-90deg); }
.tts-box.collapsed .tts-controls { display: none; }

.tts-controls {
    display: flex;
    gap: 3px;
    align-items: center;
}

/* TOMBOL KECIL BANGET DI HP */
.tts-btn {
    padding: 2px 5px;
    font-size: 12px;
    min-width: 28px;
    height: 24px;
    border-radius: 3px;
    background: #2b2b2b;
    color: #4ecdc4;
    border: 1px solid #444;
    cursor: pointer;
}

.tts-option {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 9px; /* LEBIH KECIL DARI CHAPTER 18PX */
    flex: 1;
}
.tts-option span { display: none; } /* sembunyiin "Speed:" "Suara:" */

.tts-option select {
    padding: 1px 3px;
    font-size: 9px;
    height: 20px;
    flex: 1;
    background: #2b2b2b;
    color: #f0f0f0;
    border: 1px solid #444;
    border-radius: 3px;
}
.tts-option input[type="range"] {
    width: 50px;
    height: 2px;
}

/* KHUS HP LEBAR <600PX */
@media (max-width: 600px) {
    body { padding: 10px; }
    .container { padding: 15px; width: 100%; }
    
    .chapter-content p { font-size: 16px; }
    
    /* TTS makin kecil lagi di HP */
    .tts-box {
        margin: 10px -15px;
        width: calc(100% + 30px);
        padding: 4px 6px;
    }
    .tts-btn {
        min-width: 24px;
        height: 22px;
        font-size: 11px;
        padding: 1px 3px;
    }
    .tts-option select {
        font-size: 8px;
        height: 18px;
    }
}

/* === MODE TERANG === */
body.light-mode {
    background: var(--bg-light);
    color: var(--text-light);
}
body.light-mode .container,
body.light-mode .chapter-box,
body.light-mode .header-box,
body.light-mode .tts-box {
    background: #ffffff;
    color: var(--text-light);
    border-color: #e0e0e0;
}
body.light-mode .tts-btn {
    background: #f5f5f5;
    color: #8b6914;
    border-color: #ddd;
}

/* === LAIN-LAIN === */
.light-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--accent);
    color: #1a1a1a;
    border: none;
    border-radius: 50px;
    padding: 12px 18px;
    font-weight: bold;
    cursor: pointer;
    z-index: 999;
}

.resume-btn {
    display: none;
    background: #c9a959;
    color: #1a1a1a;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: bold;
    text-decoration: none;
    margin: 20px 0;
    text-align: center;
}
.resume-btn.show { display: block; }
