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
const alertOverlay = document.getElementById('baseAlertOverlay');
const alertSound = document.getElementById('alertSound');
const firebaseStatus = document.getElementById('firebaseStatus');
const currentTime = document.getElementById('currentTime');
const incomingSound = document.getElementById('incomingSound');

googleSignInBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

logoutBtn.onclick = () => {
  auth.signOut();
};

let currentListener = null;

function updateTime() {
  const now = new Date();
  currentTime.textContent = now.toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

function triggerCode9Alert() {
  alertOverlay.style.display = "flex";
  alertSound.play().catch(() => {});
}

function stopCode9Alert() {
  alertOverlay.style.display = "none";
  alertSound.pause();
  alertSound.currentTime = 0;
}

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
    incomingSound.play().catch(() => {});

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

    log.textContent = `Code: ${code}
Owner: ${owner}
Status: ${result}`;

    if (code === "CODE9") triggerCode9Alert();

    setTimeout(() => {
      log.textContent = "";
      statusMessage.textContent = "Awaiting Signal...";
      statusMessage.classList.remove("blink");
      stopCode9Alert();
    }, 10000);

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

firebaseStatus.textContent = "✅ Firebase Connected!";