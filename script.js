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

    // Randomize sizes
    const bodyHeight = Math.floor(Math.random() * 100) + 40; // 40–140px
    const wickHeight = Math.floor(Math.random() * 50) + 20;  // 20–70px

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
      // Alternate direction: even = green (up), odd = red (down)
      if (i % 2 === 0) {
        candle.classList.add("lit", "green");
        candle.classList.remove("red");
      } else {
        candle.classList.add("lit", "red");
        candle.classList.remove("green");
      }
    } else {
      candle.classList.remove("lit", "red", "green");
    }
  });
});

// ==================== Control Functions ====================
function lightNextCandle() {
  database.ref("candles/current").transaction((currentValue) => {
    if (currentValue === null) return 1;
    if (currentValue < totalCandles) return currentValue + 1;
    return currentValue;
  });
}

function resetCandles() {
  database.ref("candles/current").set(0);
}

window.lightNextCandle = lightNextCandle;
window.resetCandles = resetCandles;
