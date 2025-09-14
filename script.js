// ==================== Firebase Setup ====================
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
var database = firebase.database();

// ==================== Candles Setup ====================
const totalCandles = 20;
const container = document.getElementById("candles-container");
const candles = [];

if (container) {
  for (let i = 0; i < totalCandles; i++) {
    const candle = document.createElement("div");
    candle.classList.add("candle");
    candle.id = "candle-" + i;

    // Randomize size for trading effect
    const bodyHeight = Math.floor(Math.random() * 80) + 40; // 40–120px
    const wickHeight = Math.floor(Math.random() * 40) + 20; // 20–60px

    candle.style.setProperty("--body-height", `${bodyHeight}px`);
    candle.style.setProperty("--wick-height", `${wickHeight}px`);

    container.appendChild(candle);
    candles.push(candle);
  }
}

// ==================== Realtime Listener ====================
database.ref("candles/current").on("value", (snapshot) => {
  const litCount = snapshot.val() || 0;
  console.log("🔥 Current candle count:", litCount);

  candles.forEach((candle, i) => {
    if (i < litCount) {
      candle.classList.add("lit");
      candle.classList.toggle("red", i % 2 === 1); // alternate red/green
    } else {
      candle.classList.remove("lit", "red");
    }
  });
});

// ==================== Control Functions ====================
function lightNextCandle() {
  database.ref("candles/current").transaction((currentValue) => {
    if (currentValue === null) return 1;
    if (currentValue < totalCandles) return currentValue + 1;
    return currentValue; // don’t go past max
  });
}

function resetCandles() {
  database.ref("candles/current").set(0);
}

window.lightNextCandle = lightNextCandle;
window.resetCandles = resetCandles;
