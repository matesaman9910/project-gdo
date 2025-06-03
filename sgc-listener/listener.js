// listener.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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
const database = getDatabase(app);

// Elements
const signalDisplay = document.getElementById("signalDisplay");
const logoutBtn = document.getElementById("logoutBtn");

// Auth state observer
onAuthStateChanged(auth, user => {
  if (user) {
    // User logged in, start listening to signals
    listenForSignals(user.uid);
    logoutBtn.style.display = "inline-block";
  } else {
    // User not logged in, redirect or show message
    signalDisplay.textContent = "Please log in to receive signals.";
    logoutBtn.style.display = "none";
  }
});

// Listen to signal changes from Firebase Realtime Database
function listenForSignals(userId) {
  // Adjust the path as needed, e.g. 'signals/alpha-1' or 'signals/bravo-2'
  const signalRef = ref(database, "signals");

  onValue(signalRef, snapshot => {
    const data = snapshot.val();
    if (!data) {
      signalDisplay.textContent = "No signals received.";
      return;
    }

    // Show one signal at a time, you can customize how you pick which one
    // Here, just show first non-null signal found
    let displayed = false;
    for (const freq of ["alpha-1", "bravo-2"]) {
      if (data[freq]) {
        signalDisplay.textContent = `Signal on ${freq}: ${data[freq]}`;
        displayed = true;
        break;
      }
    }
    if (!displayed) {
      signalDisplay.textContent = "No active signals.";
    }
  });
}

// Logout button handler
logoutBtn.addEventListener("click", () => {
  signOut(auth).catch(err => {
    console.error("Logout error:", err);
  });
});
