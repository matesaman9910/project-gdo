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

const freqSelect = document.getElementById('frequencySelect');
const logDiv = document.getElementById('log');
let currentListener = null;

function logMessage(message, isAlert = false) {
  if (isAlert) {
    document.body.classList.add('alert');
    setTimeout(() => document.body.classList.remove('alert'), 3000);
  }
  logDiv.textContent = `!INCOMING TRAVELER!\nDecrypting...\n\n${message}\n\n` + logDiv.textContent;
}

function startListening(freq) {
  if (currentListener) {
    currentListener.off();
  }

  const signalRef = db.ref(`frequencies/${freq}/signals`);
  signalRef.off(); // remove old listeners

  signalRef.on('child_added', async (snapshot) => {
    const data = snapshot.val();
    const code = data.code || "UNKNOWN";

    const codeRef = db.ref(`codes/${code}`);
    const codeSnap = await codeRef.get();

    let owner = "UNKNOWN";
    let status = "Received Unknown";

    if (codeSnap.exists()) {
      const codeData = codeSnap.val();
      owner = codeData.owner || "UNKNOWN";
      if (codeData.valid === false) {
        status = "❌ Received INVALID";
        logMessage(`Owner: ${owner}\nCode: ${code}\nStatus: ${status}`, true);
      } else {
        status = "✅ Received and Verified";
        logMessage(`Owner: ${owner}\nCode: ${code}\nStatus: ${status}`);
      }
    } else {
      logMessage(`Owner: UNKNOWN\nCode: ${code}\nStatus: ❓ Received Unknown`);
    }

    // Delete signal after 15 seconds
    setTimeout(() => {
      db.ref(`frequencies/${freq}/signals/${snapshot.key}`).remove();
    }, 15000);
  });

  currentListener = signalRef;
}

freqSelect.addEventListener('change', () => {
  startListening(freqSelect.value);
});

// Start listening on page load with default frequency
startListening(freqSelect.value);
