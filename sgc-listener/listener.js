
let soundEnabled = false;
const alertSound = document.getElementById("alertSound");
const soundBanner = document.getElementById("soundBanner");
const baseAlert = document.getElementById("baseAlertOverlay");
const infoBar = document.getElementById("infoBar");
const firebaseStatus = document.getElementById("firebaseStatus");
const currentTime = document.getElementById("currentTime");
const signalContent = document.getElementById("signalContent");

function enableSound() {
  soundEnabled = true;
  soundBanner.style.display = "none";
}

// Demo simulation
function triggerCode9(active) {
  if (active) {
    baseAlert.style.display = "block";
    infoBar.style.display = "none";
    signalContent.textContent = "CODE 9 DETECTED";
    if (soundEnabled) alertSound.play().catch(() => {});
  } else {
    baseAlert.style.display = "none";
    infoBar.style.display = "flex";
    signalContent.textContent = "Awaiting signal...";
  }
}

// Simulate Firebase signal every 10s (alternating true/false)
let toggle = false;
setInterval(() => {
  toggle = !toggle;
  triggerCode9(toggle);
}, 10000);

// Show current time
setInterval(() => {
  const now = new Date();
  currentTime.textContent = now.toLocaleTimeString();
  firebaseStatus.textContent = "CONNECTED";
}, 1000);
