const firebaseConfig = {
  apiKey: "AIzaSyCniENpn05n_JyZ_rJh2piGOHjT9Pvuc6E",
  authDomain: "candle-ceremony.firebaseapp.com",
  databaseURL: "https://candle-ceremony-default-rtdb.firebaseio.com",
  projectId: "candle-ceremony",
  storageBucket: "candle-ceremony.firebasestorage.app",
  messagingSenderId: "1068113076295",
  appId: "1:1068113076295:web:0d69fb1bfcab057c391162"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let totalCandles = 20;

db.ref("candles").on("value", snapshot => {
  const candles = snapshot.val() || [];
  renderCandles(candles);
});

function renderCandles(candles) {
  const container = document.getElementById("candles-container");
  if (!container) return;
  container.innerHTML = "";
  candles.forEach((state, i) => {
    const div = document.createElement("div");
    div.className = "candle" + (state ? " " + state : "");
    div.style.height = (60 + Math.sin(i * 0.7) * 40 + 40) + "px";
    container.appendChild(div);
  });
}

function resetCandles() {
  const empty = Array(totalCandles).fill(null);
  db.ref("candles").set(empty);
}

function lightNextCandle() {
  db.ref("candles").once("value").then(snapshot => {
    let candles = snapshot.val() || Array(totalCandles).fill(null);
    let nextIndex = candles.indexOf(null);
    if (nextIndex !== -1) {
      candles[nextIndex] = nextIndex % 2 === 0 ? "green" : "red";
      db.ref("candles").set(candles);
    }
  });
}
