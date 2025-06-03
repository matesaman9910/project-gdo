import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

// (rest of your code unchanged)

// Firebase config
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
const db = getDatabase(app);

const codeInput = document.getElementById("codeInput");
const frequencySelect = document.getElementById("frequencySelect");
const transmitBtn = document.getElementById("transmitBtn");
const status = document.getElementById("status");

let cooldown = false;

transmitBtn.addEventListener("click", async () => {
  if (cooldown) return;

  const code = codeInput.value.trim();
  const frequency = frequencySelect.value;

  if (!code) {
    status.innerText = "⚠️ Enter a code.";
    return;
  }

  cooldown = true;
  transmitBtn.disabled = true;
  status.innerText = "Encrypting...";

  // Simulated encryption effect
  await new Promise(res => setTimeout(res, 1500));

  const encrypted = btoa(code); // Base64 fake encryption
  const signalRef = ref(db, `frequencies/${frequency}/signals`);

  push(signalRef, {
    code: code,
    encrypted: encrypted,
    decrypted: code,
    timestamp: serverTimestamp()
  });

  status.innerText = "✅ Signal transmitted!";
  setTimeout(() => {
    status.innerText = "";
    cooldown = false;
    transmitBtn.disabled = false;
  }, 10000); // 10-second cooldown
});
