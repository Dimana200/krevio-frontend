/* ============================================
   KREVIO — Cinematic Dark Platform
   Design: Industrial luxury meets Bulgarian soul
   ============================================ */

@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

:root {
  --black:    #000000;
  --void:     #050507;
  --deep:     #0a0a0f;
  --surface:  #111116;
  --card:     #16161d;
  --border:   rgba(255,255,255,0.06);
  --border2:  rgba(255,255,255,0.12);
  --red:      #e8192c;
  --red-dim:  rgba(232,25,44,0.15);
  --red-glow: rgba(232,25,44,0.3);
  --gold:     #f5c842;
  --gold-dim: rgba(245,200,66,0.12);
  --green:    #00e676;
  --green-dim:rgba(0,230,118,0.1);
  --white:    #ffffff;
  --gray1:    #e8e8f0;
  --gray2:    #9898b0;
  --gray3:    #444455;
  --font-display: 'Bebas Neue', sans-serif;
  --font-body:    'DM Sans', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;
}

/* ===== RESET ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { overflow-x: hidden; scroll-behavior: smooth; }
body {
  background: var(--void);
  color: var(--gray1);
  font-family: var(--font-body);
  min-height: 100vh;
  padding-bottom: 80px;
  -webkit-font-smoothing: antialiased;
}

/* ===== NOISE TEXTURE OVERLAY ===== */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.03;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}

/* ===== PAGES ===== */
.page { display: none; position: relative; z-index: 1; }
.page.active { display: block; }

/* ===== TOP NAV ===== */
.topnav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: rgba(5,5,7,0.92);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(20px);
}

.nav-logo {
  font-family: var(--font-display);
  font-size: 1.8rem;
  letter-spacing: 3px;
  color: var(--white);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-logo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--red);
  box-shadow: 0 0 12px var(--red);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.8); }
}

.nav-actions { display: flex; gap: 8px; align-items: center; }

/* ===== BUTTONS ===== */
.btn {
  padding: 8px 18px;
  border-radius: 6px;
  border: none;
  font-family: var(--font-body);
  font-size: .83rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s;
  letter-spacing: .3px;
}

.btn-ghost {
  background: transparent;
  color: var(--gray2);
  border: 1px solid var(--border2);
}
.btn-ghost:hover { background: rgba(255,255,255,.05); color: var(--white); }

.btn-red {
  background: var(--red);
  color: var(--white);
  box-shadow: 0 4px 20px var(--red-glow);
}
.btn-red:hover { transform: translateY(-1px); box-shadow: 0 6px 24px var(--red-glow); }

.btn-gold {
  background: var(--gold);
  color: var(--black);
  font-weight: 700;
}
.btn-gold:hover { transform: translateY(-1px); }

.btn-lg { padding: 14px 32px; font-size: .95rem; border-radius: 8px; }
.btn-sm { padding: 6px 12px; font-size: .76rem; }
.btn-full { width: 100%; justify-content: center; }

/* ===== HERO ===== */
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 24px 40px;
  position: relative;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,25,44,0.12) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 20% 80%, rgba(245,200,66,0.05) 0%, transparent 50%);
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
}

.hero-eyebrow {
  font-family: var(--font-mono);
  font-size: .72rem;
  color: var(--red);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.hero-eyebrow::before, .hero-eyebrow::after {
  content: '';
  width: 30px;
  height: 1px;
  background: var(--red);
  opacity: 0.5;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 12vw, 7rem);
  line-height: 0.95;
  letter-spacing: 4px;
  color: var(--white);
  margin-bottom: 24px;
  position: relative;
}

.hero-title .accent {
  color: transparent;
  -webkit-text-stroke: 1px var(--red);
  text-shadow: none;
}

.hero-sub {
  font-size: 1rem;
  color: var(--gray2);
  max-width: 380px;
  line-height: 1.7;
  margin-bottom: 40px;
}

.hero-cta { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }

.hero-stats {
  display: flex;
  gap: 0;
  margin-top: 64px;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255,255,255,0.02);
}

.hstat {
  padding: 20px 32px;
  text-align: center;
  border-right: 1px solid var(--border);
}
.hstat:last-child { border-right: none; }

.hstat-n {
  font-family: var(--font-display);
  font-size: 2rem;
  letter-spacing: 2px;
  color: var(--white);
  line-height: 1;
}

.hstat-l {
  font-family: var(--font-mono);
  font-size: .62rem;
  color: var(--gray3);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 4px;
}

/* ===== SECTION ===== */
.sec { padding: 0 20px 32px; }
.sec-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px 16px;
}
.sec-title {
  font-family: var(--font-mono);
  font-size: .68rem;
  color: var(--gray3);
  text-transform: uppercase;
  letter-spacing: 3px;
}
.sec-line {
  flex: 1;
  height: 1px;
  background: var(--border);
}
.sec-count {
  font-family: var(--font-mono);
  font-size: .65rem;
  color: var(--red);
}

/* ===== VIDEO FEED ===== */
.feed { display: flex; flex-direction: column; gap: 12px; padding: 0 16px 16px; }

.video-card {
  background: var(--card);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border);
  transition: border-color .3s, transform .3s;
}
.video-card:hover { border-color: var(--border2); transform: translateY(-2px); }

.video-thumb {
  height: 380px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-thumb-bg {
  position: absolute;
  inset: 0;
  transition: transform .3s;
}
.video-card:hover .video-thumb-bg { transform: scale(1.03); }

.video-thumb-icon {
  font-size: 4rem;
  position: relative;
  z-index: 2;
  opacity: 0.9;
}

.video-play-hint {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  z-index: 3;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(232,25,44,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  opacity: 0;
  transition: opacity .3s;
}
.video-card:hover .video-play-hint { opacity: 1; }

.video-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 4;
  font-family: var(--font-mono);
  font-size: .62rem;
  font-weight: 600;
  letter-spacing: 2px;
  padding: 4px 8px;
  border-radius: 4px;
}
.badge-live { background: var(--red); color: var(--white); }
.badge-new  { background: var(--gold); color: var(--black); }

.video-duration {
  position: absolute;
  bottom: 12px;
  right: 12px;
  z-index: 4;
  font-family: var(--font-mono);
  font-size: .72rem;
  background: rgba(0,0,0,.7);
  padding: 3px 8px;
  border-radius: 4px;
  color: var(--white);
}

.video-info { padding: 14px 16px 16px; }

.video-user {
  font-family: var(--font-mono);
  font-size: .72rem;
  color: var(--red);
  margin-bottom: 5px;
  letter-spacing: 1px;
}

.video-title {
  font-weight: 600;
  font-size: .95rem;
  margin-bottom: 12px;
  line-height: 1.4;
  color: var(--white);
}

.video-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.video-stats { display: flex; gap: 14px; }
.video-stat {
  font-family: var(--font-mono);
  font-size: .7rem;
  color: var(--gray2);
  display: flex;
  align-items: center;
  gap: 4px;
}

.video-earning {
  font-family: var(--font-mono);
  font-size: .82rem;
  font-weight: 600;
  color: var(--green);
  background: var(--green-dim);
  padding: 4px 10px;
  border-radius: 100px;
}

/* ===== AD CARD ===== */
.ad-card {
  margin: 0 16px;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid;
  cursor: pointer;
  transition: opacity .2s;
  position: relative;
  overflow: hidden;
}
.ad-card:hover { opacity: 0.85; }

.ad-label {
  position: absolute;
  top: 6px;
  right: 10px;
  font-family: var(--font-mono);
  font-size: .58rem;
  color: rgba(255,255,255,.4);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.ad-icon { font-size: 2rem; flex-shrink: 0; }
.ad-company { font-weight: 700; font-size: .92rem; margin-bottom: 2px; }
.ad-text { font-size: .79rem; color: rgba(255,255,255,.7); }
.ad-btn {
  margin-left: auto;
  padding: 7px 14px;
  border: none;
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: .75rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ===== HOW IT WORKS ===== */
.hiw { padding: 0 16px 24px; display: flex; flex-direction: column; gap: 10px; }

.hiw-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.hiw-num {
  font-family: var(--font-display);
  font-size: 3rem;
  line-height: 1;
  color: var(--border2);
  flex-shrink: 0;
  width: 40px;
}

.hiw-icon-wrap {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.hiw-title { font-weight: 700; font-size: .95rem; margin-bottom: 4px; color: var(--white); }
.hiw-sub { font-size: .8rem; color: var(--gray2); line-height: 1.6; }

/* ===== EARNINGS ===== */
.earn-wrap { padding: 0 16px 24px; }

.earn-card {
  background: linear-gradient(135deg, rgba(0,230,118,0.05), rgba(0,230,118,0.02));
  border: 1px solid rgba(0,230,118,0.15);
  border-radius: 16px;
  padding: 20px;
}

.earn-header {
  font-family: var(--font-mono);
  font-size: .68rem;
  color: var(--green);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.earn-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,.05);
}
.earn-row:last-child { border-bottom: none; }

.earn-views { font-size: .85rem; color: var(--gray2); }
.earn-amount { font-family: var(--font-mono); font-weight: 600; color: var(--green); }
.earn-amount.big { font-size: 1.1rem; }

/* ===== PLANS ===== */
.plans-wrap { padding: 0 16px 24px; display: flex; flex-direction: column; gap: 10px; }

.plan-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px;
  transition: border-color .3s;
}
.plan-card:hover { border-color: var(--border2); }
.plan-card.featured {
  border-color: var(--red);
  background: linear-gradient(135deg, rgba(232,25,44,0.08), var(--card));
  box-shadow: 0 0 30px rgba(232,25,44,0.08);
}

.plan-badge {
  font-family: var(--font-mono);
  font-size: .62rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--red);
  margin-bottom: 10px;
}

.plan-price {
  font-family: var(--font-display);
  font-size: 2.2rem;
  letter-spacing: 2px;
  color: var(--white);
  line-height: 1;
  margin-bottom: 4px;
}
.plan-price-sub { font-size: .8rem; color: var(--gray2); margin-bottom: 14px; }
.plan-name { font-weight: 700; font-size: 1rem; margin-bottom: 14px; color: var(--white); }

.plan-features { list-style: none; margin-bottom: 18px; }
.plan-features li {
  font-size: .82rem;
  color: var(--gray2);
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
}
.plan-features li:last-child { border-bottom: none; }
.plan-check { color: var(--green); font-size: .9rem; }

/* ===== EXPLORE ===== */
.explore-wrap { padding: 80px 16px 24px; }
.explore-search {
  position: relative;
  margin-bottom: 16px;
}
.explore-search input {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--white);
  padding: 12px 16px 12px 44px;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: .9rem;
  outline: none;
  transition: border-color .2s;
}
.explore-search input:focus { border-color: var(--red); }
.explore-search input::placeholder { color: var(--gray3); }
.explore-search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray3);
  font-size: 1rem;
}

.filter-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.ft {
  padding: 7px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 100px;
  font-size: .78rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--gray2);
  transition: all .2s;
  font-family: var(--font-body);
}
.ft:hover, .ft.active { background: var(--red-dim); border-color: var(--red); color: var(--white); }

.creator-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.creator-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: all .25s;
}
.creator-card:hover { border-color: var(--border2); transform: translateY(-2px); }

.creator-banner { height: 70px; position: relative; }
.creator-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid var(--void);
  position: absolute;
  bottom: -14px;
  left: 12px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--deep);
}

.creator-body { padding: 18px 12px 12px; }
.creator-name { font-weight: 700; font-size: .85rem; margin-bottom: 2px; color: var(--white); }
.creator-cat {
  font-family: var(--font-mono);
  font-size: .6rem;
  color: var(--red);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 6px;
}
.creator-desc { font-size: .74rem; color: var(--gray2); line-height: 1.5; margin-bottom: 10px; }
.creator-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid var(--border);
}
.creator-supporters { font-family: var(--font-mono); font-size: .65rem; color: var(--gray2); }

/* ===== DASHBOARD ===== */
.dash-wrap { padding: 70px 16px 24px; }

.dash-header { margin-bottom: 24px; }
.dash-greeting {
  font-family: var(--font-display);
  font-size: 2.2rem;
  letter-spacing: 3px;
  color: var(--white);
  line-height: 1;
  margin-bottom: 4px;
}
.dash-sub { font-size: .83rem; color: var(--gray2); }

.dash-upload-btn {
  width: 100%;
  background: linear-gradient(135deg, var(--red), #c01020);
  border: none;
  border-radius: 14px;
  padding: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  transition: transform .2s, box-shadow .2s;
  box-shadow: 0 8px 32px var(--red-glow);
}
.dash-upload-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px var(--red-glow); }
.dash-upload-icon { font-size: 2rem; }
.dash-upload-text { text-align: left; }
.dash-upload-title { font-weight: 800; font-size: 1rem; color: var(--white); }
.dash-upload-sub { font-size: .78rem; color: rgba(255,255,255,.65); margin-top: 2px; }
.dash-upload-arrow { margin-left: auto; font-size: 1.4rem; color: rgba(255,255,255,.5); }

.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }

.stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px;
}
.stat-label {
  font-family: var(--font-mono);
  font-size: .6rem;
  color: var(--gray3);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 8px;
}
.stat-val {
  font-family: var(--font-display);
  font-size: 1.9rem;
  letter-spacing: 2px;
  color: var(--white);
  line-height: 1;
  margin-bottom: 4px;
}
.stat-val.green { color: var(--green); }
.stat-change { font-family: var(--font-mono); font-size: .68rem; color: var(--gray2); }
.stat-change.up { color: var(--green); }
.stat-change.dn { color: var(--red); }

.goal-card {
  background: var(--card);
  border: 1px solid rgba(245,200,66,0.2);
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 20px;
}
.goal-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
.goal-title { font-weight: 700; font-size: .9rem; color: var(--white); }
.goal-pct { font-family: var(--font-mono); font-size: .82rem; color: var(--gold); }
.goal-bar-wrap { height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; margin-bottom: 6px; }
.goal-bar { height: 100%; background: linear-gradient(90deg, var(--gold), #ffed80); border-radius: 2px; }
.goal-sub { font-family: var(--font-mono); font-size: .65rem; color: var(--gray3); }

.activity-list { display: flex; flex-direction: column; }
.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.activity-item:last-child { border-bottom: none; }
.activity-ico {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .9rem;
  flex-shrink: 0;
}
.activity-txt { font-size: .8rem; flex: 1; color: var(--gray1); line-height: 1.4; }
.activity-time { font-family: var(--font-mono); font-size: .65rem; color: var(--gray3); white-space: nowrap; }

/* ===== PROFILE ===== */
.profile-banner {
  height: 160px;
  margin-top: 56px;
  position: relative;
  overflow: hidden;
}

.profile-info { padding: 0 20px; }
.profile-top {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  margin-top: -30px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.profile-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 3px solid var(--void);
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--deep);
  flex-shrink: 0;
}
.profile-name {
  font-family: var(--font-display);
  font-size: 1.5rem;
  letter-spacing: 2px;
  color: var(--white);
}
.profile-cat {
  font-family: var(--font-mono);
  font-size: .65rem;
  color: var(--red);
  text-transform: uppercase;
  letter-spacing: 2px;
}
.profile-actions { display: flex; gap: 8px; margin-left: auto; padding-bottom: 4px; }

.profile-stats { display: flex; gap: 24px; margin-bottom: 16px; flex-wrap: wrap; }
.profile-stat-n { font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 1px; color: var(--white); }
.profile-stat-l { font-family: var(--font-mono); font-size: .62rem; color: var(--gray3); text-transform: uppercase; }

.profile-bio { font-size: .84rem; color: var(--gray2); line-height: 1.7; margin-bottom: 20px; max-width: 500px; }

.ptabs { display: flex; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
.ptab {
  padding: 10px 16px;
  font-size: .82rem;
  font-weight: 600;
  color: var(--gray2);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all .2s;
  font-family: var(--font-body);
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
}
.ptab.active { color: var(--white); border-bottom-color: var(--red); }

.post-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 12px;
}
.post-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.post-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--deep); display: flex; align-items: center; justify-content: center; font-size: .9rem; flex-shrink: 0; }
.post-time { font-family: var(--font-mono); font-size: .65rem; color: var(--gray3); }
.post-tag {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: .62rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 3px 8px;
  border-radius: 4px;
}
.tag-free { background: rgba(0,230,118,.1); color: var(--green); }
.tag-paid { background: var(--red-dim); color: var(--red); }

.post-title { font-weight: 700; font-size: 1rem; color: var(--white); margin-bottom: 8px; }
.post-text { font-size: .83rem; color: var(--gray2); line-height: 1.7; margin-bottom: 12px; }
.post-media {
  background: var(--deep);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.post-actions { display: flex; gap: 16px; }
.post-action { font-size: .78rem; color: var(--gray2); cursor: pointer; font-family: var(--font-mono); transition: color .2s; }
.post-action:hover { color: var(--white); }

.locked-card {
  background: var(--deep);
  border: 1px dashed var(--border2);
  border-radius: 14px;
  padding: 28px;
  text-align: center;
  margin-bottom: 12px;
}
.locked-icon { font-size: 1.8rem; margin-bottom: 10px; }
.locked-title { font-weight: 700; margin-bottom: 6px; color: var(--white); }
.locked-sub { font-size: .82rem; color: var(--gray2); margin-bottom: 16px; }

/* ===== MODALS ===== */
.modal {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0,0,0,.85);
  align-items: flex-end;
  justify-content: center;
}
.modal.open { display: flex; }

.modal-box {
  background: var(--surface);
  border-radius: 20px 20px 0 0;
  padding: 28px 24px;
  width: 100%;
  max-height: 92vh;
  overflow-y: auto;
  border-top: 1px solid var(--border);
  animation: slideUp .3s ease;
}

@keyframes slideUp {
  from { transform: translateY(40px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.modal-title { font-weight: 800; font-size: 1.1rem; color: var(--white); }
.modal-close {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--gray2);
  cursor: pointer;
  font-size: .9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color .2s;
}
.modal-close:hover { color: var(--white); }

/* ===== FORM ===== */
.fg { margin-bottom: 14px; }
.fl {
  display: block;
  font-family: var(--font-mono);
  font-size: .65rem;
  color: var(--gray3);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 6px;
}
.fi {
  width: 100%;
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--white);
  padding: 11px 14px;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: .9rem;
  outline: none;
  transition: border-color .2s;
}
.fi:focus { border-color: var(--red); }
.fi::placeholder { color: var(--gray3); }
.fsel {
  width: 100%;
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--white);
  padding: 11px 14px;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: .9rem;
  outline: none;
  cursor: pointer;
}
.ferr {
  color: var(--red);
  font-size: .78rem;
  margin-bottom: 10px;
  display: none;
  padding: 8px 12px;
  background: var(--red-dim);
  border-radius: 6px;
  border: 1px solid rgba(232,25,44,.2);
}
.ftog { text-align: center; margin-top: 16px; font-size: .82rem; color: var(--gray2); }
.ftog a { color: var(--red); cursor: pointer; }

/* ===== UPLOAD DROPZONE ===== */
.dropzone {
  border: 2px dashed rgba(232,25,44,.25);
  border-radius: 14px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all .25s;
  margin-bottom: 16px;
}
.dropzone:hover, .dropzone.over { border-color: var(--red); background: var(--red-dim); }
.dropzone-icon { font-size: 2.8rem; margin-bottom: 10px; }
.dropzone-title { font-weight: 700; color: var(--white); margin-bottom: 4px; }
.dropzone-sub { font-size: .8rem; color: var(--gray2); }

.file-info {
  background: var(--card);
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  display: none;
}
.file-icon { font-size: 1.4rem; flex-shrink: 0; }
.file-name { font-weight: 600; font-size: .84rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.file-size { font-family: var(--font-mono); font-size: .7rem; color: var(--gray2); }
.file-rm { margin-left: auto; background: none; border: none; color: var(--gray2); cursor: pointer; font-size: .9rem; }

.upload-prog { display: none; margin-bottom: 14px; }
.upload-prog-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
.upload-prog-status { font-size: .82rem; font-weight: 600; color: var(--white); }
.upload-prog-pct { font-family: var(--font-mono); font-size: .82rem; color: var(--red); font-weight: 700; }
.upload-bar-wrap { height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; margin-bottom: 6px; }
.upload-bar { height: 100%; width: 0; background: linear-gradient(90deg, var(--red), #ff4060); border-radius: 2px; transition: width .3s; }
.upload-speed { font-family: var(--font-mono); font-size: .68rem; color: var(--gray3); }

.upload-success {
  display: none;
  background: var(--green-dim);
  border: 1px solid rgba(0,230,118,.2);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-bottom: 14px;
}
.upload-success-icon { font-size: 2rem; margin-bottom: 8px; }
.upload-success-title { font-weight: 700; color: var(--white); margin-bottom: 4px; }
.upload-success-url { font-family: var(--font-mono); font-size: .7rem; color: var(--gray2); word-break: break-all; }

.upload-actions { display: flex; gap: 8px; }

/* ===== BOTTOM NAV ===== */
.botnav {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 100;
  height: 70px;
  background: rgba(5,5,7,.95);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 8px 8px;
}

.bn-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  color: var(--gray3);
  font-family: var(--font-mono);
  font-size: .58rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 6px 12px;
  border-radius: 10px;
  transition: all .2s;
}
.bn-item:hover, .bn-item.active { color: var(--white); }
.bn-item.active { color: var(--white); }

.bn-icon { font-size: 1.3rem; line-height: 1; }

.bn-upload {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: var(--red);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  cursor: pointer;
  box-shadow: 0 4px 20px var(--red-glow);
  transition: transform .2s, box-shadow .2s;
  margin-bottom: 16px;
}
.bn-upload:hover { transform: translateY(-2px); box-shadow: 0 8px 28px var(--red-glow); }

/* ===== TOAST ===== */
.toast {
  position: fixed;
  bottom: 86px;
  left: 50%;
  transform: translateX(-50%) translateY(12px);
  z-index: 999;
  background: var(--card);
  border: 1px solid var(--border2);
  color: var(--white);
  padding: 10px 20px;
  border-radius: 100px;
  font-size: .82rem;
  font-weight: 600;
  box-shadow: 0 8px 28px rgba(0,0,0,.6);
  opacity: 0;
  transition: all .3s;
  pointer-events: none;
  white-space: nowrap;
  font-family: var(--font-body);
}
.toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }

/* ===== RESPONSIVE ===== */
@media (min-width: 600px) {
  body { max-width: 430px; margin: 0 auto; }
  .topnav, .botnav { max-width: 430px; left: 50%; transform: translateX(-50%); }
  .toast { max-width: 380px; }
}
