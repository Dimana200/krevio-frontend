// ============================================
// KREVIO — feed.js
// Video feed, ads, creators data
// ============================================

var CREATORS = [
  { name: "Виктор Александров", cat: "music", catName: "Музика", emoji: "🎵", desc: "Музикален продуцент. Tutorials по аудио инженерство.", supporters: 1247, price: 2.50, banner: "linear-gradient(135deg,#1a0a2e,#0d1a2e,#2e0a1a)" },
  { name: "Мария Попова", cat: "art", catName: "Изкуство", emoji: "🎨", desc: "Дигитален художник и аниматор.", supporters: 892, price: 1.50, banner: "linear-gradient(135deg,#2e0a1a,#1a0d2e)" },
  { name: "Технология БГ", cat: "tech", catName: "Технологии", emoji: "💻", desc: "Курсове по Python, AI и уеб разработка.", supporters: 2104, price: 4, banner: "linear-gradient(135deg,#0a1a0a,#0a1a2e)" },
  { name: "Кино Разкази", cat: "video", catName: "Видео", emoji: "🎬", desc: "Задкулисни материали и ранен достъп.", supporters: 645, price: 2.50, banner: "linear-gradient(135deg,#2e1a0a,#1a2e0a)" },
  { name: "Пера и Мисли", cat: "writing", catName: "Писане", emoji: "✍️", desc: "Ексклузивни истории всяка седмица.", supporters: 432, price: 2, banner: "linear-gradient(135deg,#1a1a2e,#2e1a1a)" },
  { name: "Pixel Quest", cat: "games", catName: "Игри", emoji: "🎮", desc: "Следи как правя игри от нула.", supporters: 1830, price: 3, banner: "linear-gradient(135deg,#0a2e0a,#2e2e0a)" },
  { name: "Яна Стефанова", cat: "art", catName: "Илюстрации", emoji: "🖌️", desc: "Speed paints и Procreate brushes.", supporters: 561, price: 2, banner: "linear-gradient(135deg,#2e0a2e,#0a2e2e)" },
  { name: "Алекс Медиа", cat: "video", catName: "Влогове", emoji: "📹", desc: "Behind-the-scenes от живота на фрийлансър.", supporters: 978, price: 1.50, banner: "linear-gradient(135deg,#1a2e1a,#2e1a2e)" }
];

var VIDEOS = [
  { user: "@viktor_bg", title: "Как направих хит с 200 EUR оборудване", views: "12.3K", earnings: "1.20", likes: "892", comments: "43", duration: "0:58", badge: "live", gradient: "linear-gradient(160deg,#1a0a2e,#2e0a1a)" },
  { user: "@maria_art", title: "Speed paint — портрет за 60 секунди", views: "8.9K", earnings: "0.87", likes: "654", comments: "28", duration: "0:45", badge: "new", gradient: "linear-gradient(160deg,#2e0a1a,#1a0d2e)" },
  { user: "@tech_bg", title: "Python трик който не знаеш", views: "24.1K", earnings: "2.35", likes: "1.2K", comments: "87", duration: "1:12", badge: "live", gradient: "linear-gradient(160deg,#0a1a0a,#0a1a2e)" },
  { user: "@kino_bg", title: "Как се прави кино сцена от нула", views: "6.4K", earnings: "0.62", likes: "412", comments: "19", duration: "0:52", badge: "", gradient: "linear-gradient(160deg,#2e1a0a,#1a2e0a)" },
  { user: "@pixel_quest", title: "Правя игра от нула — Ден 1", views: "18.7K", earnings: "1.82", likes: "934", comments: "61", duration: "1:05", badge: "new", gradient: "linear-gradient(160deg,#0a2e0a,#2e2e0a)" }
];

var ADS = [
  { company: "Техномаркет", text: "Лаптопи от 599 лв — лимитирана оферта!", color: "#e8192c", border: "rgba(232,25,44,0.2)", bg: "rgba(232,25,44,0.06)", emoji: "💻", btnColor: "#e8192c", btnText: "#fff" },
  { company: "Kaufland България", text: "Промоции тази седмица — до 50% отстъпка", color: "#e53e3e", border: "rgba(229,62,62,0.2)", bg: "rgba(229,62,62,0.06)", emoji: "🛒", btnColor: "#e53e3e", btnText: "#fff" },
  { company: "Виваком", text: "Интернет 1Gbps за само 25 лв/месец", color: "#3182ce", border: "rgba(49,130,206,0.2)", bg: "rgba(49,130,206,0.06)", emoji: "📡", btnColor: "#3182ce", btnText: "#fff" },
  { company: "Банка ДСК", text: "Бърз кредит до 50,000 лв изцяло онлайн", color: "#2f855a", border: "rgba(47,133,90,0.2)", bg: "rgba(47,133,90,0.06)", emoji: "🏦", btnColor: "#2f855a", btnText: "#fff" }
];

var EMOJIS = ["🎵", "🎨", "💻", "🎬", "🎮"];
var activeFilter = "all";

// ===== RENDER VIDEO FEED =====
function renderFeed() {
  var feed = document.getElementById("video-feed");
  if (!feed) return;
  feed.innerHTML = "";

  for (var i = 0; i < VIDEOS.length; i++) {
    var v = VIDEOS[i];

    // Ad every 2 videos
    if (i > 0 && i % 2 === 0) {
      var adIdx = Math.floor(i / 2) % ADS.length;
      feed.appendChild(buildAdCard(ADS[adIdx]));
    }

    feed.appendChild(buildVideoCard(v, i));
  }
}

function buildVideoCard(v, i) {
  var card = document.createElement("div");
  card.className = "video-card";

  // Thumb
  var thumb = document.createElement("div");
  thumb.className = "video-thumb";
  thumb.onclick = function() { showToast("▶ Видеото се зарежда..."); };

  var bg = document.createElement("div");
  bg.className = "video-thumb-bg";
  bg.style.cssText = "background:" + v.gradient + ";position:absolute;inset:0;";

  var icon = document.createElement("div");
  icon.className = "video-thumb-icon";
  icon.textContent = EMOJIS[i % EMOJIS.length];

  var playHint = document.createElement("div");
  playHint.className = "video-play-hint";
  playHint.textContent = "▶";

  var dur = document.createElement("div");
  dur.className = "video-duration";
  dur.textContent = v.duration;

  thumb.appendChild(bg);
  thumb.appendChild(icon);
  thumb.appendChild(playHint);
  thumb.appendChild(dur);

  if (v.badge) {
    var badge = document.createElement("div");
    badge.className = "video-badge " + (v.badge === "live" ? "badge-live" : "badge-new");
    badge.textContent = v.badge === "live" ? "● LIVE" : "НОВО";
    thumb.appendChild(badge);
  }

  // Info
  var info = document.createElement("div");
  info.className = "video-info";

  var user = document.createElement("div");
  user.className = "video-user";
  user.textContent = v.user;

  var title = document.createElement("div");
  title.className = "video-title";
  title.textContent = v.title;

  var meta = document.createElement("div");
  meta.className = "video-meta";

  var stats = document.createElement("div");
  stats.className = "video-stats";
  stats.innerHTML =
    "<span class='video-stat'>❤ " + v.likes + "</span>" +
    "<span class='video-stat'>💬 " + v.comments + "</span>" +
    "<span class='video-stat'>👁 " + v.views + "</span>";

  var earning = document.createElement("div");
  earning.className = "video-earning";
  earning.textContent = "+" + v.earnings + "€";

  meta.appendChild(stats);
  meta.appendChild(earning);

  info.appendChild(user);
  info.appendChild(title);
  info.appendChild(meta);

  card.appendChild(thumb);
  card.appendChild(info);

  return card;
}

function buildAdCard(ad) {
  var wrap = document.createElement("div");
  wrap.className = "ad-card";
  wrap.style.cssText = "background:" + ad.bg + ";border-color:" + ad.border + ";";
  wrap.onclick = function() { showToast("🔗 Отваряне на реклама..."); };

  var label = document.createElement("div");
  label.className = "ad-label";
  label.textContent = "РЕКЛАМА";

  var icon = document.createElement("div");
  icon.className = "ad-icon";
  icon.textContent = ad.emoji;

  var mid = document.createElement("div");
  var company = document.createElement("div");
  company.className = "ad-company";
  company.textContent = ad.company;
  var text = document.createElement("div");
  text.className = "ad-text";
  text.textContent = ad.text;
  mid.appendChild(company);
  mid.appendChild(text);

  var btn = document.createElement("button");
  btn.className = "ad-btn";
  btn.style.cssText = "background:" + ad.btnColor + ";color:" + ad.btnText + ";";
  btn.textContent = "Научи";
  btn.onclick = function(e) { e.stopPropagation(); showToast("🔗 " + ad.company); };

  wrap.appendChild(label);
  wrap.appendChild(icon);
  wrap.appendChild(mid);
  wrap.appendChild(btn);

  return wrap;
}

// ===== RENDER CREATORS GRID =====
function renderGrid(id, items) {
  var el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = "";

  if (!items || !items.length) {
    el.innerHTML = "<p style='color:var(--gray3);padding:20px 0;font-family:var(--font-mono);font-size:.75rem;'>// няма резултати</p>";
    return;
  }

  for (var i = 0; i < items.length; i++) {
    el.appendChild(buildCreatorCard(items[i]));
  }
}

function buildCreatorCard(c) {
  var card = document.createElement("div");
  card.className = "creator-card";
  card.onclick = function() { showPage("profile"); };

  var banner = document.createElement("div");
  banner.className = "creator-banner";
  banner.style.cssText = "background:" + c.banner + ";";

  var avatar = document.createElement("div");
  avatar.className = "creator-avatar";
  avatar.textContent = c.emoji;
  banner.appendChild(avatar);

  var body = document.createElement("div");
  body.className = "creator-body";

  var name = document.createElement("div");
  name.className = "creator-name";
  name.textContent = c.name;

  var cat = document.createElement("div");
  cat.className = "creator-cat";
  cat.textContent = c.catName;

  var desc = document.createElement("div");
  desc.className = "creator-desc";
  desc.textContent = c.desc;

  var foot = document.createElement("div");
  foot.className = "creator-foot";

  var sup = document.createElement("div");
  sup.className = "creator-supporters";
  sup.textContent = "👥 " + c.supporters.toLocaleString();

  var btn = document.createElement("button");
  btn.className = "btn btn-red btn-sm";
  btn.textContent = c.price + "€";
  btn.onclick = function(e) { e.stopPropagation(); buyPlan("studio"); };

  foot.appendChild(sup);
  foot.appendChild(btn);

  body.appendChild(name);
  body.appendChild(cat);
  body.appendChild(desc);
  body.appendChild(foot);

  card.appendChild(banner);
  card.appendChild(body);

  return card;
}

// ===== FILTER =====
function setFilter(cat, el) {
  activeFilter = cat;
  document.querySelectorAll(".ft").forEach(function(t) { t.classList.remove("active"); });
  el.classList.add("active");
  filterCreators();
}

function filterCreators() {
  var inp = document.getElementById("search-input");
  var q = inp ? inp.value.toLowerCase() : "";
  var filtered = CREATORS.filter(function(c) {
    var matchCat = (activeFilter === "all" || c.cat === activeFilter);
    var matchQ = !q || c.name.toLowerCase().indexOf(q) >= 0 || c.catName.toLowerCase().indexOf(q) >= 0;
    return matchCat && matchQ;
  });
  renderGrid("explore-grid", filtered);
}

// ===== ACTIVITY FEED =====
function renderActivity() {
  var el = document.getElementById("activity-feed");
  if (!el) return;

  var items = [
    { icon: "💛", bg: "#2a1a00", text: "<strong>Мария К.</strong> се абонира за Студио", time: "2 мин" },
    { icon: "💬", bg: "#0a1a2a", text: "<strong>Петър Г.</strong> коментира твоето видео", time: "18 мин" },
    { icon: "💛", bg: "#2a1a00", text: "<strong>Анна В.</strong> се абонира за Фен", time: "45 мин" },
    { icon: "❤️", bg: "#2a0a0a", text: "<strong>Иван С.</strong> хареса публикацията ти", time: "1 ч" },
    { icon: "🏆", bg: "#1a0a2a", text: "<strong>Стефан М.</strong> ъпгрейдна до Про", time: "3 ч" }
  ];

  el.innerHTML = "";
  items.forEach(function(a) {
    var d = document.createElement("div");
    d.className = "activity-item";

    var ico = document.createElement("div");
    ico.className = "activity-ico";
    ico.style.cssText = "background:" + a.bg + ";";
    ico.textContent = a.icon;

    var txt = document.createElement("div");
    txt.className = "activity-txt";
    txt.innerHTML = a.text;

    var time = document.createElement("div");
    time.className = "activity-time";
    time.textContent = a.time + " назад";

    d.appendChild(ico);
    d.appendChild(txt);
    d.appendChild(time);
    el.appendChild(d);
  });
}
