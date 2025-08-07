
let soundEnabled = false;
function enableSound() {
  document.getElementById("alertSound").play().catch(() => {});
  document.getElementById("soundWarning").style.display = "none";
  soundEnabled = true;
}

function simulateSignal() {
  const isCode9 = Math.random() > 0.5;
  const signalContent = document.getElementById("signalContent");
  const overlay = document.getElementById("baseAlertOverlay");
  const connectionStatus = document.getElementById("connectionStatus");

  if (isCode9) {
    signalContent.innerText = "CODE 9 SIGNAL RECEIVED.";
    overlay.style.display = "block";
    connectionStatus.style.display = "none";
    if (soundEnabled) document.getElementById("alertSound").play();
  } else {
    signalContent.innerText = "Standard signal received. No action.";
    overlay.style.display = "none";
    connectionStatus.style.display = "block";
  }
}

// Simulate Firebase signal every 8 seconds
setInterval(simulateSignal, 8000);
