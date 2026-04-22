// KREVIO — upload.js v2.0 (Presigned URL)

const BACKEND = "https://krevio-backend-production.up.railway.app";

var uplFile = null;

function openUploadModal() {
  document.getElementById("upl-modal").classList.add("open");
  resetUpload();
}

function closeUploadModal() {
  document.getElementById("upl-modal").classList.remove("open");
  resetUpload();
}

function resetUpload() {
  uplFile = null;
  var inp = document.getElementById("upl-inp"); if(inp) inp.value = "";
  var dz  = document.getElementById("upl-dz");  if(dz)  dz.style.display = "block";
  var fi  = document.getElementById("upl-fi");  if(fi)  fi.style.display = "none";
  var pr  = document.getElementById("upl-prog");if(pr)  pr.style.display = "none";
  var su  = document.getElementById("upl-suc"); if(su)  su.style.display = "none";
  var bar = document.getElementById("upl-bar"); if(bar) bar.style.width = "0%";
  var pct = document.getElementById("upl-pct"); if(pct) pct.textContent = "0%";
}

function onFileSelect(e) {
  var file = e.target.files[0];
  if(!file) return;
  uplFile = file;
  showFileInfo(file);
}

function onDrop(e) {
  e.preventDefault();
  document.getElementById("upl-dz").classList.remove("over");
  var file = e.dataTransfer.files[0];
  if(!file) return;
  uplFile = file;
  showFileInfo(file);
}

function showFileInfo(file) {
  document.getElementById("upl-dz").style.display = "none";
  var fi = document.getElementById("upl-fi");
  fi.style.display = "flex";
  document.getElementById("upl-fname").textContent = file.name;
  document.getElementById("upl-fsize").textContent = (file.size/1024/1024).toFixed(1) + " MB";
}

async function startUpload() {
  if(!uplFile) return;

  var title = document.getElementById("upl-title");
  if(!title || !title.value.trim()) {
    showToast("⚠️ Въведи заглавие!");
    return;
  }

  var token = localStorage.getItem("krevio_token");
  if(!token) {
    showToast("⚠️ Влез в акаунта си!");
    return;
  }

  document.getElementById("upl-prog").style.display = "block";
  document.getElementById("upl-fi").style.display = "none";

  try {
    var presignRes = await fetch(BACKEND + "/presign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        fileName:    uplFile.name,
        mimeType:    uplFile.type,
        title:       title.value.trim(),
        description: (document.getElementById("upl-desc") || {}).value || "",
        access:      (document.getElementById("upl-access") || {}).value || "free"
      })
    });

    var presignData = await presignRes.json();
    if(!presignRes.ok) {
      showToast("❌ " + (presignData.error || "Грешка"));
      resetUpload();
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", presignData.uploadUrl);
    xhr.setRequestHeader("Content-Type", uplFile.type);

    xhr.upload.onprogress = function(e) {
      if(e.lengthComputable) {
        var pct = Math.round(e.loaded / e.total * 100);
        document.getElementById("upl-bar").style.width = pct + "%";
        document.getElementById("upl-pct").textContent = pct + "%";
      }
    };

    xhr.onload = function() {
      if(xhr.status === 200) {
        document.getElementById("upl-prog").style.display = "none";
        document.getElementById("upl-suc").style.display = "block";
        showToast("✅ Видеото е качено!");
      } else {
        showToast("❌ Грешка при качване в R2");
        resetUpload();
      }
    };

    xhr.onerror = function() {
      showToast("❌ Мрежова грешка");
      resetUpload();
    };

    xhr.send(uplFile);

  } catch(err) {
    console.error(err);
    showToast("❌ Грешка: " + err.message);
    resetUpload();
  }
}
