import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onChildAdded, get } from 'firebase/database';

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const frequencySelect = document.getElementById('frequencySelect');
  const log = document.getElementById('log');

  function listenToFrequency(channel) {
    const freqRef = ref(db, `frequencies/${channel}/signals`);
    onChildAdded(freqRef, async (snapshot) => {
      const data = snapshot.val();
      const code = data.decrypted || data.code || "UNKNOWN";

      const codeRef = ref(db, `codes/${code}`);
      const codeSnap = await get(codeRef);
      const codeInfo = codeSnap.exists() ? codeSnap.val() : null;

      const isAuthorized = codeInfo?.authorized || false;
      const owner = codeInfo?.owner || "UNKNOWN";

      const div = document.createElement('div');
      div.innerHTML = `
        <strong>Code:</strong> ${code}<br>
        <strong>Owner:</strong> ${owner}<br>
        <strong>Status:</strong> <span style="color:${isAuthorized ? 'lime' : 'red'}">${isAuthorized ? '✔ Verified' : '✖ Unrecognized Code!'}</span>
        <hr>
      `;
      log.prepend(div);

      if (!isAuthorized) {
        document.body.classList.add('alert');
        setTimeout(() => document.body.classList.remove('alert'), 3000);
      }
    });
  }

  frequencySelect.addEventListener('change', () => {
    listenToFrequency(frequencySelect.value);
  });

  listenToFrequency(frequencySelect.value);
});
