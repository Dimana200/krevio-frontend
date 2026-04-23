// state.js — централно хранилище на данни

const State = {
  // Текущ потребител
  user: null,

  // Supabase клиент
  sb: null,

  // Аудио
  audioUnlocked: false,

  // Текущо видео в коментари
  currentVideoId: null,

  // Upload
  uploadFile: null,
  uploadXhr: null,
  uploadAccess: "free",

  // Fullscreen
  isFullscreen: false,

  // Следвани потребители
  following: {},

  // Тема
  isDark: true,

  // Конфигурация
  config: {
    SB_URL: "https://ucsogdvswugpynaqymtg.supabase.co",
    SB_ANON: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjc29nZHZzd3VncHluYXF5bXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NzM2NTEsImV4cCI6MjA5MjM0OTY1MX0.pGjks7ghLR6tDyK0RlIPP57xIvbDomx-jelXHO8fEKI",
    BACKEND: "https://krevio-backend-production.up.railway.app"
  },

  // Методи за обновяване
  setUser(user) {
    this.user = user;
  },

  clearUser() {
    this.user = null;
  },

  setFollowing(userId, isFollowing) {
    this.following[userId] = isFollowing;
  },

  isFollowing(userId) {
    return this.following[userId] || false;
  }
};

export default State;
