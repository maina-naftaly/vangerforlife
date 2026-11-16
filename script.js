(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const intro = $('intro'), ask = $('ask'), win = $('win');
  const yes = $('yes'), no = $('no'), sub = $('sub');
  const heartsBox = $('hearts');

  const emojis = ['💖', '💕', '💗', '💘', '❤️', '💞', '🌸'];
  const taunts = [
    'Are you sure? 🥺', 'Think again…', 'Wrong button 😏', 'Nice try!', 'Missed me!',
    'Pleeease? 🥹', 'Just say yes 💕', 'Really?? 😢', 'Still no? 🥲', 'Pretty please? 🌸'
  ];

  /* ---------- hearts ---------- */
  function burst(n) {
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      s.style.left = Math.random() * 100 + 'vw';
      s.style.fontSize = 18 + Math.random() * 30 + 'px';
      s.style.animationDuration = 3 + Math.random() * 3.5 + 's';
      s.style.animationDelay = Math.random() * 1.2 + 's';
      s.style.setProperty('--r', (Math.random() * 80 - 40) + 'deg');
      heartsBox.appendChild(s);
      setTimeout(() => s.remove(), 8500);
    }
  }

  /* ---------- step 1 -> 2 ---------- */
  $('play').addEventListener('click', () => {
    intro.hidden = true;
    ask.hidden = false;
    burst(14);
  });

  /* ---------- the No button: it never disappears ----------
     Every click it moves 20px, following a loop:
       right → up → left → down → (back where it started) → repeat
     Change STEP to make it hop further, or edit PATH to change the route. */
  const STEP = 20;
  const PATH = [
    [ 1,  0],   // right
    [ 0, -1],   // up
    [-1,  0],   // left
    [ 0,  1]    // down (back to the start)
  ];
  let clicks = 0;
  let x = 0, y = 0;
  let scale = 1;

  no.addEventListener('click', e => {
    e.preventDefault();
    const [dx, dy] = PATH[clicks % PATH.length];
    x += dx * STEP;
    y += dy * STEP;
    no.style.transform = `translate(${x}px, ${y}px)`;

    sub.textContent = taunts[clicks % taunts.length];
    clicks++;

    // Yes slowly gets bigger (capped so it never covers No)
    scale = Math.min(1.25, scale + 0.03);
    yes.style.setProperty('--s', scale);
  });

  /* ---------- YES ---------- */
  yes.addEventListener('click', () => {
    ask.hidden = true;
    win.hidden = false;
    burst(70);
    const again = setInterval(() => burst(14), 1800);
    setTimeout(() => clearInterval(again), 12000);
  });
})();