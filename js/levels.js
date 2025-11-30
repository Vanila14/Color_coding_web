
document.addEventListener('DOMContentLoaded', () => {
  // DEV: принудительно разблокировать 1..N (для разработки). Поставьте 0 чтобы отключить.
  const DEV_UNLOCK_UP_TO = 0;

  // звуки 
  const clickSound = window.Howl ? new Howl({ src: ['../music/sounds/click.mp3'], volume: 1.2 }) : null;
  const errorSound = window.Howl ? new Howl({ src: ['../music/sounds/error.mp3'], volume: 1 }) : null;

  const levelEls = Array.from(document.querySelectorAll('.level'));
  if (!levelEls.length) return;

  // вычислим максимальный индекс уровня на странице
  const maxLevel = levelEls.reduce((m, el) => Math.max(m, Number(el.dataset.level) || 0), 0);

  // прочитаем visited флаги
  const visited = {};
  for (let i = 1; i <= maxLevel; i++) {
    if (DEV_UNLOCK_UP_TO > 0 && i <= DEV_UNLOCK_UP_TO) {
      visited[i] = true;
      continue;
    }
    visited[i] = localStorage.getItem(`visited_level_${i}`) === "1";
  }

  // если ничего не посещено — обеспечим доступ к первому уровню
  const anyVisited = Object.values(visited).some(Boolean);
  const unlockedLevel = anyVisited ? Math.max(1, ...Object.keys(visited).filter(k => visited[k]).map(Number)) : 1;

  // применяем классы и обработчики
  levelEls.forEach(el => {
    const n = Number(el.dataset.level) || 0;
    el.classList.remove('active', 'locked');

    if (n <= unlockedLevel) {
      el.classList.add('active');
      // убираем предыдущие обработчики 
      el.replaceWith(el.cloneNode(true));
    }
  });

  
  const freshEls = Array.from(document.querySelectorAll('.level'));
  freshEls.forEach(el => {
    const n = Number(el.dataset.level) || 0;
    if (n <= unlockedLevel) {
      el.addEventListener('click', () => {
        try { if (clickSound) clickSound.play(); } catch (e) {}
        
        setTimeout(() => {
          window.location.href = './levels/level' + n + '.html';
        }, 120);
      });
    } else {
      el.classList.add('locked');
      el.addEventListener('click', () => {
        try { if (errorSound) errorSound.play(); } catch (e) {}
        el.classList.add('shake');
        setTimeout(() => el.classList.remove('shake'), 450);
      });
    }

    // маркер visited 
    if (localStorage.getItem(`visited_level_${n}`) === "1") {
      el.dataset.visited = "1";
    } else {
      delete el.dataset.visited;
    }
  });

});


/* ------------------ КНОПКА НАЗАД НА ГЛАВНУЮ ------------------ */
document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.querySelector('.back-btn');
    const transitionCircle = document.querySelector('.transition-circle');

    // звук клика
    const clickSound = new Howl({ src: ['music/sounds/click.mp3'], volume: 1.2 });

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            clickSound.play();

            // красивая анимация перехода
            if (transitionCircle) transitionCircle.classList.add("active");

            setTimeout(() => {
                window.location.href = "/Color_coding_web/index.html";

            }, 500);
        });
    }
});

