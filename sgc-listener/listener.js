firebase.initializeApp({
  apiKey: "AIzaSyAn5rsOUfkKBYhpQb3qwdUTElJP8Kg0dW0",
  authDomain: "project-gdo.firebaseapp.com",
  databaseURL: "https://project-gdo.firebaseio.com",
  projectId: "project-gdo",
  storageBucket: "project-gdo.firebasestorage.app",
  messagingSenderId: "758705115255",
  appId: "1:758705115255:web:878f5e64c164b75c507672"
});

const auth = firebase.auth();
const db = firebase.database();

const loginUI = document.getElementById('loginUI');
const listenerUI = document.getElementById('listenerUI');
const googleSignIn = document.getElementById('googleSignIn');
const freqSelect = document.getElementById('frequencySelect');
const log = document.getElementById('log');
const statusMessage = document.getElementById('statusMessage');
const overlay = document.getElementById('baseAlertOverlay');
const alertSound = document.getElementById('alertSound');
const travellerSound = new Audio("https://file.garden/aACuwggY3QmuIi9B/Incoming traveller.mp3");

let listener = null;

function listenToFrequency(freq){
  if(listener) listener.off?.(); // For safety
  log.textContent = "";
  statusMessage.textContent = "Awaiting Signal...";

  const refFreq = db.ref(`frequencies/${freq}/signals`);
  listener = refFreq.on('child_added', snap => {
    const data = snap.val();
    const code = data.decrypted || data.code || "UNKNOWN";

    travellerSound.play().catch(() => {});

    db.ref(`codes/${code}`).once('value').then(codeSnap => {
      let owner = "UNKNOWN", status = "unknown", txt = "Received Unknown";

      if(codeSnap.exists()){
        const val = codeSnap.val();
        owner = val.owner || "UNKNOWN";
        if(val.access === true){
          status = "verified";
          txt = "Received and Verified";
        } else {
          status = "invalid";
          txt = "Received INVALID";
        }
      }

      log.textContent = `Code: ${code}\nOwner: ${owner}\nStatus: ${txt}`;
    });
  });
}

function listenForBaseAlert(){
  const alertRef = db.ref("alerts/CODE9"); // 🔥 FIXED: Removed the space
  alertRef.on('value', snap => {
    const isActive = snap.val();
    console.log("CODE 9 State:", isActive); // ✅ DEBUG LINE

    if(isActive === true){
      overlay.style.display = "flex";
      alertSound.currentTime = 0;
      alertSound.play().catch(() => {});
    } else {
      overlay.style.display = "none";
      alertSound.pause();
    }
  });
}

auth.onAuthStateChanged(user => {
  if(user){
    loginUI.style.display = "none";
    listenerUI.style.display = "flex";
    listenToFrequency(freqSelect.value);
    listenForBaseAlert();
  } else {
    loginUI.style.display = "flex";
    listenerUI.style.display = "none";
    overlay.style.display = "none";
    alertSound.pause();
  }
});

googleSignIn.onclick = () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
freqSelect.onchange = () => listenToFrequency(freqSelect.value);
