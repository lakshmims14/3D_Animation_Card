/* Adds parallax tilt that follows the mouse or finger.
   Works on any element with class="card".  */

const MAX_TILT = 12;            // degrees

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('pointermove', e => {
    // normalize pointer position from -0.5 … 0.5
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;

    card.style.transform = `
      rotateX(${ y * -MAX_TILT }deg)
      rotateY(${ x *  MAX_TILT }deg)
      scale(1.04)
    `;
  });

  card.addEventListener('pointerleave', () =>
    card.style.transform = ''
  );
});
// Reveal cards on scroll
const revealCards = () => {
  document.querySelectorAll('.card').forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      card.classList.add('show');
    }
  });
};
window.addEventListener('scroll', revealCards);
window.addEventListener('load', revealCards);
// Play sound on flip
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    document.getElementById('flip-sound').play();
  });
});
// Theme toggle
document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light');
});
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    card.style.transition = 'transform 0.2s ease';
    card.style.transform += ' scale(1.08)';
    setTimeout(() => card.style.transform = '', 200);
  });
});
document.querySelectorAll('.expand-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    e.currentTarget.closest('.back').classList.toggle('expanded');
  });
});
// ─── Rotate descriptions on each flip ─────────────────────
// ─── Random heading & description on each flip ─────────────
document.querySelectorAll('.card').forEach(card => {
  const heads = (card.dataset.headings || '').split('|').map(s => s.trim()).filter(Boolean);
  const descs = (card.dataset.descriptions || '').split('|').map(s => s.trim()).filter(Boolean);

  if (!heads.length || heads.length !== descs.length) return;

  const h2   = card.querySelector('.front h2');
  const pTxt = card.querySelector('.back  .extra-text');

  // Set a random pair initially
  let lastIndex = -1;
  const showRandom = () => {
    let i;
    do {
      i = Math.floor(Math.random() * heads.length);
    } while (i === lastIndex && heads.length > 1); // avoid repeat if more than 1
    lastIndex = i;
    h2.textContent = heads[i];
    pTxt.textContent = descs[i];
  };

  showRandom(); // initial load

  card.addEventListener('pointerenter', () => {
    showRandom();
  });
});
