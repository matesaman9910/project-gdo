
let soundEnabled = false;

function enableSound() {
  const sound = document.getElementById("bubbleSound");
  sound.play().catch(() => {});
  soundEnabled = true;
  document.getElementById("soundBanner").style.display = "none";
}

function showTime() {
  const now = new Date();
  document.getElementById("timeDisplay").textContent = now.toLocaleTimeString();
}
setInterval(showTime, 1000);
showTime();

// SIMULATED FIREBASE DATA
let isCode9 = false;
const overlay = document.getElementById("baseAlertOverlay");
const firebaseStatus = document.getElementById("firebaseStatus");
const alertSound = document.getElementById("alertSound");

function toggleCode9(active) {
  isCode9 = active;
  overlay.style.display = isCode9 ? "flex" : "none";
  firebaseStatus.textContent = isCode9 ? "" : "Firebase Connected";

  if (isCode9 && soundEnabled) {
    alertSound.play().catch(() => {});
  } else {
    alertSound.pause();
    alertSound.currentTime = 0;
  }
}

// TEST toggle
setTimeout(() => toggleCode9(true), 3000);
setTimeout(() => toggleCode9(false), 10000);
