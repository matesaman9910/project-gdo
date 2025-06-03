import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase config — replace with your own
const firebaseConfig = {
  apiKey: "AIzaSyAn5rsOUfkKBYhpQb3qwdUTElJP8Kg0dW0",
  authDomain: "project-gdo.firebaseapp.com",
  databaseURL: "https://project-gdo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "project-gdo",
  storageBucket: "project-gdo.firebasestorage.app",
  messagingSenderId: "758705115255",
  appId: "1:758705115255:web:878f5e64c164b75c507672"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Add logout button event
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log("Logged out");
      window.location.reload();
    })
    .catch(err => console.error("Logout error", err));
});

// Listen to auth state
onAuthStateChanged(auth, user => {
  if (user) {
    console.log("Logged in as:", user.email || user.uid);

    // Reference to signal in DB (change path if needed)
    const signalRef = ref(db, 'signal');

    onValue(signalRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        console.log("Signal received:", data);
        // Update your UI, for example:
        document.getElementById('signalDisplay').textContent = data;
      } else {
        console.log("No signal yet.");
        document.getElementById('signalDisplay').textContent = "No signal received.";
      }
    });

  } else {
    console.log("User not logged in, redirecting to login page.");
    window.location.href = "login.html";  // your login page here
  }
});
