// levelEngine.js — универсальная логика уровней
document.addEventListener('DOMContentLoaded', () => {

  /* ------------------ ОПРЕДЕЛЕНИЕ УРОВНЯ ------------------ */
  const urlParts = window.location.pathname.split('/');
  const levelFile = urlParts[urlParts.length - 1];
  const levelId = parseInt(levelFile.match(/\d+/)[0], 10);

  if (!window.LEVELS_CONFIG || !window.LEVELS_CONFIG[levelId]) return;

  const config = window.LEVELS_CONFIG[levelId];
  const layersCount = config.layersCount;

  /* ------------------ DOM ------------------ */
  const userShape = document.getElementById('userShape');
  const targetShape = document.getElementById('targetShape');
  const figureInput = document.getElementById('figureInput');
  const rInput = document.getElementById('r');
  const gInput = document.getElementById('g');
  const bInput = document.getElementById('b');
  const opacityInput = document.getElementById('opacity');
  const opacityValue = document.getElementById('opacityValue');
  const layersBtns = Array.from(document.querySelectorAll('.layer-btn'));
  const nextBtn = document.querySelector('.next-btn');
  const backBtn = document.querySelector(".levels-link"); // правильный класс из HTML

  const progressFill = document.querySelector('.progress-fill');
  const progressPercent = document.querySelector('.progress-percent');

  /* ------------------ ЗВУКИ ------------------ */
  const clickSound = new Howl({ src: ['../../music/sounds/click.mp3'], volume: 1 });
  const errorSound = new Howl({ src: ['../../music/sounds/error.mp3'], volume: 1 });
  const victorySound = new Howl({ src: ['../../music/level_up.mp3'], volume: 1 });

  /* ------------------ ЗАГРУЗКА ПРОГРЕССА ------------------ */
  let saved = JSON.parse(localStorage.getItem(`level_${levelId}`)) || {};

  // ⛔ ВАЖНО — ЕСЛИ УРОВЕНЬ УЖЕ ПРОЙДЕН, заново не проверяется
  let permanentWin = saved.permanentWin === true;

  let userLayers = saved.userLayers || {};
  for (let i = 1; i <= layersCount; i++) {
    if (!userLayers[i]) userLayers[i] = { shape: "", r: 0, g: 0, b: 0, opacity: 1 };
  }

  let currentLayer = 1;
  let won = permanentWin;
// Инициализация цифр рядом с ползунками
function updateColorSpans() {
  rVal.textContent = userLayers[currentLayer].r;
  gVal.textContent = userLayers[currentLayer].g;
  bVal.textContent = userLayers[currentLayer].b;
}

// Обработчики для R/G/B ползунков
rInput.addEventListener("input", () => {
  userLayers[currentLayer].r = +rInput.value;
  rVal.textContent = rInput.value; // только визуально
  saveAndUpdate(); // сохраняем слой
});

gInput.addEventListener("input", () => {
  userLayers[currentLayer].g = +gInput.value;
  gVal.textContent = gInput.value;
  saveAndUpdate();
});

bInput.addEventListener("input", () => {
  userLayers[currentLayer].b = +bInput.value;
  bVal.textContent = bInput.value;
  saveAndUpdate();
});

// При переключении слоя обновляем ползунки и цифры
layersBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    clickSound.play();
    layersBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentLayer = parseInt(btn.dataset.layer);
    const d = userLayers[currentLayer];

    figureInput.value = d.shape;
    rInput.value = d.r;
    gInput.value = d.g;
    bInput.value = d.b;
    opacityInput.value = d.opacity;
    opacityValue.textContent = d.opacity;

    updateColorSpans(); // обновляем цифры для нового слоя
  });
});

// Вызовем один раз при загрузке, чтобы цифры соответствовали текущему слою
updateColorSpans();
  /* ------------------ ЦЕЛЬ ------------------ */
  function drawTarget() {
  targetShape.innerHTML = "";

  for (let i = 1; i <= layersCount; i++) {
    const goal = config.goalLayers[i];
    if (!goal || !goal.shape) continue;

    let r = goal.r;
    let g = goal.g;
    let b = goal.b;

    // Инверсия ТОЛЬКО для уровня 10
    if (config.invertDisplay === true) {
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
    }

    const el = window.createSVGShape(
      goal.shape,
      r,
      g,
      b,
      goal.opacity
    );

    el.style.zIndex = (200 + i).toString();
    targetShape.appendChild(el);
  }
}

// вызываем сразу после загрузки Level-Engine
drawTarget();


  /* ------------------ РИСОВАНИЕ ПОЛЬЗОВАТЕЛЯ ------------------ */
  function updateUserShapeArea() {
  userShape.innerHTML = "";
  for (let i = 1; i <= layersCount; i++) {
    const d = userLayers[i];
    if (!d.shape) continue;

    const el = window.createSVGShape(
      d.shape,
      d.r,
      d.g,
      d.b,
      d.opacity
    );

    el.style.zIndex = 100 + i;
    userShape.appendChild(el);
  }
}


  /* ------------------ ПЕРЕКЛЮЧЕНИЕ СЛОЁВ ------------------ */
  layersBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      clickSound.play();
      layersBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLayer = parseInt(btn.dataset.layer);
      const d = userLayers[currentLayer];
      figureInput.value = d.shape;
      rInput.value = d.r;
      gInput.value = d.g;
      bInput.value = d.b;
      opacityInput.value = d.opacity;
      opacityValue.textContent = d.opacity;
    });
  });

  /* ------------------ СОХРАНЕНИЕ ------------------ */
  function saveAndUpdate() {
    userLayers[currentLayer] = {
      shape: figureInput.value.trim(),
      r: +rInput.value,
      g: +gInput.value,
      b: +bInput.value,
      opacity: +opacityInput.value
    };

    updateUserShapeArea();
    recalcProgress();

    localStorage.setItem(`level_${levelId}`, JSON.stringify({
      userLayers,
      permanentWin    // ← сохраняем победу навсегда
    }));
  }

  figureInput.addEventListener('change', () => { clickSound.play(); saveAndUpdate(); });
  [rInput, gInput, bInput].forEach(i =>
    i.addEventListener('input', () => { clickSound.play(); saveAndUpdate(); })
  );
  opacityInput.addEventListener('input', () => {
    opacityValue.textContent = opacityInput.value;
    clickSound.play();
    saveAndUpdate();
  });

  /* ------------------ ПРОГРЕСС ------------------ */
  function colorCloseness(a, b) {
    const dr = a.r - b.r, dg = a.g - b.g, db = a.b - b.b;
    return Math.max(0, 1 - Math.sqrt(dr*dr + dg*dg + db*db) / Math.sqrt(3*255*255));
  }

  function recalcProgress() {
    if (permanentWin) {
      progressFill.style.width = "100%";
      progressPercent.textContent = "100%";
      activateWinUI();
      return;
    }

    let total = 0;
    const baseShape = 50 / layersCount;
    const baseColor = 40 / layersCount;
    const baseOpacity = 10 / layersCount;

    for (let i = 1; i <= layersCount; i++) {
      const goal = config.goalLayers[i];
      const user = userLayers[i];
      if (!goal) continue;

      if (user.shape.toLowerCase() === goal.shape.toLowerCase()) total += baseShape;
      total += colorCloseness(user, goal) * baseColor;
      total += (1 - Math.abs(user.opacity - goal.opacity)) * baseOpacity;
    }

    total = Math.min(100, total);

    progressFill.style.width = total + "%";
    progressPercent.textContent = Math.round(total) + "%";

    if (total >= 99.5 && !won) onWin();
    else if (!won) nextBtn.disabled = true;
  }

  /* ------------------ ПОБЕДА ------------------ */
  function onWin() {
    won = true;
    permanentWin = true;

    localStorage.setItem(`level_${levelId}`, JSON.stringify({
      userLayers,
      permanentWin: true
    }));

    victorySound.play();
    victorySound.once("end", activateWinUI);
  }

  function activateWinUI() {
    nextBtn.disabled = false;
    nextBtn.classList.add("win-active", "blink", "pulse");
    nextBtn.addEventListener("click", () => {
      clickSound.play();
      setTimeout(() => {
        window.location.href = `level${levelId + 1}.html`;
      }, 120);
    }, { once: true });
  }

  /* ------------------ ОШИБКА НА НАЖАТИЕ ДО ПОБЕДЫ ------------------ */
  nextBtn.addEventListener("click", () => {
    if (!won) {
      errorSound.play();
      nextBtn.classList.add("shake");
      setTimeout(() => nextBtn.classList.remove("shake"), 500);
    }
  });

  /* ------------------ КНОПКА "ВСЕ УРОВНИ" ------------------ */
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      clickSound.play();
      setTimeout(() => {
        window.location.href = "/pages/levels.html";
      }, 150);
    });
  }


  const d = userLayers[currentLayer];
  figureInput.value = d.shape;
  rInput.value = d.r;
  gInput.value = d.g;
  bInput.value = d.b;
  opacityInput.value = d.opacity;
  opacityValue.textContent = d.opacity;

  recalcProgress();
});



document.addEventListener("DOMContentLoaded", () => {
    const hintBtn = document.querySelector(".hint-btn");
    const hintReveal = document.querySelector(".hint-reveal");

    hintBtn.addEventListener("click", () => {
        if (hintReveal.style.display === "none") {
            hintReveal.style.display = "block";
            hintReveal.style.opacity = 0;
            requestAnimationFrame(() => {
                hintReveal.style.transition = "opacity 0.3s";
                hintReveal.style.opacity = 1;
            });
            hintBtn.textContent = "Скрыть подсказку";
        } else {
            hintReveal.style.opacity = 0;
            hintReveal.addEventListener("transitionend", () => {
                hintReveal.style.display = "none";
            }, { once: true });
            hintBtn.textContent = "Показать подсказку";
        }
    });
});


