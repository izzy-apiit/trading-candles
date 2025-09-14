// ==================== Firebase Setup ====================
var firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// ==================== Candles Setup ====================
const totalCandles = 20;
const candlesContainer = document.getElementById("candles-container");

// Create candle divs
if (candlesContainer) {
  for (let i = 0; i < totalCandles; i++) {
    const candle = document.createElement("div");
    candle.classList.add("candle");
    candle.id = "candle-" + i;
    candlesContainer.appendChild(candle);
  }
}

// ==================== Display Logic ====================
database.ref("candles/current").on("value", (snapshot) => {
  const litCount = snapshot.val() || 0;

  for (let i = 0; i < totalCandles; i++) {
    const candle = document.getElementById("candle-" + i);
    if (candle) {
      if (i < litCount) {
        candle.classList.add("lit");
      } else {
        candle.classList.remove("lit");
      }
    }
  }
});

// ==================== Control Functions ====================
function lightNextCandle() {
  database.ref("candles/current").transaction((currentValue) => {
    if (currentValue === null) return 1;
    if (currentValue < totalCandles) return currentValue + 1;
    return currentValue; // stop at max
  });
}

function resetCandles() {
  database.ref("candles/current").set(0);
}

// Expose functions for control.html
window.lightNextCandle = lightNextCandle;
window.resetCandles = resetCandles;
