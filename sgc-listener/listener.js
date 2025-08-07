
let soundEnabled = false;

function enableSound() {
  soundEnabled = true;
  document.getElementById("soundWarning").style.display = "none";
  document.getElementById("bubbleSound").play();
}

function signOut() {
  alert("Signed out.");
}

function triggerCode9() {
  const overlay = document.getElementById("baseAlertOverlay");
  overlay.classList.remove("hidden");

  document.getElementById("alertSound").play();
  document.getElementById("statusBar").classList.add("hidden");
}

function endCode9() {
  document.getElementById("baseAlertOverlay").classList.add("hidden");
  document.getElementById("alertSound").pause();
  document.getElementById("statusBar").classList.remove("hidden");
}

setInterval(() => {
  const now = new Date();
  const timeString = now.toTimeString().split(" ")[0];
  document.getElementById("clock").innerText = timeString;
}, 1000);

document.getElementById("baseCode9Trigger").onclick = () => {
  if (!soundEnabled) enableSound();
  triggerCode9();
  setTimeout(endCode9, 10000);
};
