// gdo.js - GDO Transmitter Script

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
import { getDatabase, ref, push } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js';

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
const gdoUI = document.getElementById('gdoUI');
const googleSignInBtn = document.getElementById('googleSignIn');
const sendBtn = document.getElementById('sendBtn');
const codeInput = document.getElementById('codeInput');
const frequencySelect = document.getElementById('frequencySelect');
const display = document.getElementById('display');

let currentUser = null;

function displayMessage(lines, delay = 1000) {
  display.textContent = '';
  lines.reduce((promise, line) => {
    return promise.then(() => {
      display.textContent += line + '\n';
      return new Promise(resolve => setTimeout(resolve, delay));
    });
  }, Promise.resolve());
}

sendBtn.addEventListener('click', async () => {
  const code = codeInput.value.trim();
  const frequency = frequencySelect.value;

  if (!code) {
    alert('Please enter a code.');
    return;
  }

  displayMessage([
    '!INCOMING TRAVELER!',
    'Encrypting...',
    'Transmitting...',
    'Transmitted.'
  ]);

  await push(ref(db, `frequencies/${frequency}/signals`), {
    code,
    timestamp: Date.now()
  });
});

googleSignInBtn.addEventListener('click', () => {
  signInWithPopup(auth, provider).catch(console.error);
});

onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    loginUI.style.display = 'none';
    gdoUI.style.display = 'block';
  } else {
    currentUser = null;
    loginUI.style.display = 'block';
    gdoUI.style.display = 'none';
  }
});
