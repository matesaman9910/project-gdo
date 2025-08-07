// listener.js (Firebase v9)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getDatabase, ref, onChildAdded, onValue, get } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyAn5rsOUfkKBYhpQb3qwdUTElJP8Kg0dW0",
  authDomain: "project-gdo.firebaseapp.com",
  databaseURL: "https://project-gdo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "project-gdo",
  storageBucket: "project-gdo.appspot.com",
  messagingSenderId: "758705115255",
  appId: "1:758705115255:web:878f5e64c164b75c507672"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const loginUI = document.getElementById('loginUI');
const listenerUI = document.getElementById('listenerUI');
const googleSignIn = document.getElementById('googleSignIn');
const freqSelect = document.getElementById('frequencySelect');
const log = document.getElementById('log');
const statusMessage = document.getElementById('statusMessage');
const overlay = document.getElementById('baseAlertOverlay');
const alertSound = document.getElementById('alertSound');
const travellerSound = new Audio("https://file.garden/aACuwggY3QmuIi9B/Incoming traveller.mp3");

let listenerUnsub = null;

function listenToFrequency(freq) {
  if (listenerUnsub) listenerUnsub(); // unsubscribe previous
  log.textContent = "";
  statusMessage.textContent = "Awaiting Signal...";
  const refFreq = ref(db, `frequencies/${freq}/signals`);

  listenerUnsub = onChildAdded(refFreq, async (snapshot) => {
    const data = snapshot.val();
    const code = data.decrypted || data.code || "UNKNOWN";
    try {
      await travellerSound.play();
    } catch (e) {}

    const codeSnap = await get(ref(db, `codes/${code}`));
    let owner = "UNKNOWN", status = "unknown", txt = "Received Unknown";

    if (codeSnap.exists()) {
      const val = codeSnap.val();
      owner = val.owner || "UNKNOWN";
      if (val.access === true) {
        status = "verified"; txt = "Received and Verified";
      } else {
        status = "invalid"; txt = "Received INVALID";
      }
    }

    log.textContent = `Code: ${code}\nOwner: ${owner}\nStatus: ${txt}`;
  });
}

function listenForBaseAlert() {
  const alertRef = ref(db, "alerts/CODE 9");
  onValue(alertRef, snapshot => {
    if (snapshot.val() === true) {
      overlay.style.display = "flex";
      alertSound.currentTime = 0;
      alertSound.play().catch(() => {});
    } else {
      overlay.style.display = "none";
      alertSound.pause();
    }
  });
}

onAuthStateChanged(auth, user => {
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
  }
});

googleSignIn.onclick = () => signInWithPopup(auth, new GoogleAuthProvider());
freqSelect.onchange = () => listenToFrequency(freqSelect.value);
