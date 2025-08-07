
let firebaseConnected = true;
let code9Active = false;
const alertOverlay = document.getElementById('baseAlertOverlay');
const firebaseStatus = document.getElementById('firebaseStatus');
const clock = document.getElementById('clock');
const soundBanner = document.getElementById('soundBanner');
const enableSoundBtn = document.getElementById('enableSound');
const alertSound = document.getElementById('alertSound');
const clickSound = document.getElementById('clickSound');

enableSoundBtn.addEventListener('click', () => {
  alertSound.play().catch(()=>{});
  clickSound.play().catch(()=>{});
  soundBanner.style.display = 'none';
});

document.getElementById('signOut').addEventListener('click', () => {
  clickSound.play();
});

function updateTime() {
  const now = new Date();
  clock.textContent = now.toTimeString().split(' ')[0];
}
setInterval(updateTime, 1000);

function toggleCode9(active) {
  code9Active = active;
  if (active) {
    alertOverlay.style.display = 'flex';
    document.getElementById('bottomStatus').style.display = 'none';
    alertSound.loop = true;
    alertSound.play();
  } else {
    alertOverlay.style.display = 'none';
    document.getElementById('bottomStatus').style.display = 'block';
    alertSound.pause();
    alertSound.currentTime = 0;
  }
}

// Simulated CODE 9 activation after 10s (for testing)
setTimeout(() => toggleCode9(true), 10000);
setTimeout(() => toggleCode9(false), 20000);
