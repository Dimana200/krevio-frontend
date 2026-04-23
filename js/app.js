// app.js — главен файл, стартира всичко

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import State from './state.js';
import { initAuth, doLogin, doRegister, doLogout, requireLogin } from './auth.js';
import { initTheme, toggleTheme, showPage, openModal, closeModal, initModals, showToast, toggleFullscreen, el } from './ui.js';
import { initUpload, openUpload, resetUpload } from './upload.js';
import {
  fetchVideos, fetchLikeCount, fetchMyLike, addLike, removeLike,
  fetchComments, fetchCommentCount, addComment,
  fetchSaveState, addSave, removeSave,
  searchProfiles, searchVideos,
  fetchMyVideos, deleteVideo, uploadAvatar, updateProfile, fetchProfile
} from './api.js';
import { fmt, fmtTime, buildVideoGrid } from './ui.js';

// ═══════════════════════════════
// СТАРТ
// ═══════════════════════════════

window.addEventListener('load', async function() {
  // Инициализираме Supabase
  State.sb = createClient(State.config.SB_URL, State.config.SB_ANON);

  // Инициализираме темата
  initTheme();

  // Инициализираме модалите
  initModals();

  // Инициализираме upload-а
  initUpload();

  // Инициализираме Lucide иконките
  if (window.lucide) window.lucide.createIcons();

  // Свързваме навигацията
  bindNav();

  // Свързваме бутоните
  bindTopButtons();
  bindAuthButtons();
  bindMenuButtons();
  bindEditProfileButtons();
  bindCommentButtons();
  bindMessageButtons();
  bindCreatorPanel();
  bindFeedTabs();

  // Инициализираме auth (проверява сесията)
  await initAuth();

  // Рендираме страниците
  await renderFeed();
  renderSearch();
  renderInbox();
});

// ═══════════════════════════════
// НАВИГАЦИЯ
// ═══════════════════════════════

function bindNav() {
  el('bn-feed').onclick = () => showPage('feed');
  el('bn-search').onclick = () => {
    showPage('search');
    renderSearch();
  };
  el('bn-upload').onclick = () => openUpload();
  el('bn-inbox').onclick = () => {
    showPage('inbox');
    renderInbox();
  };
  el('bn-profile').onclick = () => {
    showPage('profile');
    renderProfile();
  };
}

// ═══════════════════════════════
// ГОРНИ БУТОНИ
// ═══════════════════════════════

function bindTopButtons() {
  el('theme-btn').onclick = toggleTheme;
  el('auth-top-btn').onclick = () => openModal('m-auth');
  el('creator-close-btn').onclick = () => showPage('profile');
}

// ═══════════════════════════════
// FEED ТАБОВЕ
// ═══════════════════════════════

function bindFeedTabs() {
  ['trending', 'following', 'premium'].forEach(t => {
    const btn = el('tab-' + t);
    if (!btn) return;
    btn.onclick = function() {
      document.querySelectorAll('.feed-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderFeed();
    };
  });
}

// ═══════════════════════════════
// FEED
// ═══════════════════════════════

async function renderFeed() {
  const wrap = el('feed-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';

  const videos = await fetchVideos(20);

  if (videos.length === 0) {
    const empty = document.createElement('div');
    empty.style.cssText = 'height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;color:rgba(201,168,76,.4);text-align:center;padding:20px';
    empty.innerHTML = `
      <div style="font-size:3rem;margin-bottom:16px">🎬</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:8px;color:rgba(201,168,76,.6)">Все още няма видеа</div>
      <div style="font-size:.82rem">Бъди първият, който качи!</div>
    `;
    wrap.appendChild(empty);
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const ads = [
    { company: 'Техномаркет', text: 'Лаптопи от 599 лв!' },
    { company: 'Kaufland BG', text: 'Промоции тази седмица!' },
    { company: 'Виваком', text: 'Интернет 1Gbps — 25 лв/мес' },
    { company: 'Банка ДСК', text: 'Кредит до 50,000 лв онлайн' }
  ];

  let adIdx = 0;
  videos.forEach((v, i) => {
    wrap.appendChild(buildVideoCard(v, i));
    if ((i + 1) % 4 === 0 && adIdx < ads.length) {
      wrap.appendChild(buildAdCard(ads[adIdx++]));
    }
  });

  if (window.lucide) window.lucide.createIcons();
}

// ═══════════════════════════════
// VIDEO CARD
// ═══════════════════════════════

function buildVideoCard(v, i) {
  const item = document.createElement('div');
  item.className = 'video-item';

  // Video player
  const vid = document.createElement('video');
  vid.className = 'v-player';
  vid.src = v.file_url;
  vid.loop = true;
  vid.muted = true;
  vid.playsInline = true;
  vid.preload = 'metadata';
  item.appendChild(vid);

  // Loading spinner
  const loading = document.createElement('div');
  loading.className = 'v-loading';
  loading.id = 'loading-' + i;
  const spinner = document.createElement('div');
  spinner.className = 'v-spinner';
  loading.appendChild(spinner);
  item.appendChild(loading);

  // Play overlay
  const playOv = document.createElement('div');
  playOv.className = 'v-play-overlay';
  playOv.id = 'playov-' + i;
  const circle = document.createElement('div');
  circle.className = 'v-play-circle';
  circle.innerHTML = `<svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:#c9a84c;stroke-width:1.5;fill:none;margin-left:3px"><polygon points="6,3 20,12 6,21" fill="#c9a84c"/></svg>`;
  playOv.appendChild(circle);
  item.appendChild(playOv);

  // Progress bar
  const prog = document.createElement('div');
  prog.className = 'v-progress';
  const fill = document.createElement('div');
  fill.className = 'v-progress-fill';
  fill.id = 'prog-' + i;
  prog.appendChild(fill);
  item.appendChild(prog);

  // Fullscreen button
  const fsBtn = document.createElement('div');
  fsBtn.className = 'fullscreen-btn';
  fsBtn.innerHTML = '<i data-lucide="maximize-2"></i>';
  fsBtn.onclick = (e) => { e.stopPropagation(); toggleFullscreen(); };
  item.appendChild(fsBtn);

  // Video events
  vid.addEventListener('loadeddata', () => {
    const l = el('loading-' + i);
    if (l) l.style.display = 'none';
  });

  vid.addEventListener('timeupdate', () => {
    const f = el('prog-' + i);
    if (f && vid.duration) f.style.width = (vid.currentTime / vid.duration * 100) + '%';
  });

  vid.addEventListener('click', () => {
    if (!State.audioUnlocked) {
      State.audioUnlocked = true;
      vid.muted = false;
      document.querySelectorAll('.v-player').forEach(vv => vv.muted = false);
      return;
    }
    if (State.isFullscreen) { toggleFullscreen(); return; }
    if (vid.paused) {
      vid.play();
      const po = el('playov-' + i);
      if (po) { po.classList.add('show'); setTimeout(() => po.classList.remove('show'), 600); }
    } else {
      vid.pause();
      const po = el('playov-' + i);
      if (po) po.classList.add('show');
    }
  });

  prog.addEventListener('click', (e) => {
    const rect = prog.getBoundingClientRect();
    vid.currentTime = ((e.clientX - rect.left) / rect.width) * vid.duration;
  });

  // IntersectionObserver за autoplay
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        State.currentVideoId = v.id;
        vid.muted = !State.audioUnlocked;
        vid.play().catch(() => { vid.muted = true; vid.play().catch(() => {}); });
      } else {
        vid.pause();
        vid.currentTime = 0;
      }
    });
  }, { threshold: 0.8 });
  obs.observe(item);

  // Gradient
  const gradient = document.createElement('div');
  gradient.className = 'v-gradient';
  item.appendChild(gradient);

  // Premium overlay
  if (v.access_level && v.access_level !== 'free') {
    const lkOv = document.createElement('div');
    lkOv.className = 'locked-ov';
    lkOv.innerHTML = `
      <div class="locked-badge">💎 ПРЕМИУМ СЪДЪРЖАНИЕ</div>
      <div class="locked-title">${v.title || 'Ексклузивно видео'}</div>
      <div class="locked-price">${v.access_level === 'fan' ? '2.50€' : v.access_level === 'studio' ? '5€' : '12€'}</div>
      <div class="locked-sub">еднократно плащане</div>
      <div class="locked-btns">
        <button class="locked-preview" onclick="showToast('Скоро!')">▶ Преглед 5s</button>
        <button class="locked-unlock" onclick="openModal('m-auth')">💰 Отключи</button>
      </div>
    `;
    item.appendChild(lkOv);
  }

  // Info zone
  const infoZone = document.createElement('div');
  infoZone.className = 'v-info-zone';

  // Creator bar
  const creatorBar = document.createElement('div');
  creatorBar.className = 'v-creator-bar';

  const cAv = document.createElement('div');
  cAv.className = 'v-avatar';
  cAv.textContent = '🎬';
  cAv.onclick = () => openCreatorProfile(v.user_id);

  const cInfo = document.createElement('div');
  cInfo.className = 'v-creator-info';
  const cName = document.createElement('div');
  cName.className = 'v-creator-name';
  cName.textContent = v.title || 'Творец';
  const cHandle = document.createElement('div');
  cHandle.className = 'v-creator-handle';
  cHandle.textContent = '@creator';
  cInfo.appendChild(cName);
  cInfo.appendChild(cHandle);

  const cBtns = document.createElement('div');
  cBtns.className = 'v-creator-btns';

  // Follow button
  const followBtn = document.createElement('button');
  followBtn.className = 'v-follow-btn';
  let isFollowing = State.isFollowing(v.user_id);
  followBtn.textContent = isFollowing ? '✓ Следваш' : 'Следвай';
  if (isFollowing) followBtn.classList.add('following');
  followBtn.onclick = () => {
    if (!requireLogin('Влез за да следваш!')) return;
    isFollowing = !isFollowing;
    State.setFollowing(v.user_id, isFollowing);
    followBtn.textContent = isFollowing ? '✓ Следваш' : 'Следвай';
    followBtn.classList.toggle('following', isFollowing);
    showToast(isFollowing ? 'Следваш! Можеш да пратиш съобщение 💬' : 'Спря да следваш');
  };

  // Subscribe button
  const subBtn = document.createElement('button');
  subBtn.className = 'v-sub-btn';
  subBtn.textContent = 'Абонирай';
  subBtn.onclick = () => {
    if (!requireLogin('Влез за да се абонираш!')) return;
    showToast('Скоро!');
  };

  cBtns.appendChild(followBtn);
  cBtns.appendChild(subBtn);
  creatorBar.appendChild(cAv);
  creatorBar.appendChild(cInfo);
  creatorBar.appendChild(cBtns);
  infoZone.appendChild(creatorBar);

  // Description
  if (v.description) {
    const desc = document.createElement('div');
    desc.className = 'v-title-text';
    desc.textContent = v.description;
    infoZone.appendChild(desc);
  }

  // Tags
  const tags = document.createElement('div');
  tags.className = 'v-tags';
  const tag1 = document.createElement('span');
  tag1.className = 'v-tag';
  tag1.textContent = '#krevio';
  tags.appendChild(tag1);
  infoZone.appendChild(tags);

  // Action bar
  const actionBar = document.createElement('div');
  actionBar.className = 'v-action-bar';

  // Like
  const likeBtn = document.createElement('button');
  likeBtn.className = 'v-act';
  const likeIco = document.createElement('i');
  likeIco.setAttribute('data-lucide', 'heart');
  likeIco.style.cssText = 'width:20px;height:20px';
  const likeCnt = document.createElement('span');
  likeCnt.textContent = '0';
  likeBtn.appendChild(likeIco);
  likeBtn.appendChild(likeCnt);
  likeBtn.onclick = async () => {
    if (!requireLogin('Влез за да харесаш!')) return;
    const isLiked = likeBtn.classList.contains('liked');
    if (isLiked) {
      likeBtn.classList.remove('liked');
      await removeLike(v.id, State.user.id);
    } else {
      likeBtn.classList.add('liked');
      await addLike(v.id, State.user.id);
    }
    const count = await fetchLikeCount(v.id);
    likeCnt.textContent = fmt(count);
  };
  actionBar.appendChild(likeBtn);

  // Зареждаме likes
  fetchLikeCount(v.id).then(c => { likeCnt.textContent = fmt(c); });
  if (State.user) {
    fetchMyLike(v.id, State.user.id).then(liked => {
      if (liked) likeBtn.classList.add('liked');
    });
  }

  // Comment
  const cmtBtn = document.createElement('button');
  cmtBtn.className = 'v-act';
  const cmtIco = document.createElement('i');
  cmtIco.setAttribute('data-lucide', 'message-circle');
  cmtIco.style.cssText = 'width:20px;height:20px';
  const cmtCnt = document.createElement('span');
  cmtCnt.id = 'cmt-cnt-' + v.id;
  cmtCnt.textContent = '0';
  cmtBtn.appendChild(cmtIco);
  cmtBtn.appendChild(cmtCnt);
  cmtBtn.onclick = () => openComments(v.id);
  actionBar.appendChild(cmtBtn);
  fetchCommentCount(v.id).then(c => { cmtCnt.textContent = fmt(c); });

  // Save
  const saveBtn = document.createElement('button');
  saveBtn.className = 'v-act';
  const saveIco = document.createElement('i');
  saveIco.setAttribute('data-lucide', 'bookmark');
  saveIco.style.cssText = 'width:20px;height:20px';
  const saveTxt = document.createElement('span');
  saveTxt.textContent = 'Запази';
  saveBtn.appendChild(saveIco);
  saveBtn.appendChild(saveTxt);
  saveBtn.onclick = async () => {
    if (!requireLogin('Влез за да запазиш!')) return;
    const isSaved = saveBtn.classList.contains('saved');
    if (isSaved) {
      saveBtn.classList.remove('saved');
      saveTxt.textContent = 'Запази';
      showToast('Премахнато');
      await removeSave(v.id, State.user.id);
    } else {
      saveBtn.classList.add('saved');
      saveTxt.textContent = 'Запазено';
      showToast('Запазено!');
      await addSave(v.id, State.user.id);
    }
  };
  actionBar.appendChild(saveBtn);
  if (State.user) {
    fetchSaveState(v.id, State.user.id).then(saved => {
      if (saved) { saveBtn.classList.add('saved'); saveTxt.textContent = 'Запазено'; }
    });
  }

  // Message
  const msgBtn = document.createElement('button');
  msgBtn.className = 'v-act';
  const msgIco = document.createElement('i');
  msgIco.setAttribute('data-lucide', 'message-square');
  msgIco.style.cssText = 'width:20px;height:20px';
  const msgTxt = document.createElement('span');
  msgTxt.textContent = 'Съобщ.';
  msgBtn.appendChild(msgIco);
  msgBtn.appendChild(msgTxt);
  msgBtn.onclick = () => {
    if (!requireLogin('Влез за да пишеш!')) return;
    if (!State.isFollowing(v.user_id)) {
      showToast('Последвай за да пишеш съобщение!');
      return;
    }
    el('msg-title').textContent = 'Съобщение до @creator';
    openModal('m-msg');
  };
  actionBar.appendChild(msgBtn);

  // Share
  const shareBtn = document.createElement('button');
  shareBtn.className = 'v-act';
  const shareIco = document.createElement('i');
  shareIco.setAttribute('data-lucide', 'share-2');
  shareIco.style.cssText = 'width:20px;height:20px';
  const shareTxt = document.createElement('span');
  shareTxt.textContent = 'Сподели';
  shareBtn.appendChild(shareIco);
  shareBtn.appendChild(shareTxt);
  shareBtn.onclick = () => {
    if (navigator.share) navigator.share({ title: v.title, url: window.location.href });
    else showToast('Копирано!');
  };
  actionBar.appendChild(shareBtn);

  // Unlock (ако е premium)
  if (v.access_level && v.access_level !== 'free') {
    const unlockBtn = document.createElement('button');
    unlockBtn.className = 'v-act-unlock';
    unlockBtn.innerHTML = '<i data-lucide="lock" style="width:16px;height:16px"></i><span>Отключи</span>';
    unlockBtn.onclick = () => openModal('m-auth');
    actionBar.appendChild(unlockBtn);
  }

  infoZone.appendChild(actionBar);
  item.appendChild(infoZone);
  return item;
}

// ═══════════════════════════════
// AD CARD
// ═══════════════════════════════

function buildAdCard(ad) {
  const item = document.createElement('div');
  item.className = 'video-item';
  item.style.background = 'linear-gradient(160deg,#0a0800,#1a1400,#0a0800)';

  const gradient = document.createElement('div');
  gradient.className = 'v-gradient';
  item.appendChild(gradient);

  const center = document.createElement('div');
  center.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:5;text-align:center;padding:24px';
  center.innerHTML = `
    <div style="font-size:.62rem;color:rgba(201,168,76,.4);letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;border:1px solid rgba(201,168,76,.2);padding:3px 10px;border-radius:100px">Спонсорирано</div>
    <div style="font-size:1.8rem;font-weight:900;background:linear-gradient(135deg,#c9a84c,#e8c96d);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px">${ad.company}</div>
    <div style="font-size:.9rem;color:rgba(255,255,255,.65)">${ad.text}</div>
  `;
  item.appendChild(center);
  return item;
}

// ═══════════════════════════════
// CREATOR PROFILE
// ═══════════════════════════════

function openCreatorProfile(userId) {
  if (State.user && userId === State.user.id) {
    showPage('profile');
    renderProfile();
    return;
  }
  showToast('Профил скоро!');
}

// ═══════════════════════════════
// КОМЕНТАРИ
// ═══════════════════════════════

async function openComments(videoId) {
  State.currentVideoId = videoId;
  const list = el('cmt-list');
  if (!list) return;
  list.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Зарежда...</div>';
  openModal('m-comments');
  await loadComments(videoId);
}

async function loadComments(videoId) {
  const list = el('cmt-list');
  if (!list) return;

  const comments = await fetchComments(videoId);
  list.innerHTML = '';

  if (comments.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Няма коментари. Бъди първи!</div>';
    return;
  }

  comments.forEach(c => {
    const item = document.createElement('div');
    item.className = 'cmt-item';
    const av = document.createElement('div');
    av.className = 'cmt-av';
    av.textContent = '👤';
    const body = document.createElement('div');
    const nm = document.createElement('div');
    nm.className = 'cmt-name';
    nm.textContent = c.username || 'Потребител';
    const tx = document.createElement('div');
    tx.className = 'cmt-text';
    tx.textContent = c.text;
    const tm = document.createElement('div');
    tm.className = 'cmt-time';
    tm.textContent = fmtTime(c.created_at) + ' назад';
    body.appendChild(nm);
    body.appendChild(tx);
    body.appendChild(tm);
    item.appendChild(av);
    item.appendChild(body);
    list.appendChild(item);
  });

  const cnt = el('cmt-cnt-' + videoId);
  if (cnt) cnt.textContent = comments.length;
}

function bindCommentButtons() {
  const sendBtn = el('cmt-send-btn');
  if (!sendBtn) return;
  sendBtn.onclick = async () => {
    const inp = el('cmt-inp');
    if (!inp || !inp.value.trim()) return;
    if (!requireLogin('Влез за да коментираш!')) return;
    if (!State.currentVideoId) return;
    const text = inp.value.trim();
    inp.value = '';
    const ok = await addComment(
      State.currentVideoId,
      State.user.id,
      State.user.username || State.user.name,
      text
    );
    if (ok) await loadComments(State.currentVideoId);
    else showToast('Грешка!');
  };
}

// ═══════════════════════════════
// ТЪРСЕНЕ
// ═══════════════════════════════

async function renderSearch() {
  const wrap = el('search-list');
  if (!wrap) return;
  wrap.innerHTML = '';

  const profiles = await searchProfiles('');
  renderSearchResults(profiles, []);

  const inp = el('search-inp');
  if (inp) {
    inp.oninput = async function() {
      const q = this.value.trim();
      if (!q) {
        const profiles = await searchProfiles('');
        renderSearchResults(profiles, []);
        return;
      }
      const [profiles, videos] = await Promise.all([
        searchProfiles(q),
        searchVideos(q)
      ]);
      renderSearchResults(profiles, videos);
    };
  }
}

function renderSearchResults(profiles, videos) {
  const wrap = el('search-list');
  if (!wrap) return;
  wrap.innerHTML = '';
  let has = false;

  if (profiles && profiles.length > 0) {
    has = true;
    const lbl = document.createElement('div');
    lbl.className = 'sec-label';
    lbl.textContent = 'Творци';
    wrap.appendChild(lbl);

    profiles.forEach(c => {
      const row = document.createElement('div');
      row.className = 'creator-row';
      const av = document.createElement('div');
      av.className = 'cr-avatar';
      if (c.avatar_url) {
        const img = document.createElement('img');
        img.src = c.avatar_url;
        av.appendChild(img);
      } else {
        av.textContent = '👤';
      }
      const info = document.createElement('div');
      info.style.flex = '1';
      const nm = document.createElement('div');
      nm.className = 'cr-name';
      nm.textContent = c.full_name || c.username || 'Потребител';
      const hd = document.createElement('div');
      hd.className = 'cr-handle';
      hd.textContent = '@' + (c.username || 'user');
      info.appendChild(nm);
      info.appendChild(hd);
      const badge = document.createElement('div');
      badge.className = 'cr-badge';
      badge.textContent = (c.followers_count || 0) + ' фена';
      row.appendChild(av);
      row.appendChild(info);
      row.appendChild(badge);
      row.onclick = () => openCreatorProfile(c.id);
      wrap.appendChild(row);
    });
  }

  if (videos && videos.length > 0) {
    has = true;
    const lbl2 = document.createElement('div');
    lbl2.className = 'sec-label';
    lbl2.textContent = 'Видеа';
    wrap.appendChild(lbl2);

    videos.forEach(v => {
      const row = document.createElement('div');
      row.className = 'creator-row';
      const av = document.createElement('div');
      av.className = 'cr-avatar';
      av.textContent = '🎬';
      const info = document.createElement('div');
      info.style.flex = '1';
      const nm = document.createElement('div');
      nm.className = 'cr-name';
      nm.textContent = v.title;
      info.appendChild(nm);
      row.appendChild(av);
      row.appendChild(info);
      row.onclick = () => showToast('▶ ' + v.title);
      wrap.appendChild(row);
    });
  }

  if (!has) {
    wrap.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text2)">Няма намерени резултати</div>';
  }
}

// ═══════════════════════════════
// ИЗВЕСТИЯ
// ═══════════════════════════════

function renderInbox() {
  const wrap = el('inbox-list');
  if (!wrap) return;
  wrap.innerHTML = '';

  const notifs = [
    { ico: '❤️', text: 'Някой хареса твоето видео', time: '2 мин', unread: true },
    { ico: '💬', text: 'Нов коментар на твоето видео', time: '1 ч', unread: true },
    { ico: '💎', text: 'Някой купи твоето съдържание', time: '3 ч', unread: true },
    { ico: '👤', text: 'Нов последовател', time: 'вчера', unread: false },
    { ico: '⭐', text: 'Добре дошъл в Krevio!', time: '2 дни', unread: false }
  ];

  notifs.forEach(n => {
    const item = document.createElement('div');
    item.className = 'notif-item';
    const av = document.createElement('div');
    av.className = 'notif-av';
    av.textContent = n.ico;
    const txt = document.createElement('div');
    txt.className = 'notif-txt';
    txt.textContent = n.text;
    const time = document.createElement('div');
    time.className = 'notif-time';
    time.textContent = n.time;
    item.appendChild(av);
    item.appendChild(txt);
    item.appendChild(time);
    if (n.unread) {
      const dot = document.createElement('div');
      dot.className = 'notif-dot';
      item.appendChild(dot);
    }
    wrap.appendChild(item);
  });
}

// ═══════════════════════════════
// ПРОФИЛ
// ═══════════════════════════════

async function renderProfile() {
  const wrap = el('profile-body');
  if (!wrap) return;
  wrap.innerHTML = '';

  if (!State.user) {
    const loginMsg = document.createElement('div');
    loginMsg.style.cssText = 'padding:60px 20px;text-align:center';
    loginMsg.innerHTML = `
      <div style="font-size:3rem;margin-bottom:16px">👤</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:8px;color:var(--text)">Влез в акаунта си</div>
      <div style="font-size:.82rem;color:var(--text2);margin-bottom:20px">За да видиш профила си</div>
    `;
    const loginBtn = document.createElement('button');
    loginBtn.className = 'btn-gold';
    loginBtn.style.cssText = 'width:auto;padding:12px 32px;margin:0 auto;display:block';
    loginBtn.textContent = 'Вход / Регистрация';
    loginBtn.onclick = () => openModal('m-auth');
    loginMsg.appendChild(loginBtn);
    wrap.appendChild(loginMsg);
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Banner
  const banner = document.createElement('div');
  banner.className = 'p-banner';
  const bannerGrad = document.createElement('div');
  bannerGrad.className = 'p-banner-gradient';
  banner.appendChild(bannerGrad);
  wrap.appendChild(banner);

  // Hero
  const hero = document.createElement('div');
  hero.className = 'p-hero';

  // Avatar
  const avWrap = document.createElement('div');
  avWrap.className = 'p-avatar-wrap';
  if (State.user.avatar) {
    const avImg = document.createElement('img');
    avImg.src = State.user.avatar;
    avWrap.appendChild(avImg);
  } else {
    avWrap.textContent = '👤';
  }
  const avEdit = document.createElement('div');
  avEdit.className = 'p-avatar-edit';
  avEdit.textContent = '✏️ Смени';
  avWrap.appendChild(avEdit);
  avWrap.onclick = () => {
    let inp = document.getElementById('upl-avatar-inp');
    if (!inp) {
      inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = 'image/*';
      inp.id = 'upl-avatar-inp';
      inp.style.display = 'none';
      inp.onchange = async function() {
        if (!this.files || !this.files[0]) return;
        showToast('Качване...');
        const url = await uploadAvatar(State.user.id, this.files[0]);
        if (url) {
          State.user.avatar = url;
          showToast('✅ Снимката е сменена!');
          renderProfile();
        } else {
          showToast('Грешка при качване!');
        }
      };
      document.body.appendChild(inp);
    }
    inp.click();
  };

  const nm = document.createElement('div');
  nm.className = 'p-name';
  nm.textContent = State.user.username || State.user.name;

  const hd = document.createElement('div');
  hd.className = 'p-handle';
  hd.textContent = '@' + (State.user.username || State.user.name).toLowerCase().replace(/\s+/g, '_');

  const bio = document.createElement('p');
  bio.className = 'p-bio';
  bio.textContent = State.user.bio || 'Добави биография';

  // Stats
  const stats = document.createElement('div');
  stats.className = 'p-stats';
  let myVideosCount = 0;
  const myVids = await fetchMyVideos(State.user.id);
  myVideosCount = myVids.length;

  [{ n: myVideosCount, l: 'Видеа' }, { n: 0, l: 'Фена' }, { n: 0, l: 'Следва' }].forEach(s => {
    const st = document.createElement('div');
    const sn = document.createElement('div');
    sn.className = 'pst-n';
    sn.textContent = s.n;
    const sl = document.createElement('div');
    sl.className = 'pst-l';
    sl.textContent = s.l;
    st.appendChild(sn);
    st.appendChild(sl);
    stats.appendChild(st);
  });

  // Action buttons
  const actionBtns = document.createElement('div');
  actionBtns.className = 'p-action-btns';

  const editBtn = document.createElement('button');
  editBtn.className = 'p-follow-btn';
  editBtn.textContent = '✏️ Редактирай';
  editBtn.onclick = () => {
    el('edit-username').value = State.user.username || State.user.name;
    el('edit-bio').value = State.user.bio || '';
    openModal('m-edit-profile');
  };

  const creatorBtn = document.createElement('button');
  creatorBtn.className = 'p-sub-btn';
  creatorBtn.textContent = '🎬 Creator Панел';
  creatorBtn.onclick = () => {
    showPage('creator');
    loadCreatorPanel();
  };

  actionBtns.appendChild(editBtn);
  actionBtns.appendChild(creatorBtn);

  hero.appendChild(avWrap);
  hero.appendChild(nm);
  hero.appendChild(hd);
  hero.appendChild(stats);
  hero.appendChild(bio);
  hero.appendChild(actionBtns);
  wrap.appendChild(hero);

  // Tabs
  const tabs = document.createElement('div');
  tabs.className = 'p-tabs';
  const t1 = document.createElement('button');
  t1.className = 'p-tab active';
  t1.textContent = '📹 Видеа';
  const t2 = document.createElement('button');
  t2.className = 'p-tab';
  t2.textContent = '❤️ Харесани';
  const t3 = document.createElement('button');
  t3.className = 'p-tab';
  t3.textContent = '🔖 Запазени';
  const t4 = document.createElement('button');
  t4.className = 'p-tab';
  t4.textContent = '💎 Премиум';
  tabs.appendChild(t1);
  tabs.appendChild(t2);
  tabs.appendChild(t3);
  tabs.appendChild(t4);
  wrap.appendChild(tabs);

  // Video grids
  const grid1 = buildVideoGrid(myVids, 'Все още нямаш видеа');
  grid1.id = 'ptab-my';
  wrap.appendChild(grid1);

  const { fetchLikedVideos, fetchSavedVideos } = await import('./api.js');

  const likedVids = await fetchLikedVideos(State.user.id);
  const grid2 = buildVideoGrid(likedVids, 'Все още не си харесал видеа');
  grid2.id = 'ptab-liked';
  grid2.style.display = 'none';
  wrap.appendChild(grid2);

  const savedVids = await fetchSavedVideos(State.user.id);
  const grid3 = buildVideoGrid(savedVids, 'Все още нямаш запазени видеа');
  grid3.id = 'ptab-saved';
  grid3.style.display = 'none';
  wrap.appendChild(grid3);

  const premiumVids = myVids.filter(v => v.access_level && v.access_level !== 'free');
  const grid4 = buildVideoGrid(premiumVids, 'Нямаш премиум съдържание');
  grid4.id = 'ptab-premium';
  grid4.style.display = 'none';
  wrap.appendChild(grid4);

  const allTabs = [t1, t2, t3, t4];
  const allGrids = ['ptab-my', 'ptab-liked', 'ptab-saved', 'ptab-premium'];

  allTabs.forEach((tab, idx) => {
    tab.onclick = () => {
      allTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      allGrids.forEach((gid, gidx) => {
        const g = el(gid);
        if (g) g.style.display = gidx === idx ? 'grid' : 'none';
      });
    };
  });

  if (window.lucide) window.lucide.createIcons();
}

// ═══════════════════════════════
// CREATOR ПАНЕЛ
// ═══════════════════════════════

async function loadCreatorPanel() {
  if (!State.user) return;

  const videos = await fetchMyVideos(State.user.id);

  // Dashboard stats
  const totalViews = videos.reduce((a, v) => a + (v.views || 0), 0);
  const tvEl = el('cp-total-views');
  const tvid = el('cp-total-videos');
  if (tvEl) tvEl.textContent = fmt(totalViews);
  if (tvid) tvid.textContent = videos.length;

  // Best video
  if (videos.length > 0) {
    const best = videos.reduce((a, b) => (b.views || 0) > (a.views || 0) ? b : a);
    const bestEl = el('cp-best-video');
    if (bestEl) {
      bestEl.innerHTML = `
        <div style="font-weight:700;color:var(--text);margin-bottom:4px">${best.title}</div>
        <div style="font-size:.75rem;color:var(--text2)">👁 ${fmt(best.views || 0)} гледания</div>
      `;
    }
  }

  // Content list
  const list = el('cp-videos-list');
  if (list) {
    list.innerHTML = '';
    if (videos.length === 0) {
      list.innerHTML = '<div style="color:var(--text2);font-size:.83rem;text-align:center;padding:20px">Все още нямаш видеа</div>';
    } else {
      videos.forEach(v => {
        const row = document.createElement('div');
        row.className = 'cp-video-row';

        const thumb = document.createElement('div');
        thumb.className = 'cp-video-thumb';
        const vidEl = document.createElement('video');
        vidEl.src = v.file_url;
        vidEl.style.cssText = 'width:100%;height:100%;object-fit:cover';
        thumb.appendChild(vidEl);

        const info = document.createElement('div');
        info.className = 'cp-video-info';
        const title = document.createElement('div');
        title.className = 'cp-video-title';
        title.textContent = v.title || 'Без заглавие';
        const meta = document.createElement('div');
        meta.className = 'cp-video-meta';
        meta.textContent = '👁 ' + fmt(v.views || 0);

        const actions = document.createElement('div');
        actions.className = 'cp-video-actions';
        const delBtn = document.createElement('button');
        delBtn.className = 'cp-vid-btn';
        delBtn.textContent = '🗑 Изтрий';
        delBtn.onclick = async () => {
          if (confirm('Изтрий видеото?')) {
            const ok = await deleteVideo(v.id);
            if (ok) { showToast('Изтрито!'); loadCreatorPanel(); }
            else showToast('Грешка!');
          }
        };
        actions.appendChild(delBtn);
        info.appendChild(title);
        info.appendChild(meta);
        info.appendChild(actions);

        const badge = document.createElement('div');
        badge.className = 'cp-video-badge ' + (v.access_level === 'free' ? 'free' : 'paid');
        badge.textContent = v.access_level === 'free' ? 'Безплатно' : 'Премиум';

        row.appendChild(thumb);
        row.appendChild(info);
        row.appendChild(badge);
        list.appendChild(row);
      });
    }
  }

  // Creator notifications
  const notifsList = el('cp-notifs-list');
  if (notifsList) {
    notifsList.innerHTML = '';
    const notifs = [
      { ico: '👤', text: 'Нов последовател се присъедини', time: '2 мин', unread: true },
      { ico: '🎬', text: 'Твоето видео набира популярност', time: '1 ч', unread: true },
      { ico: '💎', text: 'Нов абонат', time: 'вчера', unread: false }
    ];
    notifs.forEach(n => {
      const row = document.createElement('div');
      row.className = 'cp-notif-row';
      const ico = document.createElement('div');
      ico.className = 'cp-notif-ico';
      ico.textContent = n.ico;
      const txt = document.createElement('div');
      txt.className = 'cp-notif-txt';
      txt.textContent = n.text;
      const time = document.createElement('div');
      time.className = 'cp-notif-time';
      time.textContent = n.time;
      row.appendChild(ico);
      row.appendChild(txt);
      row.appendChild(time);
      if (n.unread) {
        const dot = document.createElement('div');
        dot.className = 'cp-notif-dot';
        row.appendChild(dot);
      }
      notifsList.appendChild(row);
    });
  }
}

function bindCreatorPanel() {
  document.querySelectorAll('.cptab').forEach(tab => {
    tab.onclick = function() {
      document.querySelectorAll('.cptab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.cp-section').forEach(s => s.classList.remove('active'));
      const sec = el(tab.dataset.tab);
      if (sec) sec.classList.add('active');
    };
  });

  const editPriceBtn = el('cp-edit-price-btn');
  if (editPriceBtn) editPriceBtn.onclick = () => showToast('Скоро!');

  const setProfile = el('cp-set-profile');
  if (setProfile) setProfile.onclick = () => openModal('m-edit-profile');

  const setPayout = el('cp-set-payout');
  if (setPayout) setPayout.onclick = () => showToast('Скоро!');

  const setPrivacy = el('cp-set-privacy');
  if (setPrivacy) setPrivacy.onclick = () => showToast('Скоро!');

  const setTerms = el('cp-set-terms');
  if (setTerms) setTerms.onclick = () => window.location.href = 'terms.html';
}

// ═══════════════════════════════
// AUTH БУТОНИ
// ═══════════════════════════════

function bindAuthButtons() {
  const swLogin = el('sw-login');
  const swReg = el('sw-register');
  if (swLogin) swLogin.onclick = () => switchAuth('login');
  if (swReg) swReg.onclick = () => switchAuth('register');

  const lBtn = el('l-btn');
  if (lBtn) {
    lBtn.onclick = async () => {
      const email = el('l-email').value.trim();
      const pass = el('l-pass').value;
      const err = el('l-err');
      lBtn.textContent = 'Влизане...';
      lBtn.disabled = true;
      const result = await doLogin(email, pass);
      if (!result.success) {
        err.textContent = result.error;
        err.style.display = 'block';
      } else {
        closeModal('m-auth');
        err.style.display = 'none';
      }
      lBtn.textContent = 'Вход →';
      lBtn.disabled = false;
    };
  }

  const rBtn = el('r-btn');
  if (rBtn) {
    rBtn.onclick = async () => {
      const name = el('r-name').value.trim();
      const email = el('r-email').value.trim();
      const pass = el('r-pass').value;
      const err = el('r-err');
      rBtn.textContent = 'Регистрация...';
      rBtn.disabled = true;
      const result = await doRegister(name, email, pass);
      if (!result.success) {
        err.textContent = result.error;
        err.style.display = 'block';
      } else {
        closeModal('m-auth');
        err.style.display = 'none';
      }
      rBtn.textContent = 'Създай акаунт →';
      rBtn.disabled = false;
    };
  }
}

function switchAuth(type) {
  el('sw-login').classList.toggle('active', type === 'login');
  el('sw-register').classList.toggle('active', type === 'register');
  el('auth-login').style.display = type === 'login' ? '' : 'none';
  el('auth-register').style.display = type === 'register' ? '' : 'none';
}

// ═══════════════════════════════
// МЕНЮ БУТОНИ
// ═══════════════════════════════

function bindMenuButtons() {
  const menuBtn = el('menu-open-btn');
  if (menuBtn) menuBtn.onclick = () => openModal('m-menu');

  const themeBtn = el('m-theme');
  if (themeBtn) themeBtn.onclick = () => { toggleTheme(); closeModal('m-menu'); };

  const creatorBtn = el('m-creator-panel');
  if (creatorBtn) creatorBtn.onclick = () => {
    closeModal('m-menu');
    showPage('creator');
    loadCreatorPanel();
  };

  const termsBtn = el('m-terms');
  if (termsBtn) termsBtn.onclick = () => window.location.href = 'terms.html';

  const privacyBtn = el('m-privacy');
  if (privacyBtn) privacyBtn.onclick = () => window.location.href = 'privacy.html';

  const contactBtn = el('m-contact');
  if (contactBtn) contactBtn.onclick = () => window.location.href = 'contact.html';

  const aboutBtn = el('m-about');
  if (aboutBtn) aboutBtn.onclick = () => window.location.href = 'about.html';

  const logoutBtn = el('m-logout');
  if (logoutBtn) logoutBtn.onclick = async () => {
    await doLogout();
    closeModal('m-menu');
  };
}

// ═══════════════════════════════
// РЕДАКТИРАНЕ НА ПРОФИЛ
// ═══════════════════════════════

function bindEditProfileButtons() {
  const cancelBtn = el('edit-cancel-btn');
  if (cancelBtn) cancelBtn.onclick = () => closeModal('m-edit-profile');

  const saveBtn = el('edit-save-btn');
  if (saveBtn) {
    saveBtn.onclick = async () => {
      const username = el('edit-username').value.trim();
      const bio = el('edit-bio').value.trim();
      if (!username) { showToast('Въведи потребителско име!'); return; }
      if (!State.user) return;
      const ok = await updateProfile(State.user.id, { username, bio });
      if (ok) {
        State.user.username = username;
        State.user.bio = bio;
        closeModal('m-edit-profile');
        showToast('✅ Профилът е обновен!');
        renderProfile();
      } else {
        showToast('Грешка!');
      }
    };
  }
}

// ═══════════════════════════════
// СЪОБЩЕНИЯ
// ═══════════════════════════════

function bindMessageButtons() {
  const sendBtn = el('msg-send-btn');
  if (!sendBtn) return;
  sendBtn.onclick = () => {
    const inp = el('msg-inp');
    if (!inp || !inp.value.trim()) return;
    const list = el('msg-list');
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble mine';
    bubble.textContent = inp.value.trim();
    list.appendChild(bubble);
    inp.value = '';
    list.scrollTop = list.scrollHeight;
  };
}

// Правим showToast и openModal глобални за inline onclick в HTML
window.showToast = showToast;
window.openModal = openModal;
