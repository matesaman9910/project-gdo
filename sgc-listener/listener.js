// Firebase setup
const firebaseConfig = {
  // Replace with your actual config
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Time display
function updateTime() {
  const clock = document.getElementById("clock");
  const now = new Date();
  clock.textContent = now.toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

// Sound handling
let soundEnabled = false;
const clickSound = document.getElementById("clickSound");
document.getElementById("enableSound").onclick = () => {
  clickSound.play();
  soundEnabled = true;
  document.getElementById("soundBanner").style.display = "none";
};

document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    if (soundEnabled) clickSound.play();
  });
});

// Simulate CODE 9
let code9Active = false;

function toggleCode9(active) {
  const overlay = document.getElementById("baseAlertOverlay");
  const statusBar = document.getElementById("statusBar");

  code9Active = active;
  overlay.classList.toggle("hidden", !active);
  statusBar.style.display = active ? "none" : "block";
}

// Simulated listener
setTimeout(() => {
  toggleCode9(true);
  setTimeout(() => toggleCode9(false), 8000);
}, 3000);
