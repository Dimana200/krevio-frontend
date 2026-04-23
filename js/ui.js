// ui.js — помощни функции за интерфейса

import State from './state.js';

// ═══════════════════════════════
// ФОРМАТИРАНЕ
// ═══════════════════════════════

export function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n || 0;
}

export function fmtBytes(b) {
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  if (b < 1073741824) return (b / 1048576).toFixed(1) + ' MB';
  return (b / 1073741824).toFixed(2) + ' GB';
}

export function fmtTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return diff + 'с';
  if (diff < 3600) return Math.floor(diff / 60) + 'мин';
  if (diff < 86400) return Math.floor(diff / 3600) + 'ч';
  return Math.floor(diff / 86400) + 'д';
}

// ═══════════════════════════════
// DOM ПОМОЩНИЦИ
// ═══════════════════════════════

export function el(id) {
  return document.getElementById(id);
}

export function mk(tag, cls) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}

export function icon(name, size = 24) {
  const i = document.createElement('i');
  i.setAttribute('data-lucide', name);
  i.style.cssText = `width:${size}px;height:${size}px`;
  return i;
}

// ═══════════════════════════════
// TOAST СЪОБЩЕНИЯ
// ═══════════════════════════════

export function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ═══════════════════════════════
// НАВИГАЦИЯ
// ═══════════════════════════════

export function showPage(page) {
  // Скриваме всички страници
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Деактивираме всички бутони в навигацията
  document.querySelectorAll('.bn').forEach(b => b.classList.remove('active'));

  // Показваме избраната страница
  const pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('active');

  // Активираме бутона в навигацията
  const bn = document.getElementById('bn-' + page);
  if (bn) bn.classList.add('active');
}

// ═══════════════════════════════
// МОДАЛИ
// ═══════════════════════════════

export function openModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.classList.add('open');
    if (window.lucide) window.lucide.createIcons();
  }
}

export function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

export function bindModalClose(modalId) {
  const m = document.getElementById(modalId);
  if (!m) return;
  m.addEventListener('click', function(e) {
    if (e.target === m) m.classList.remove('open');
  });
}

// ═══════════════════════════════
// SWIPE TO DISMISS
// ═══════════════════════════════

export function bindSwipeDismiss(handleId, modalId) {
  const handle = document.getElementById(handleId);
  const modal = document.getElementById(modalId);
  if (!handle || !modal) return;

  let startY = 0;
  let startTime = 0;

  handle.addEventListener('touchstart', function(e) {
    startY = e.touches[0].clientY;
    startTime = Date.now();
  }, { passive: true });

  handle.addEventListener('touchend', function(e) {
    const dy = e.changedTouches[0].clientY - startY;
    const dt = Date.now() - startTime;
    if (dy > 60 && dt < 400) {
      modal.classList.remove('open');
    }
  }, { passive: true });
}

// ═══════════════════════════════
// FULLSCREEN РЕЖИМ
// ═══════════════════════════════

export function toggleFullscreen() {
  State.isFullscreen = !State.isFullscreen;
  document.body.classList.toggle('fullscreen-mode', State.isFullscreen);

  // Обновяваме иконките на всички fullscreen бутони
  document.querySelectorAll('.fullscreen-btn i').forEach(ico => {
    ico.setAttribute(
      'data-lucide',
      State.isFullscreen ? 'minimize-2' : 'maximize-2'
    );
  });

  if (window.lucide) window.lucide.createIcons();
}

// ═══════════════════════════════
// ТЕМА
// ═══════════════════════════════

export function toggleTheme() {
  State.isDark = !State.isDark;
  document.body.classList.toggle('light', !State.isDark);
  localStorage.setItem('krevio-theme', State.isDark ? 'dark' : 'light');

  const label = document.getElementById('m-theme-label');
  if (label) label.textContent = State.isDark ? 'Светла тема' : 'Тъмна тема';

  if (window.lucide) window.lucide.createIcons();
}

export function initTheme() {
  const saved = localStorage.getItem('krevio-theme');
  if (saved === 'light') {
    State.isDark = false;
    document.body.classList.add('light');
  }
}

// ═══════════════════════════════
// ВИДЕО GRID BUILDER
// ═══════════════════════════════

export function buildVideoGrid(videos, emptyMsg) {
  const grid = mk('div', 'vgrid');

  if (videos && videos.length > 0) {
    videos.forEach(v => {
      const cell = mk('div', 'vg-cell');

      const vidEl = document.createElement('video');
      vidEl.src = v.file_url;
      vidEl.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover';
      cell.appendChild(vidEl);

      const ov = mk('div', 'vg-overlay');
      cell.appendChild(ov);

      const info = mk('div', 'vg-info');
      const views = mk('div', 'vg-views');
      views.textContent = '👁 ' + fmt(v.views || 0);
      info.appendChild(views);

      if (v.access_level && v.access_level !== 'free') {
        const badge = mk('div', 'vg-badge');
        badge.textContent = '🔒';
        info.appendChild(badge);
      }

      cell.appendChild(info);
      cell.onclick = () => showToast('▶ ' + v.title);
      grid.appendChild(cell);
    });
  } else {
    grid.innerHTML = `
      <div style="grid-column:1/-1;padding:30px;text-align:center;color:var(--text2)">
        ${emptyMsg}
      </div>
    `;
  }

  return grid;
}

// ═══════════════════════════════
// ИНИЦИАЛИЗАЦИЯ НА ВСИЧКИ МОДАЛИ
// ═══════════════════════════════

export function initModals() {
  const modals = [
    'm-comments',
    'm-upload',
    'm-auth',
    'm-menu',
    'm-edit-profile',
    'm-msg'
  ];

  modals.forEach(id => bindModalClose(id));

  // Swipe to dismiss за всеки modal
  bindSwipeDismiss('handle-comments', 'm-comments');
  bindSwipeDismiss('handle-upload', 'm-upload');
  bindSwipeDismiss('handle-auth', 'm-auth');
  bindSwipeDismiss('handle-edit', 'm-edit-profile');
  bindSwipeDismiss('handle-menu', 'm-menu');
  bindSwipeDismiss('handle-msg', 'm-msg');
}
