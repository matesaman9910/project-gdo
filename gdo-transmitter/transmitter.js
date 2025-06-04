<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SGC GDO Transmitter</title>
  <style>
    body {
      background-color: #000;
      color: #0f0;
      font-family: 'Courier New', Courier, monospace;
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    label, input, select, button {
      font-size: 1.2rem;
      margin: 0.5rem;
      padding: 0.5rem;
    }
    #output {
      white-space: pre-wrap;
      margin-top: 2rem;
      background: #111;
      border: 1px solid #0f0;
      padding: 1rem;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <h1>SGC GDO Transmitter</h1>
  <label for="code">Code:</label>
  <input type="text" id="code" placeholder="Enter GDO code">

  <label for="frequency">Frequency:</label>
  <select id="frequency">
    <option value="alpha-1">Alpha-1</option>
    <option value="bravo-2">Bravo-2</option>
  </select>

  <button id="sendBtn">Send Signal</button>

  <div id="output"></div>

  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
  <script>
    const firebaseConfig = {
      apiKey: "AIzaSyAn5rsOUfkKBYhpQb3qwdUTElJP8Kg0dW0",
      authDomain: "project-gdo.firebaseapp.com",
      databaseURL: "https://project-gdo-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "project-gdo",
      storageBucket: "project-gdo.appspot.com",
      messagingSenderId: "758705115255",
      appId: "1:758705115255:web:878f5e64c164b75c507672"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    const sendBtn = document.getElementById('sendBtn');
    const output = document.getElementById('output');

    sendBtn.addEventListener('click', () => {
      const code = document.getElementById('code').value.trim();
      const frequency = document.getElementById('frequency').value;

      if (!code) {
        output.textContent = 'Enter a valid code!';
        return;
      }

      output.textContent = 'Encrypting...\n';

      // Simulate encryption delay
      setTimeout(() => {
        output.textContent += 'Transmitting...\n';

        setTimeout(() => {
          const signalRef = db.ref(`frequencies/${frequency}/signals`).push();
          signalRef.set({
            code,
            timestamp: Date.now()
          }).then(() => {
            output.textContent += 'Transmitted.\n';
          });
        }, 1000);
      }, 1000);
    });
  </script>
</body>
</html>
