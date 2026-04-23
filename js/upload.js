// upload.js — качване на видеа

import State from './state.js';
import { getPresignedUrl } from './api.js';
import { showToast, fmtBytes, el } from './ui.js';
import { requireLogin } from './auth.js';
import { renderFeed } from './pages/feed.js';

// ═══════════════════════════════
// ИНИЦИАЛИЗАЦИЯ
// ═══════════════════════════════

export function initUpload() {
  bindDropzone();
  bindMonetizationOptions();
  bindUploadButtons();
}

// ═══════════════════════════════
// DROPZONE
// ═══════════════════════════════

function bindDropzone() {
  const dz = el('upl-dz');
  const inp = el('upl-inp');
  if (!dz || !inp) return;

  dz.onclick = () => inp.click();

  inp.onchange = function() {
    if (this.files && this.files[0]) {
      setUploadFile(this.files[0]);
    }
  };

  dz.ondragover = function(e) {
    e.preventDefault();
    this.classList.add('over');
  };

  dz.ondragleave = function() {
    this.classList.remove('over');
  };

  dz.ondrop = function(e) {
    e.preventDefault();
    this.classList.remove('over');
    if (e.dataTransfer && e.dataTransfer.files[0]) {
      setUploadFile(e.dataTransfer.files[0]);
    }
  };
}

// ═══════════════════════════════
// МОНЕТИЗАЦИЯ ОПЦИИ
// ═══════════════════════════════

function bindMonetizationOptions() {
  document.querySelectorAll('.mono-opt').forEach(opt => {
    opt.onclick = function() {
      document.querySelectorAll('.mono-opt').forEach(o => {
        o.classList.remove('selected');
      });
      opt.classList.add('selected');
      State.uploadAccess = opt.dataset.val;
    };
  });
}

// ═══════════════════════════════
// БУТОНИ
// ═══════════════════════════════

function bindUploadButtons() {
  const goBtn = el('upl-go-btn');
  const cancelBtn = el('upl-cancel-btn');
  const removeBtn = el('upl-fi-rm');

  if (goBtn) goBtn.onclick = startUpload;

  if (cancelBtn) {
    cancelBtn.onclick = function() {
      if (State.uploadXhr) {
        State.uploadXhr.abort();
        State.uploadXhr = null;
      }
      closeUploadModal();
      resetUpload();
    };
  }

  if (removeBtn) removeBtn.onclick = resetUpload;
}

// ═══════════════════════════════
// ОТВАРЯНЕ / ЗАТВАРЯНЕ
// ═══════════════════════════════

export function openUpload() {
  if (!requireLogin('Влез за да качиш видео!')) return;
  resetUpload();
  const m = el('m-upload');
  if (m) {
    m.classList.add('open');
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeUploadModal() {
  const m = el('m-upload');
  if (m) m.classList.remove('open');
}

// ═══════════════════════════════
// УПРАВЛЕНИЕ НА ФАЙЛ
// ═══════════════════════════════

function setUploadFile(file) {
  State.uploadFile = file;

  el('upl-dz').style.display = 'none';
  el('upl-fi').style.display = 'flex';
  el('upl-fi-name').textContent = file.name;
  el('upl-fi-size').textContent = fmtBytes(file.size);
}

export function resetUpload() {
  State.uploadFile = null;
  State.uploadAccess = 'free';

  const inp = el('upl-inp');
  if (inp) inp.value = '';

  const dz = el('upl-dz');
  if (dz) dz.style.display = 'block';

  const fi = el('upl-fi');
  if (fi) fi.style.display = 'none';

  const prog = el('upl-prog');
  if (prog) prog.style.display = 'none';

  const suc = el('upl-suc');
  if (suc) suc.style.display = 'none';

  const act = el('upl-act');
  if (act) act.style.display = 'block';

  const bar = el('upl-bar');
  if (bar) bar.style.width = '0';

  const title = el('upl-title');
  if (title) title.value = '';

  const desc = el('upl-desc');
  if (desc) desc.value = '';

  const value = el('upl-value');
  if (value) value.value = '';

  // Нулираме монетизацията
  document.querySelectorAll('.mono-opt').forEach((o, i) => {
    o.classList.toggle('selected', i === 0);
  });
}

// ═══════════════════════════════
// КАЧВАНЕ
// ═══════════════════════════════

async function startUpload() {
  if (!State.uploadFile) {
    showToast('Избери видео!');
    return;
  }

  const titleEl = el('upl-title');
  if (!titleEl || !titleEl.value.trim()) {
    showToast('Въведи заглавие!');
    return;
  }

  // Вземаме токена
  let token = '';
  try {
    const { data } = await State.sb.auth.getSession();
    if (data && data.session) token = data.session.access_token;
  } catch (e) {}

  if (!token) {
    showToast('Влез в акаунта!');
    return;
  }

  // Показваме прогрес
  el('upl-act').style.display = 'none';
  el('upl-prog').style.display = 'block';

  // Мапинг на достъпа
  const accessMap = {
    free: 'free',
    paid: 'fan',
    subscribers: 'studio'
  };

  // Вземаме presigned URL
  const presignData = await getPresignedUrl(token, {
    fileName: State.uploadFile.name,
    mimeType: State.uploadFile.type,
    title: titleEl.value.trim(),
    description: el('upl-desc') ? el('upl-desc').value : '',
    access: accessMap[State.uploadAccess] || 'free'
  });

  if (!presignData) {
    el('upl-act').style.display = 'block';
    el('upl-prog').style.display = 'none';
    showToast('❌ Грешка при получаване на URL');
    return;
  }

  // Качваме файла директно към R2
  const startTime = Date.now();
  const xhr = new XMLHttpRequest();
  State.uploadXhr = xhr;

  xhr.open('PUT', presignData.uploadUrl, true);
  xhr.setRequestHeader('Content-Type', State.uploadFile.type);

  xhr.upload.onprogress = function(e) {
    if (!e.lengthComputable) return;

    const percent = Math.round(e.loaded / e.total * 100);
    const seconds = Math.max(0.1, (Date.now() - startTime) / 1000);
    const speed = ((e.loaded / 1048576) / seconds).toFixed(1);

    const bar = el('upl-bar');
    const pct = el('upl-pct');
    const spd = el('upl-spd');

    if (bar) bar.style.width = percent + '%';
    if (pct) pct.textContent = percent + '%';
    if (spd) spd.textContent = fmtBytes(e.loaded) + ' / ' + fmtBytes(e.total) + ' — ' + speed + ' MB/s';
  };

  xhr.onload = function() {
    State.uploadXhr = null;

    if (this.status === 200) {
      el('upl-prog').style.display = 'none';
      el('upl-suc').style.display = 'block';
      showToast('✅ Качено успешно!');

      setTimeout(() => {
        closeUploadModal();
        resetUpload();
        renderFeed();
      }, 2000);
    } else {
      el('upl-act').style.display = 'block';
      el('upl-prog').style.display = 'none';
      showToast('❌ Грешка: ' + this.status);
    }
  };

  xhr.onerror = function() {
    State.uploadXhr = null;
    el('upl-act').style.display = 'block';
    el('upl-prog').style.display = 'none';
    showToast('❌ Мрежова грешка.');
  };

  xhr.send(State.uploadFile);
}
