

(function () {

    if (!window.Howl) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js";
        script.onload = initSoundWidget;
        document.head.appendChild(script);
    } else {
        initSoundWidget();
    }

    function initSoundWidget() {

        const tracks = [
            "../music/Lo-Fi-1.mp3",
            "../music/Lo-Fi-2.mp3",
            "../music/Lo-Fi-3.mp3",
            "../music/Lo-Fi-4.mp3",
            "../music/Lo-Fi-5.mp3",
            "../music/Lo-Fi-6.mp3",
            "../music/Lo-Fi-7.mp3",
            "../music/Lo-Fi-8.mp3"
        ];

        let currentTrack = 0;
        let musicVolume = 0.5;
        let clickVolume = 0.5;

        let music = null;
        let buttonSound = null;

        // ---------------- STATE ----------------
        function loadState() {
            try { return JSON.parse(localStorage.getItem("soundWidgetState")); }
            catch { return null; }
        }
        function saveState() {
            const state = {
                currentTrack,
                musicVolume,
                clickVolume,
                isPlaying: music ? music.playing() : false,
                seek: music ? music.seek() : 0
            };
            localStorage.setItem("soundWidgetState", JSON.stringify(state));
        }

        // ---------------- CREATE HOWL ----------------
        function createHowlFor(index, startAt = 0, autoplay = true) {
            if (music) {
                try { music.unload(); } catch {}
            }
            music = new Howl({
                src: [tracks[index]],
                volume: musicVolume,
                html5: true,
                onend() {
                    currentTrack = (index + 1) % tracks.length;
                    saveState();
                    createHowlFor(currentTrack, 0, true);
                }
            });
            music.once("load", () => {
                try { music.seek(startAt); } catch {}
                if (autoplay) music.play();
            });
            return music;
        }

        // ---------------- API ----------------
        function nextTrack() {
            currentTrack = (currentTrack + 1) % tracks.length;
            saveState();
            createHowlFor(currentTrack, 0, true);
        }
        function prevTrack() {
            currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
            saveState();
            createHowlFor(currentTrack, 0, true);
        }
        function togglePlay() {
            if (!music) { createHowlFor(currentTrack, 0, true); saveState(); return true; }
            if (music.playing()) { music.pause(); saveState(); return false; }
            else { music.play(); saveState(); return true; }
        }
        function setMusicVolume(v) {
            musicVolume = Number(v);
            if (music) music.volume(musicVolume);
            saveState();
        }
        function setClickVolume(v) {
            clickVolume = Number(v);
            if (buttonSound) buttonSound.volume(clickVolume);
            saveState();
        }
        function playButtonSound() { try { buttonSound.play(); } catch {} }

        // ---------------- LOAD STATE ----------------
        const saved = loadState();
        if (saved) {
            currentTrack = saved.currentTrack ?? 0;
            musicVolume = saved.musicVolume ?? 0.5;
            clickVolume = saved.clickVolume ?? 0.5;
        }

        buttonSound = new Howl({ src: ["../music/sounds/click.mp3"], volume: clickVolume });
        music = createHowlFor(currentTrack, saved?.seek ?? 0, saved?.isPlaying !== false);
        if (saved && saved.isPlaying === false) setTimeout(() => music.pause(), 50);

        // ---------------- AUTOSAVE ----------------
        setInterval(() => saveState(), 1200);

        // ---------------- VISIBILITY CHANGE ----------------
        document.addEventListener("visibilitychange", () => {
            // Только сохраняем позицию, не ставим на паузу
            if (!music) return;
            saveState();
        });
        window.addEventListener("pagehide", () => {
            // Просто сохраняем позицию
            saveState();
        });

        // ---------------- UI ----------------
        const uiContainer = document.createElement("div");
        document.body.appendChild(uiContainer);

        const settingsBtn = document.createElement("div");
        settingsBtn.id = "settingsBtn";
        settingsBtn.textContent = "⚙️";
        Object.assign(settingsBtn.style, {
            position: "fixed", top: "20px", right: "20px", width: "50px", height: "50px",
            borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "2px solid #fff",
            backdropFilter: "blur(6px)", cursor: "pointer", display: "flex", justifyContent: "center",
            alignItems: "center", fontSize: "24px", zIndex: "9999", transition: "0.3s", userSelect: "none"
        });
        settingsBtn.onmouseenter = () => settingsBtn.style.background = "rgba(255,255,255,0.35)";
        settingsBtn.onmouseleave = () => settingsBtn.style.background = "rgba(255,255,255,0.2)";
        uiContainer.appendChild(settingsBtn);

        // ---------------- MODAL ----------------
        const modalBg = document.createElement("div");
        Object.assign(modalBg.style, { position: "fixed", inset: 0, display: "none", justifyContent: "center", alignItems: "center", zIndex: 9998 });
        uiContainer.appendChild(modalBg);

        const modal = document.createElement("div");
        Object.assign(modal.style, {
            width: "450px", minHeight: "300px", background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)", borderRadius: "20px", padding: "30px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", position: "relative", transform: "scale(0)",
            transition: "0.4s", opacity: 0
        });
        modalBg.appendChild(modal);

        modal.innerHTML = `
            <div id="closeModal" style="position:absolute; top:15px; right:15px; cursor:pointer; font-size:22px;">✖</div>
            <h2 style="margin-bottom:20px;">Настройки музыки</h2>
            <div class="section" style="width:100%; text-align:center;">
                <b>Музыка</b>
                <div style="display:flex; gap:10px; justify-content:center; margin:15px 0;">
                    <button class="button" id="prevBtn">⏮</button>
                    <button class="button" id="playBtn">▷</button>
                    <button class="button" id="nextBtn">⏭</button>
                </div>
                <input id="musicVolume" type="range" min="0" max="1" step="0.01" value="${musicVolume}" style="width:80%; accent-color: #2c9caf;">
            </div>
            <div class="section" style="width:100%; text-align:center; margin-top:20px;">
                <b>Звук кнопок</b>
                <input id="clickVolume" type="range" min="0" max="1" step="0.01" value="${clickVolume}" style="width:80%; margin-top:10px; accent-color: #2c9caf;">
            </div>
        `;

        const closeModal = modal.querySelector("#closeModal");
        function openModal() { modalBg.style.display = "flex"; requestAnimationFrame(() => { modal.style.transform="scale(1)"; modal.style.opacity="1"; }); playButtonSound(); }
        function closeModalFunc() { modal.style.transform="scale(0)"; modal.style.opacity="0"; setTimeout(()=>modalBg.style.display="none",300); playButtonSound(); }
        settingsBtn.onclick = openModal;
        closeModal.onclick = closeModalFunc;
        modalBg.onclick = e => { if(e.target===modalBg) closeModalFunc(); };

        const musicVolSlider = modal.querySelector("#musicVolume");
        const clickVolSlider = modal.querySelector("#clickVolume");
        musicVolSlider.oninput = () => { setMusicVolume(musicVolSlider.value); playButtonSound(); };
        clickVolSlider.oninput = () => { setClickVolume(clickVolSlider.value); playButtonSound(); };

        modal.querySelector("#prevBtn").onclick = () => { prevTrack(); playButtonSound(); };
        modal.querySelector("#nextBtn").onclick = () => { nextTrack(); playButtonSound(); };
        const playBtn = modal.querySelector("#playBtn");
        playBtn.onclick = () => { const playing = togglePlay(); playBtn.textContent = playing ? "⏸" : "▷"; playButtonSound(); };
    }

})();
// ---------------- BUTTON STYLE ----------------
const style = document.createElement("style");
style.innerHTML = `
.button {
    padding: 1em 2em;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    color: #2c9caf;
    transition: 0.3s;
    background: transparent;
    outline: 2px solid #2c9caf;
    position: relative;
    overflow: hidden;
}
.button:hover {
    color: white;
    outline-color: #70bdca;
    transform: scale(1.1);
    box-shadow: 4px 5px 17px -4px #268391;
}
.button::before {
    content: "";
    position: absolute;
    top: 0;
    left: -50px;
    width: 0;
    height: 100%;
    background: #2c9caf;
    transform: skewX(45deg);
    z-index: -1;
    transition: 0.3s;
}
.button:hover::before {
    width: 250%;
}
`;
document.head.appendChild(style);
