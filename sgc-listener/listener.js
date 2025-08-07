let audioEnabled = false;
let isCode9 = false;

function enableAudio() {
  document.getElementById('soundBanner').style.display = 'none';
  audioEnabled = true;
}

function playSound(id) {
  if (audioEnabled) {
    const audio = document.getElementById(id);
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  }
}

function signOut() {
  playSound('uiClick');
}

function triggerCode9(state) {
  const overlay = document.getElementById('baseAlertOverlay');
  const bottomBar = document.getElementById('bottomBar');
  overlay.style.display = state ? 'flex' : 'none';
  bottomBar.style.display = state ? 'none' : 'block';
}

// Fake Firebase signal listener
setTimeout(() => {
  // Trigger Code 9 alert (demo)
  triggerCode9(true);
  playSound('alertSound');
}, 4000);

setTimeout(() => {
  // End Code 9 alert (demo)
  triggerCode9(false);
}, 10000);

setInterval(() => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString();
  document.getElementById('bottomBar').textContent = "Firebase Connected | " + timeStr;
}, 1000);