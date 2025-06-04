import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  onChildAdded,
  off,
  get
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

// Your Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyAn5rsOUfkKBYhpQb3qwdUTElJP8Kg0dW0",
  authDomain: "project-gdo.firebaseapp.com",
  databaseURL: "https://project-gdo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "project-gdo",
  storageBucket: "project-gdo.firebasestorage.app",
  messagingSenderId: "758705115255",
  appId: "1:758705115255:web:878f5e64c164b75c507672"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const loginUI = document.getElementById('loginUI');
const listenerUI = document.getElementById('listenerUI');
const googleSignInBtn = document.getElementById('googleSignIn');
const freqSelect = document.getElementById('frequencySelect');
const log = document.getElementById('log');
const logoutBtn = document.getElementById('logout');

const provider = new GoogleAuthProvider();

googleSignInBtn.addEventListener('click', () => {
  signInWithPopup(auth, provider).catch(console.error);
});

logoutBtn.addEventListener('click', () => {
  signOut(auth);
});

// Variable to hold the unsubscribe function for the current frequency listener
let currentListenerUnsubscribe = null;

function listenToFrequency(freq) {
  // Unsubscribe from old listener if exists
  if (currentListenerUnsubscribe) {
    currentListenerUnsubscribe();
    currentListenerUnsubscribe = null;
  }

  log.textContent = `Listening on frequency: ${freq}\n`;

  const signalsRef = ref(db, `frequencies/${freq}/signals`);

  // Listen for new signals
  currentListenerUnsubscribe = onChildAdded(signalsRef, async (snapshot) => {
    const data = snapshot.val();
    console.log("Received new signal data:", data);

    const code = data.decrypted || data.code || "UNKNOWN";

    // Fetch code info from 'codes' path
    const codeRef = ref(db, `codes/${code}`);
    const codeSnap = await get(codeRef);
    const codeInfo = codeSnap.exists() ? codeSnap.val() : null;

    let statusText = "";
    if (codeInfo) {
      if (codeInfo.valid === false) {
        statusText = "Received INVALID";
      } else if (codeInfo.access) {
        statusText = "Received and Verified";
      } else {
        statusText = "Received Unknown";
      }
    } else {
      statusText = "Received Unknown";
    }

    const owner = codeInfo?.owner || "UNKNOWN";

    const message = `!INCOMING TRAVELER!\nOwner: ${owner}\nCode: ${code}\nStatus: ${statusText}\n\n`;

    log.textContent = message + log.textContent;

    // Remove the signal after 15 seconds to auto-delete
    setTimeout(() => {
      const signalRef = ref(db, `frequencies/${freq}/signals/${snapshot.key}`);
      signalRef.remove().catch(console.error);
    }, 15000);
  });
}

freqSelect.addEventListener('change', () => {
  listenToFrequency(freqSelect.value);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginUI.style.display = 'none';
    listenerUI.style.display = 'block';
    listenToFrequency(freqSelect.value);
  } else {
    loginUI.style.display = 'block';
    listenerUI.style.display = 'none';

    if (currentListenerUnsubscribe) {
      currentListenerUnsubscribe();
      currentListenerUnsubscribe = null;
    }
    log.textContent = "";
  }
});
