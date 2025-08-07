// Firebase v9 - No modules/imports, directly used via global window.firebase object

const firebaseConfig = {
  apiKey: "AIzaSyAn5rsOUfkKBYhpQb3qwdUTElJP8Kg0dW0",
  authDomain: "project-gdo.firebaseapp.com",
  databaseURL: "https://project-gdo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "project-gdo",
  storageBucket: "project-gdo.firebasestorage.app",
  messagingSenderId: "758705115255",
  appId: "1:758705115255:web:878f5e64c164b75c507672"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// UI references
const loginUI = document.getElementById("loginUI");
const listenerUI = document.getElementById("listenerUI");
const signInButton = document.getElementById("googleSignIn");
const statusMessage = document.getElementById("statusMessage");
const logElement = document.getElementById("log");
const frequencySelect = document.getElementById("frequencySelect");
const alertOverlay = document.getElementById("baseAlertOverlay");
const soundBanner = document.getElementById("soundBanner");
const alertSound = document.getElementById("alertSound");
const timeDisplay = document.getElementById("timeDisplay");
const firebaseStatus = document.getElementById("firebaseStatus");

// Sign in with Google
signInButton.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(console.error);
};

// On auth state changed
auth.onAuthStateChanged((user) => {
  if (user) {
    loginUI.style.display = "none";
    listenerUI.style.display = "flex";
    firebaseStatus.textContent = "Firebase: Connected";

    startListening();
  } else {
    loginUI.style.display = "flex";
    listenerUI.style.display = "none";
    firebaseStatus.textContent = "Firebase: Disconnected";
  }
});

// Listen to selected frequency
function startListening() {
  const frequency = frequencySelect.value;
  const ref = db.ref(`frequencies/${frequency}`);

  ref.on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) {
      logElement.textContent = data.message || "Signal received.";
      statusMessage.textContent = "Incoming Signal...";
      triggerVisualAlert();
    }
  });

  frequencySelect.onchange = () => {
    ref.off(); // stop old listener
    startListening(); // start new one
  };
}

// Visual FX
function triggerVisualAlert() {
  alertOverlay.style.display = "flex";
  soundBanner.style.display = "block";
  alertSound.play().catch(() => {});

  setTimeout(() => {
    alertOverlay.style.display = "none";
    soundBanner.style.display = "none";
  }, 3000);
}

// Clock
setInterval(() => {
  const now = new Date().toLocaleTimeString();
  timeDisplay.textContent = `Time: ${now}`;
}, 1000);
