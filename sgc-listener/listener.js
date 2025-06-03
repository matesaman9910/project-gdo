import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, onChildAdded, get, remove } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Firebase config (same as transmitter)
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

const frequencySelect = document.getElementById("frequencySelect");
const log = document.getElementById("log");

// Optional: Google Sign-in (if you want auth)
// const provider = new GoogleAuthProvider();
// signInWithPopup(auth, provider).catch(console.error);

// Clear log and unsubscribe from old listener when frequency changes
let unsubscribe = null;

function listenToFrequency(freq) {
  if (unsubscribe) {
    unsubscribe();
  }
  log.textContent = "Waiting for signals...";

  const signalsRef = ref(db, `frequencies/${freq}/signals`);

  // Listen for new signals
  const listener = onChildAdded(signalsRef, async (snapshot) => {
    const key = snapshot.key;
    const data = snapshot.val();
    const code = data.decrypted || data.code || "UNKNOWN";

    // Fetch code info from database
    const codeRef = ref(db, `codes/${code}`);
    const codeSnap = await get(codeRef);
    const codeInfo = codeSnap.exists() ? codeSnap.val() : null;

    let statusText = "Unrecognized Code!";
    let statusClass = "invalid";
    let ownerText = "UNKNOWN";

    if (codeInfo) {
      ownerText = codeInfo.owner || "UNKNOWN";
      if (codeInfo.access === true) {
        statusText = "✔ Verified";
        statusClass = "";
      } else if (codeInfo.access === false) {
        statusText = "❌ Invalidated";
        statusClass = "invalid";
      }
    }

    // Show only one code at a time:
    log.innerHTML = `
      <strong>Code:</strong> ${code}<br />
      <strong>Owner:</strong> ${ownerText}<br />
      <strong>Status:</strong> <span class="${statusClass}">${statusText}</span>
    `;

    // Remove the code from DB after 15 seconds and clear view
    setTimeout(async () => {
      log.textContent = "Waiting for signals...";
      // Remove from firebase
      await remove(ref(db, `frequencies/${freq}/signals/${key}`));
    }, 15000);
  });

  // Return unsubscribe function
  unsubscribe = () => {
    signalsRef.off('child_added', listener);
  };
}

frequencySelect.addEventListener("change", () => {
  listenToFrequency(frequencySelect.value);
});

// Start listening on page load
listenToFrequency(frequencySelect.value);
