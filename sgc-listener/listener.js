// listener.js - for use with listener.html

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  onChildAdded,
  get,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

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
const provider = new GoogleAuthProvider();

const loginUI = document.getElementById('loginUI');
const listenerUI = document.getElementById('listenerUI');
const googleSignInBtn = document.getElementById('googleSignIn');
const logoutBtn = document.getElementById('logoutBtn');
const freqSelect = document.getElementById('frequencySelect');
const log = document.getElementById('log');

let currentListener = null;

googleSignInBtn.addEventListener('click', () => {
  signInWithPopup(auth, provider).catch(console.error);
});

logoutBtn.addEventListener('click', () => {
  signOut(auth).catch(console.error);
});

function listenToFrequency(freq) {
  if (currentListener) {
    currentListener();
    currentListener = null;
  }

  log.textContent = `Monitoring ${freq}...\n`;

  const signalsRef = ref(db, `frequencies/${freq}/signals`);
  currentListener = onChildAdded(signalsRef, async (snapshot) => {
    const data = snapshot.val();
    const code = data.decrypted || data.code || "UNKNOWN";

    log.textContent = `\n!INCOMING TRAVELER!\nReceiving...\n`;
    await new Promise(res => setTimeout(res, 1000));
    log.textContent += `Decrypting...\n`;
    await new Promise(res => setTimeout(res, 1000));

    const codeRef = ref(db, `codes/${code}`);
    const codeSnap = await get(codeRef);
    const codeInfo = codeSnap.exists() ? codeSnap.val() : null;

    const isValid = codeInfo?.access ?? false;
    const owner = codeInfo?.owner || "UNKNOWN";

    const statusText = isValid ? "✔ RECEIVED AND VERIFIED" : (codeInfo ? "✖ RECEIVED UNKNOWN" : "✖ RECEIVED INVALID");

    log.textContent += `\nSTATUS: ${statusText}\nOwner: ${owner}\nCode: ${code}\nVALID: ${isValid ? "✔" : "✖ INVALID"}\n`;

    if (!isValid) {
      document.body.classList.add('alert');
      setTimeout(() => document.body.classList.remove('alert'), 3000);
    }
  });
}

freqSelect.addEventListener('change', () => {
  listenToFrequency(freqSelect.value);
});

onAuthStateChanged(auth, user => {
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
