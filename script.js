(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const intro = $('intro'), ask = $('ask'), win = $('win');
  const yes = $('yes'), no = $('no'), slot = $('slot'), sub = $('sub');
  const heartsBox = $('hearts');

  const emojis = ['💖', '💕', '💗', '💘', '❤️', '💞', '🌸'];
  const taunts = [
    'Are you sure? 🥺', 'Think again…', 'Wrong button 😏', 'Nice try!', 'Missed me!',
    'Pleeease? 🥹', "You can't catch it!", 'Just say yes 💕', 'Really?? 😢', 'Too slow!'
  ];

  let dodges = 0;
  let scale = 1;
  let playing = false;

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
    playing = true;
    burst(14);
  });

  /* ---------- the runaway No button ---------- */
  function freeNo() {
    if (no.classList.contains('free')) return;
    const r = no.getBoundingClientRect();
    slot.style.width = r.width + 'px';   // keep the row from collapsing
    slot.style.height = r.height + 'px';
    no.style.left = r.left + 'px';
    no.style.top = r.top + 'px';
    no.classList.add('free');
    void no.offsetWidth;                 // so the first hop animates
  }

  const overlaps = (a, b, pad = 14) =>
    a.left < b.right + pad && a.right > b.left - pad &&
    a.top < b.bottom + pad && a.bottom > b.top - pad;

  function dodge() {
    if (!playing) return;
    freeNo();

    const w = no.offsetWidth, h = no.offsetHeight, m = 12;
    const maxX = window.innerWidth - w - m;
    const maxY = window.innerHeight - h - m;
    const cur = no.getBoundingClientRect();
    const avoid = [yes.getBoundingClientRect(), ask.querySelector('h1').getBoundingClientRect()];
    let best = null;

    for (let i = 0; i < 40; i++) {
      // mostly short hops sideways / up / down, with the odd long jump
      const far = i > 25 || Math.random() < 0.25;
      const span = far ? 600 : 220;
      const x = Math.max(m, Math.min(maxX, cur.left + (Math.random() * 2 - 1) * span));
      const y = Math.max(m, Math.min(maxY, cur.top + (Math.random() * 2 - 1) * span * 0.8));
      const box = { left: x, top: y, right: x + w, bottom: y + h };
      if (Math.hypot(x - cur.left, y - cur.top) < 90) continue;
      if (avoid.some(a => overlaps(box, a))) continue;
      best = { x, y };
      break;
    }
    if (!best) best = { x: Math.random() < 0.5 ? m : maxX, y: Math.random() < 0.5 ? m : maxY };

    no.style.left = best.x + 'px';
    no.style.top = best.y + 'px';

    dodges++;
    sub.textContent = taunts[(dodges - 1) % taunts.length];
    scale = Math.min(1.6, scale + 0.06);
    yes.style.setProperty('--s', scale);
  }

  // hover, touch and keyboard focus all make it run away
  no.addEventListener('pointerenter', dodge);
  no.addEventListener('pointerdown', e => { e.preventDefault(); dodge(); });
  no.addEventListener('focus', dodge);
  no.addEventListener('click', e => { e.preventDefault(); dodge(); });

  window.addEventListener('resize', () => {
    if (!no.classList.contains('free')) return;
    const r = no.getBoundingClientRect();
    no.style.left = Math.max(12, Math.min(r.left, window.innerWidth - r.width - 12)) + 'px';
    no.style.top = Math.max(12, Math.min(r.top, window.innerHeight - r.height - 12)) + 'px';
  });

  /* ---------- YES ---------- */
  yes.addEventListener('click', () => {
    playing = false;
    ask.hidden = true;
    win.hidden = false;
    burst(70);
    const again = setInterval(() => burst(14), 1800);
    setTimeout(() => clearInterval(again), 12000);
  });
})();