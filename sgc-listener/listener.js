firebase.initializeApp({
  apiKey:"...", authDomain:"...", databaseURL:"...", projectId:"...", storageBucket:"...", messagingSenderId:"...", appId:"..."
});
const auth = firebase.auth(), db = firebase.database();

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
  if(listener) listener.off();
  log.textContent=""; statusMessage.textContent="Awaiting Signal...";
  const refFreq = db.ref(`frequencies/${freq}/signals`);
  listener = refFreq.on('child_added', snap=>{
    const data = snap.val();
    const code = data.decrypted || data.code || "UNKNOWN";
    travellerSound.play().catch(()=>{});
    db.ref(`codes/${code}`).once('value').then(codeSnap=>{
      let owner="UNKNOWN", status="unknown";
      let txt = "Received Unknown";
      if(codeSnap.exists()){
        const val=codeSnap.val();
        owner = val.owner || "UNKNOWN";
        if(val.access===true){
          status="verified"; txt="Received and Verified";
        } else {
          status="invalid"; txt="Received INVALID";
        }
      }
      log.textContent=`Code: ${code}\nOwner: ${owner}\nStatus: ${txt}`;
    });
  });
}

function listenForBaseAlert(){
  db.ref("alerts/CODE 9").on('value', snap=>{
    if(snap.val()===true){
      overlay.style.display="flex";
      alertSound.currentTime = 0;
      alertSound.play().catch(()=>{});
    } else {
      overlay.style.display="none";
      alertSound.pause();
    }
  });
}

auth.onAuthStateChanged(user=>{
  if(user){
    loginUI.style.display=null;
    listenerUI.style.display=null;
    listenToFrequency(freqSelect.value);
    listenForBaseAlert();
  } else {
    loginUI.style.display=null;
    listenerUI.style.display='none';
    overlay.style.display='none';
    alertSound.pause();
  }
});

googleSignIn.onclick = ()=> auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
freqSelect.onchange = ()=> listenToFrequency(freqSelect.value);
