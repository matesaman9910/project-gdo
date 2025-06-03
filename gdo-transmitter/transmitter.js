import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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

window.addEventListener('DOMContentLoaded', () => {
  const codeInput = document.getElementById("codeInput");
  const frequencySelect = document.getElementById("frequencySelect");
  const transmitBtn = document.getElementById("transmitBtn");
  const status = document.getElementById("status");

  let cooldown = false;

  transmitBtn.addEventListener("click", async () => {
    if (cooldown) return;

    const code = codeInput.value.trim();

    // Validate 9-digit numeric code
    if (!/^\d{9}$/.test(code)) {
      status.innerText = "⚠️ Please enter a 9-digit numeric code.";
      return;
    }

    const frequency = frequencySelect.value;

    cooldown = true;
    transmitBtn.disabled = true;
    status.innerText = "Encrypting...";

    // Simulate encryption delay
    await new Promise(res => setTimeout(res, 1500));

    const encrypted = btoa(code); // fake base64 encryption
    const signalRef = ref(db, `frequencies/${frequency}/signals`);

    try {
      await push(signalRef, {
        code: code,
        encrypted: encrypted,
        decrypted: code,
        timestamp: serverTimestamp()
      });

      status.innerText = "✅ Signal transmitted!";
      codeInput.value = ""; // Clear input after transmit
    } catch (error) {
      status.innerText = "❌ Failed to transmit signal.";
      console.error(error);
    }

    setTimeout(() => {
      status.innerText = "";
      cooldown = false;
      transmitBtn.disabled = false;
    }, 10000); // 10-second cooldown
  });
});
