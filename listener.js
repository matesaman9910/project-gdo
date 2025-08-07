
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    document.getElementById("loginUI").style.display = "none";
    document.getElementById("listenerUI").style.display = "block";
    listenToChannel(document.getElementById("frequencySelect").value);
  } else {
    document.getElementById("loginUI").style.display = "block";
    document.getElementById("listenerUI").style.display = "none";
  }
});

document.getElementById("googleSignIn").addEventListener("click", () => {
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
});

document.getElementById("frequencySelect").addEventListener("change", () => {
  listenToChannel(document.getElementById("frequencySelect").value);
});

let currentRef = null;

function listenToChannel(channel) {
  if (currentRef) currentRef.off();
  const db = firebase.database();
  currentRef = db.ref("channels/" + channel);
  document.getElementById("statusMessage").textContent = "Listening on " + channel + "...";
  currentRef.on("value", snapshot => {
    const data = snapshot.val();
    const log = document.getElementById("log");
    if (data && data.message) {
      log.textContent = data.message;
      if (data.message.includes("CODE 9")) {
        showBaseAlert();
      }
      if (data.sound) {
        playSoundEffect(data.sound);
      }
    }
  });
}

function showBaseAlert() {
  const alert = document.getElementById("baseAlertOverlay");
  alert.style.display = "flex";
  setTimeout(() => alert.style.display = "none", 5000);
}

function playSoundEffect(src) {
  const audio = document.getElementById("alertSound");
  if (src !== audio.src) audio.src = src;
  audio.play();
}

setInterval(() => {
  const now = new Date();
  document.getElementById("timeDisplay").textContent =
    "Time: " + now.toLocaleTimeString();
  document.getElementById("firebaseStatus").textContent =
    "Firebase: " + (firebase.apps.length ? "Connected" : "--");
}, 1000);
