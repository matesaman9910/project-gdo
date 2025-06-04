// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAn5rsOUfkKBYhpQb3qwdUTElJP8Kg0dW0",
  authDomain: "project-gdo.firebaseapp.com",
  databaseURL: "https://project-gdo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "project-gdo",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function transmit() {
  const codeInput = document.getElementById('codeInput');
  const freqSelect = document.getElementById('freqSelect');
  const status = document.getElementById('status');

  const code = codeInput.value.trim();
  const freq = freqSelect.value;

  if (!code) {
    status.textContent = "Please enter a code.";
    return;
  }

  // Push signal to database
  const signalRef = db.ref(`frequencies/${freq}/signals`).push();
  signalRef.set({ code });

  status.textContent = "Encrypting...";

  setTimeout(() => {
    status.textContent = "Transmitting...";
    setTimeout(() => {
      status.textContent = "Transmitted!";
    }, 1000);
  }, 1000);
}
