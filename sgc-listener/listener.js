// Your Firebase config — replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyAn5rsOUfkKBYhpQb3qwdUTElJP8Kg0dW0",
  authDomain: "project-gdo.firebaseapp.com",
  databaseURL: "https://project-gdo-default-rtdb.firebaseio.com",
  projectId: "project-gdo",
  storageBucket: "project-gdo.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

const statusElem = document.getElementById('status');
const messageElem = document.getElementById('message');
const logoutBtn = document.getElementById('logout');

logoutBtn.addEventListener('click', () => {
  auth.signOut().then(() => {
    statusElem.textContent = 'Logged out.';
    messageElem.textContent = '';
  }).catch(err => {
    statusElem.textContent = 'Logout failed: ' + err.message;
  });
});

// Listen for auth state changes
auth.onAuthStateChanged(user => {
  if (user) {
    statusElem.textContent = 'Authenticated as: ' + user.email;
    startListening();
  } else {
    statusElem.textContent = 'Not authenticated. Redirecting to login...';
    messageElem.textContent = '';
    // Redirect or show login page logic here
    setTimeout(() => {
      window.location.href = '../login.html'; // adjust as needed
    }, 2000);
  }
});

function startListening() {
  // Path to your Firebase Realtime DB signal
  const signalRef = database.ref('signal');

  signalRef.on('value', snapshot => {
    const val = snapshot.val();
    if (val) {
      messageElem.textContent = JSON.stringify(val, null, 2);
    } else {
      messageElem.textContent = 'No signal data received yet.';
    }
  }, error => {
    statusElem.textContent = 'Listen error: ' + error.message;
  });
}
