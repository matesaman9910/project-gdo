const firebaseConfig = {
  apiKey: "AIzaSyAn5rsOUfkKBYhpQb3qwdUTElJP8Kg0dW0",
  authDomain: "project-gdo.firebaseapp.com",
  databaseURL: "https://project-gdo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "project-gdo",
  storageBucket: "project-gdo.appspot.com",
  messagingSenderId: "758705115255",
  appId: "1:758705115255:web:878f5e64c164b75c507672"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

const loginUI = document.getElementById('loginUI');
const listenerUI = document.getElementById('listenerUI');
const googleSignInBtn = document.getElementById('googleSignIn');
const freqSelect = document.getElementById('frequencySelect');
const log = document.getElementById('log');
const statusMessage = document.getElementById('statusMessage');
const logoutBtn = document.getElementById('logout');

const sound = new Audio("https://file.garden/aACuwggY3QmuIi9B/Incoming%20traveller.mp3");

googleSignInBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

logoutBtn.onclick = () => {
  auth.signOut();
};

let currentListener = null;

function listenToFrequency(freq) {
  if (currentListener) {
    currentListener(); // Unsubscribe
    currentListener = null;
  }

  log.textContent = "";
  statusMessage.textContent = "Awaiting Signal...";
  statusMessage.classList.remove("blink");

  const signalsRef = db.ref(`frequencies/${freq}/signals`);

  currentListener = signalsRef.on("child_added", async (snapshot) => {
    const data = snapshot.val();
    const signalKey = snapshot.key;
    const code = data.decrypted || data.code || "UNKNOWN";

    statusMessage.textContent = "!INCOMING TRAVELER!";
    statusMessage.classList.add("blink");
    sound.play().catch(() => {}); // Just in case autoplay is blocked

    const codeRef = db.ref(`codes/${code}`);
    const codeSnap = await codeRef.get();
    const codeInfo = codeSnap.exists() ? codeSnap.val() : null;

    const isAuthorized = codeInfo?.access ?? false;
    const owner = codeInfo?.owner || "UNKNOWN";

    let result;
    if (isAuthorized) {
      result = "✔ Received and Verified";
    } else if (codeInfo) {
      result = "✖ Received INVALID";
    } else {
      result = "⚠ Received Unknown";
    }

    log.textContent = `Code: ${code}\nOwner: ${owner}\nStatus: ${result}`;

    // Auto reset message after 10s
    setTimeout(() => {
      log.textContent = "";
      statusMessage.textContent = "Awaiting Signal...";
      statusMessage.classList.remove("blink");
    }, 10000);

    // Delete signal after 15s
    setTimeout(() => {
      db.ref(`frequencies/${freq}/signals/${signalKey}`).remove();
    }, 15000);
  });
}

freqSelect.addEventListener('change', () => {
  listenToFrequency(freqSelect.value);
});

auth.onAuthStateChanged((user) => {
  if (user) {
    loginUI.style.display = 'none';
    listenerUI.style.display = 'block';
    listenToFrequency(freqSelect.value);
  } else {
    loginUI.style.display = 'block';
    listenerUI.style.display = 'none';
    if (currentListener) {
      currentListener();
      currentListener = null;
    }
  }
});


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

const overlay = document.getElementById("baseAlertOverlay");
const alertSound = document.getElementById("alertSound");
const statusText = document.getElementById("statusText");
const timeText = document.getElementById("timeText");

function updateTime() {
  const now = new Date();
  timeText.textContent = now.toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

try {
  const code9Ref = ref(db, "alerts/CODE9");
  onValue(code9Ref, (snapshot) => {
    const val = snapshot.val();
    if (val === true) {
      overlay.style.display = "flex";
      alertSound.play().catch(() => {});
    } else {
      overlay.style.display = "none";
      alertSound.pause();
      alertSound.currentTime = 0;
    }
    statusText.textContent = "Firebase Connected";
  }, () => {
    statusText.textContent = "Firebase ERROR";
  });
} catch {
  statusText.textContent = "Firebase ERROR";
}
