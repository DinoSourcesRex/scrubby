// One seek bar, re-attached every frame to whichever <video> is closest to screen centre.
// Instagram puts an overlay over its videos, so the bar lives outside the page (fixed, top z-index).
// ponytail: rAF poll instead of MutationObserver + scroll listeners; covers scroll, SPA nav and new videos in one loop.

const bar = document.createElement('div');
bar.innerHTML = '<input type="range" min="0" max="1000" value="0"><span>0:00 / 0:00</span>';
Object.assign(bar.style, {
  position: 'fixed', zIndex: '2147483647', display: 'none', alignItems: 'center', gap: '8px',
  height: '28px', padding: '0 10px', boxSizing: 'border-box', background: 'rgba(0,0,0,.55)',
  color: '#fff', font: '12px system-ui, sans-serif', fontVariantNumeric: 'tabular-nums',
});
const range = bar.querySelector('input');
const label = bar.querySelector('span');
Object.assign(range.style, { flex: '1', accentColor: '#fff', cursor: 'pointer', margin: '0' });
range.setAttribute('aria-label', 'Seek');
document.documentElement.append(bar);

let video = null;
let dragging = false;

const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

function activeVideo() {
  let best = null, bestDist = Infinity;
  for (const v of document.querySelectorAll('video')) {
    const r = v.getBoundingClientRect();
    if (!r.width || r.bottom <= 0 || r.top >= innerHeight) continue;
    const dist = Math.abs(r.top + r.height / 2 - innerHeight / 2);
    if (dist < bestDist) { best = v; bestDist = dist; }
  }
  return best;
}

function tick() {
  video = activeVideo();
  if (!video || !isFinite(video.duration) || !video.duration) {
    bar.style.display = 'none';
  } else {
    const r = video.getBoundingClientRect();
    bar.style.display = 'flex';
    bar.style.left = `${r.left}px`;
    bar.style.width = `${r.width}px`;
    bar.style.top = `${Math.min(r.bottom, innerHeight) - 28}px`;
    if (!dragging) range.value = (video.currentTime / video.duration) * 1000;
    label.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
  }
  requestAnimationFrame(tick);
}

range.addEventListener('pointerdown', () => { dragging = true; });
addEventListener('pointerup', () => { dragging = false; });
range.addEventListener('input', () => {
  if (video) video.currentTime = (range.value / 1000) * video.duration;
});

requestAnimationFrame(tick);
