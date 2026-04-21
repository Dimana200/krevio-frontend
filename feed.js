// ============================================
// KREVIO — upload.js
// Video upload to Cloudflare R2 via Railway
// ============================================

var RAILWAY_URL = "https://krevio-backend-production.up.railway.app/upload";

var uplFile = null;
var uplXhr  = null;

// ===== OPEN / CLOSE MODAL =====
function openUploadModal() {
  var m = document.getElementById("upload-modal");
  if (m) m.classList.add("open");
  resetUpload();
}

function closeUploadModal() {
  if (uplXhr) { uplXhr.abort(); uplXhr = null; }
  var m = document.getElementById("upload-modal");
  if (m) m.classList.remove("open");
  resetUpload();
}

// ===== RESET STATE =====
function resetUpload() {
  uplFile = null;

  var inp = document.getElementById("upl-inp"); if (inp) inp.value = "";
  var dz  = document.getElementById("upl-dz");  if (dz)  dz.style.display = "block";

  var fileInfo = document.getElementById("upl-file-info"); if (fileInfo) fileInfo.style.display = "none";
  var prog     = document.getElementById("upl-prog");       if (prog)     prog.style.display = "none";
  var suc      = document.getElementById("upl-suc");        if (suc)      suc.style.display = "none";
  var act      = document.getElementById("upl-act");        if (act)      act.style.display = "flex";

  var bar = document.getElementById("upl-bar"); if (bar) bar.style.width = "0";
  var pct = document.getElementById("upl-pct"); if (pct) pct.textContent = "0%";

  var title = document.getElementById("upl-title"); if (title) title.value = "";
  var desc  = document.getElementById("upl-desc");  if (desc)  desc.value  = "";
}

// ===== FILE SELECTION =====
function uplSelect(e) {
  if (e.target.files && e.target.files[0]) setUplFile(e.target.files[0]);
}

function uplDrop(e) {
  e.preventDefault();
  var dz = document.getElementById("upl-dz");
  if (dz) dz.classList.remove("over");
  if (e.dataTransfer && e.dataTransfer.files[0]) setUplFile(e.dataTransfer.files[0]);
}

function uplDragOver(e) {
  e.preventDefault();
  var dz = document.getElementById("upl-dz");
  if (dz) dz.classList.add("over");
}

function uplDragLeave() {
  var dz = document.getElementById("upl-dz");
  if (dz) dz.classList.remove("over");
}

function setUplFile(file) {
  uplFile = file;

  var dz = document.getElementById("upl-dz");
  if (dz) dz.style.display = "none";

  var fi = document.getElementById("upl-file-info");
  if (fi) fi.style.display = "flex";

  var fn = document.getElementById("upl-file-name");
  if (fn) fn.textContent = file.name;

  var fs = document.getElementById("upl-file-size");
  if (fs) fs.textContent = fmtBytes(file.size);

  var ficon = document.getElementById("upl-file-icon");
  if (ficon) {
    var ext = file.name.split(".").pop().toLowerCase();
    ficon.textContent = ["mp4","mov","avi","mkv"].indexOf(ext) >= 0 ? "🎬" : "📄";
  }
}

// ===== START UPLOAD =====
function startUpload() {
  if (!uplFile) { showToast("⚠ Избери видео файл!"); return; }

  var tit = document.getElementById("upl-title");
  if (!tit || !tit.value.trim()) {
    showToast("⚠ Въведи заглавие!");
    if (tit) tit.focus();
    return;
  }

  // Show progress, hide actions
  var act  = document.getElementById("upl-act");  if (act)  act.style.display = "none";
  var prog = document.getElementById("upl-prog"); if (prog) prog.style.display = "block";

  var stat = document.getElementById("upl-stat");
  var bar  = document.getElementById("upl-bar");
  var pct  = document.getElementById("upl-pct");
  var spd  = document.getElementById("upl-speed");

  if (stat) stat.textContent = "Свързване с R2...";

  var t0 = Date.now();
  var fd = new FormData();
  fd.append("file", uplFile);
  fd.append("title", tit.value.trim());

  var desc = document.getElementById("upl-desc");
  fd.append("description", desc ? desc.value : "");

  var access = document.getElementById("upl-access");
  fd.append("access", access ? access.value : "studio");

  uplXhr = new XMLHttpRequest();
  uplXhr.open("POST", RAILWAY_URL, true);

  uplXhr.upload.onprogress = function(e) {
    if (!e.lengthComputable) return;
    var p = Math.round(e.loaded / e.total * 100);
    if (bar) bar.style.width = p + "%";
    if (pct) pct.textContent = p + "%";
    if (stat) stat.textContent = "Качване в Cloudflare R2...";

    var secs = Math.max(0.1, (Date.now() - t0) / 1000);
    var mbps = ((e.loaded / 1048576) / secs).toFixed(1);
    if (spd) spd.textContent = fmtBytes(e.loaded) + " / " + fmtBytes(e.total) + " — " + mbps + " MB/s";
  };

  uplXhr.onload = function() {
    uplXhr = null;
    var res = {};
    try { res = JSON.parse(this.responseText); } catch(er) {}

    if (this.status === 200 || this.status === 201) {
      if (bar) bar.style.width = "100%";
      if (pct) pct.textContent = "100%";
      if (stat) stat.textContent = "Завършено!";

      setTimeout(function() {
        if (prog) prog.style.display = "none";

        var suc = document.getElementById("upl-suc");
        if (suc) suc.style.display = "block";

        var urlEl = document.getElementById("upl-url");
        if (urlEl) urlEl.textContent = res.url || res.fileUrl || "r2://krevio-media/" + uplFile.name;

        showToast("✅ Видеото е качено в R2!");
      }, 600);
    } else {
      if (stat) stat.textContent = "Грешка: " + this.status;
      if (act) act.style.display = "flex";
      showToast("❌ Грешка при качване (" + this.status + ")");
    }
  };

  uplXhr.onerror = function() {
    uplXhr = null;
    if (stat) stat.textContent = "Мрежова грешка!";
    if (act) act.style.display = "flex";
    showToast("❌ Грешка при свързване");
  };

  uplXhr.onabort = function() { uplXhr = null; };

  uplXhr.send(fd);
}

// ===== HELPERS =====
function fmtBytes(b) {
  if (b < 1048576)    return (b / 1024).toFixed(1) + " KB";
  if (b < 1073741824) return (b / 1048576).toFixed(1) + " MB";
  return (b / 1073741824).toFixed(2) + " GB";
}
