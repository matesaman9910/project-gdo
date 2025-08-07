firebase.initializeApp({
  apiKey: "AIzaSyAn5rsOUfkKBYhpQb3qwdUTElJP8Kg0dW0",
  authDomain: "project-gdo.firebaseapp.com",
  databaseURL: "https://project-gdo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "project-gdo",
  storageBucket: "project-gdo.appspot.com",
  messagingSenderId: "758705115255",
  appId: "1:758705115255:web:878f5e64c164b75c507672"
});

const auth = firebase.auth();
const db = firebase.database();

const loginUI = document.getElementById('loginUI');
const listenerUI = document.getElementById('listenerUI');
const googleSignIn = document.getElementById('googleSignIn');
const freqSelect = document.getElementById('frequencySelect');
const log = document.getElementById('log');
const statusMessage = document.getElementById('statusMessage');
const overlay = document.getElementById('baseAlertOverlay');
const alertSound = document.getElementById('alertSound');
const firebaseStatus = document.getElementById('firebaseStatus');
const timeDisplay = document.getElementById('timeDisplay');
const soundBanner = document.getElementById('soundBanner');

const travellerSound = new Audio("https://file.garden/aACuwggY3QmuIi9B/Incoming traveller.mp3");

let listener = null;

function updateTime() {
  const now = new Date();
  timeDisplay.textContent = `Time: ${now.toLocaleTimeString()}`;
}
setInterval(updateTime, 1000);

function listenToFrequency(freq) {
  if (listener) firebase.database().ref(`frequencies/${freq}/signals`).off('child_added', listener);
  log.textContent = "";
  statusMessage.textContent = "Awaiting Signal...";
  firebaseStatus.textContent = `Listening to: ${freq}`;

  const refFreq = db.ref(`frequencies/${freq}/signals`);
  listener = refFreq.on('child_added', snap => {
    const data = snap.val();
    const code = data.decrypted || data.code || "UNKNOWN";
    travellerSound.play().catch(() => {});
    soundBanner.style.display = "block";
    setTimeout(() => soundBanner.style.display = "none", 1000);

    db.ref(`codes/${code}`).once('value').then(codeSnap => {
      let owner = "UNKNOWN", status = "unknown", txt = "Received Unknown";
      if (codeSnap.exists()) {
        const val = codeSnap.val();
        owner = val.owner || "UNKNOWN";
        if (val.access === true) {
          status = "verified";
          txt = "Received and Verified";
        } else {
          status = "invalid";
          txt = "Received INVALID";
        }
      }
      log.textContent = `Code: ${code}\nOwner: ${owner}\nStatus: ${txt}`;
    });
  });
}

function listenForBaseAlert() {
  db.ref("alerts/CODE 9").on('value', snap => {
    if (snap.val() === true) {
      overlay.style.display = "flex";
      alertSound.currentTime = 0;
      alertSound.play().catch(() => {});
    } else {
      overlay.style.display = "none";
      alertSound.pause();
    }
  });
}

auth.onAuthStateChanged(user => {
  if (user) {
    loginUI.style.display = "none";
    listenerUI.style.display = null;
    listenToFrequency(freqSelect.value);
    listenForBaseAlert();
  } else {
    loginUI.style.display = null;
    listenerUI.style.display = "none";
    overlay.style.display = "none";
    alertSound.pause();
    firebaseStatus.textContent = "Firebase: Not connected";
  }
});

googleSignIn.onclick = () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
freqSelect.onchange = () => listenToFrequency(freqSelect.value);
