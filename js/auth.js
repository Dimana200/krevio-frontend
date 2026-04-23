// auth.js — вход, регистрация, изход

import State from './state.js';
import { fetchProfile, insertProfile } from './api.js';
import { showToast } from './ui.js';
import { renderProfile } from './pages/profile.js';
import { renderFeed } from './pages/feed.js';

// ═══════════════════════════════
// ИНИЦИАЛИЗАЦИЯ
// ═══════════════════════════════

export async function initAuth() {
  if (!State.sb) return;

  // Проверяваме дали има запазена сесия
  const { data } = await State.sb.auth.getSession();
  if (data && data.session) {
    await setCurrentUser(data.session.user);
    renderProfile();
    renderFeed();
  } else {
    renderFeed();
  }

  // Слушаме за промени в сесията
  State.sb.auth.onAuthStateChange(async function(event, session) {
    if (session) {
      await setCurrentUser(session.user);
      renderProfile();
    } else {
      State.clearUser();
      renderProfile();
    }
  });
}

// ═══════════════════════════════
// ПОМОЩНИ ФУНКЦИИ
// ═══════════════════════════════

async function setCurrentUser(supabaseUser) {
  const name = supabaseUser.user_metadata?.name
    || supabaseUser.email.split('@')[0];

  State.setUser({
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: name,
    avatar: '',
    bio: '',
    username: name
  });

  // Зареждаме профила от базата
  const profile = await fetchProfile(supabaseUser.id);
  if (profile) {
    State.user.avatar = profile.avatar_url
      ? profile.avatar_url + '?t=' + Date.now()
      : '';
    State.user.bio = profile.bio || '';
    State.user.username = profile.username || name;
  }
}

// ═══════════════════════════════
// ВХОД
// ═══════════════════════════════

export async function doLogin(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Попълни имейл и парола.' };
  }

  const { data, error } = await State.sb.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    const msg = error.message.includes('Email not confirmed')
      ? 'Потвърди имейла си първо!'
      : 'Грешни имейл или парола.';
    return { success: false, error: msg };
  }

  await setCurrentUser(data.user);
  renderProfile();
  renderFeed();

  showToast('👋 Добре дошъл, ' + (State.user.username || State.user.name) + '!');
  return { success: true };
}

// ═══════════════════════════════
// РЕГИСТРАЦИЯ
// ═══════════════════════════════

export async function doRegister(name, email, password) {
  if (!name || !email || !password) {
    return { success: false, error: 'Попълни всички полета.' };
  }

  if (password.length < 8) {
    return { success: false, error: 'Паролата трябва да е поне 8 символа.' };
  }

  const { data, error } = await State.sb.auth.signUp({
    email,
    password,
    options: { data: { name } }
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data && data.user) {
    const username = name.toLowerCase().replace(/\s+/g, '_');
    await insertProfile({
      id: data.user.id,
      username: username,
      full_name: name,
      bio: '',
      avatar_url: ''
    });
  }

  showToast('🎉 Провери имейла си за потвърждение!');
  return { success: true };
}

// ═══════════════════════════════
// ИЗХОД
// ═══════════════════════════════

export async function doLogout() {
  if (State.sb) {
    await State.sb.auth.signOut();
  }
  State.clearUser();
  renderProfile();
  showToast('👋 Излязохте.');
}

// ═══════════════════════════════
// ПРОВЕРКА
// ═══════════════════════════════

export function isLoggedIn() {
  return !!State.user;
}

export function requireLogin(message) {
  if (!State.user) {
    showToast(message || 'Влез в акаунта си!');
    document.getElementById('m-auth').classList.add('open');
    if (window.lucide) window.lucide.createIcons();
    return false;
  }
  return true;
}
