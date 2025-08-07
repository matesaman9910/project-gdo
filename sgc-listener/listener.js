import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getDatabase, ref, onChildAdded, remove, get, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

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
const auth = getAuth();
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");
const authSection = document.getElementById("authSection");
const mainInterface = document.getElementById("mainInterface");
const waitingEl = document.getElementById("waiting");
const incomingEl = document.getElementById("incoming");
const messageEl = document.getElementById("message");
const travelerSound = document.getElementById("travelerSound");
const frequencySelect = document.getElementById("frequencySelect");
const soundBanner = document.getElementById("soundBanner");
const bottomStatus = document.getElementById("bottomStatus");

let currentListener = null;
let displayTimeout = null;

function updateTimeAndStatus(firebaseStatus = "--") {
  const now = new Date();
  const time = now.toLocaleTimeString();
  bottomStatus.textContent = `Time: ${time} Firebase: ${firebaseStatus}`;
}

setInterval(() => updateTimeAndStatus(), 1000);

function clearMessage() {
  messageEl.textContent = "No signals received yet.";
  waitingEl.style.display = "block";
  incomingEl.style.display = "none";
}

function showMessage(text) {
  waitingEl.style.display = "none";
  incomingEl.style.display = "block";
  messageEl.textContent = text;

  if (displayTimeout) clearTimeout(displayTimeout);
  displayTimeout = setTimeout(() => {
    clearMessage();
    document.body.classList.remove("glow-green", "glow-orange", "glow-red");
    soundBanner.style.opacity = 0;
  }, 10000);
}

function triggerGlow(status) {
  document.body.classList.remove("glow-green", "glow-orange", "glow-red");

  if (status === "verified") {
    document.body.classList.add("glow-green");
    soundBanner.style.background = "#00ff00";
  } else if (status === "unknown") {
    document.body.classList.add("glow-orange");
    soundBanner.style.background = "#ffaa00";
  } else if (status === "invalid") {
    document.body.classList.add("glow-red");
    soundBanner.style.background = "#ff0000";
  }

  soundBanner.style.opacity = 1;
}

function listenToFrequency(freq) {
  if (currentListener && currentListener.off) currentListener.off();

  const signalsRef = ref(db, `frequencies/${freq}/signals`);
  currentListener = signalsRef;

  onChildAdded(signalsRef, async (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    travelerSound.pause();
    travelerSound.currentTime = 0;
    travelerSound.volume = 1.0;
    travelerSound.play().catch(() => {});

    const code = data.decrypted || data.code || "UNKNOWN";
    const codeRef = ref(db, `codes/${code}`);
    const snap = await get(codeRef);

    let statusText = "Received Unknown";
    let owner = "UNKNOWN";
    let statusClass = "unknown";

    if (snap.exists()) {
      const val = snap.val();
      owner = val.owner || "UNKNOWN";
      if (val.access === true) {
        statusText = "Received and Verified";
        statusClass = "verified";
      } else if (val.access === false) {
        statusText = "Received INVALID";
        statusClass = "invalid";
      }
    }

    showMessage(`Owner: ${owner}\nCode: ${code}\nStatus: ${statusText}`);
    triggerGlow(statusClass);

    setTimeout(() => {
      remove(snapshot.ref).catch(console.error);
    }, 15000);
  });

  clearMessage();
}

// CODE9 listener
const code9Ref = ref(db, "alerts/CODE9");
onValue(code9Ref, (snapshot) => {
  const code9Status = snapshot.val();
  if (code9Status === true) {
    triggerGlow("invalid"); // red glow for code9
    showMessage("⚠ CODE9 ACTIVE!");
  }
  updateTimeAndStatus("Connected");
}, (error) => {
  console.error("Firebase Error:", error);
  updateTimeAndStatus("Error");
});

signInBtn.onclick = () => signInWithPopup(auth, provider).catch(console.error);
signOutBtn.onclick = () => signOut(auth).catch(console.error);
frequencySelect.onchange = () => listenToFrequency(frequencySelect.value);

onAuthStateChanged(auth, (user) => {
  if (user) {
    authSection.style.display = "none";
    mainInterface.style.display = "block";
    listenToFrequency(frequencySelect.value);
  } else {
    authSection.style.display = "block";
    mainInterface.style.display = "none";
    if (currentListener && currentListener.off) currentListener.off();
  }
});
