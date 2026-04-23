// app.js — без ES modules, работи директно в браузъра

window.addEventListener('load', async function() {
  // Инициализираме Supabase
  if (typeof supabase !== 'undefined') {
    window.sb = supabase.createClient(
      'https://ucsogdvswugpynaqymtg.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjc29nZHZzd3VncHluYXF5bXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NzM2NTEsImV4cCI6MjA5MjM0OTY1MX0.pGjks7ghLR6tDyK0RlIPP57xIvbDomx-jelXHO8fEKI'
    );
  }

  if (window.lucide) window.lucide.createIcons();
  await renderFeed();
  console.log('Krevio стартира!');
});

async function renderFeed() {
  const wrap = document.getElementById('feed-wrap');
  if (!wrap) return;
  
  let videos = [];
  if (window.sb) {
    try {
      const r = await window.sb.from('videos').select('*').order('created_at', {ascending: false}).limit(20);
      if (r.data && r.data.length > 0) videos = r.data;
    } catch(e) { console.log(e); }
  }

  if (videos.length === 0) {
    wrap.innerHTML = '<div style="height:100vh;display:flex;align-items:center;justify-content:center;color:rgba(201,168,76,.4);text-align:center;padding:20px"><div><div style="font-size:3rem;margin-bottom:16px">🎬</div><div style="font-size:1rem;font-weight:700;color:rgba(201,168,76,.6)">Все още няма видеа</div></div></div>';
    return;
  }

  videos.forEach((v, i) => {
    const item = document.createElement('div');
    item.className = 'video-item';
    const vid = document.createElement('video');
    vid.className = 'v-player';
    vid.src = v.file_url;
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    item.appendChild(vid);
    const grad = document.createElement('div');
    grad.className = 'v-gradient';
    item.appendChild(grad);
    wrap.appendChild(item);
  });

  if (window.lucide) window.lucide.createIcons();
}
