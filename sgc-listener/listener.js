
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB-AQIjLa_d0H9-DLHHt2jpkJAvlL2BdU0",
  authDomain: "project-gdo-default-rtdb.firebaseapp.com",
  databaseURL: "https://project-gdo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "project-gdo-default-rtdb",
  storageBucket: "project-gdo-default-rtdb.appspot.com",
  messagingSenderId: "726167273207",
  appId: "1:726167273207:web:68032808b1a5b5735c51bc"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const statusText = document.getElementById("statusText");
const timeText = document.getElementById("timeText");
const alertOverlay = document.getElementById("baseAlertOverlay");
const alertSound = document.getElementById("alertSound");

function updateTime() {
  const now = new Date();
  timeText.textContent = now.toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

const statusRef = ref(db, "alerts/CODE9");
onValue(statusRef, (snapshot) => {
  const isCode9 = snapshot.val();
  if (isCode9 === true) {
    alertOverlay.style.display = "flex";
    alertSound.play().catch(() => {});
    statusText.textContent = "Firebase Connected | ALERT: CODE 9";
  } else {
    alertOverlay.style.display = "none";
    alertSound.pause();
    alertSound.currentTime = 0;
    statusText.textContent = "Firebase Connected | Status: Normal";
  }
}, {
  onlyOnce: false
});
