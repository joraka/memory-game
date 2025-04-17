const boardEl = document.getElementById("game-board");
const startBtnEl = document.getElementById("startBtn");
const difficultySelectEl = document.getElementById("difficulty");
const statusEl = document.getElementById("status");

const emojis = ["🐶", "🍕", "🚗", "🌈", "🐱", "🍎", "🎵", "⚽"];
const pairs = 12;

function shuffleArr(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

const lastOpenedCards = new Set();

const randomBool = () => Math.floor(Math.random() <= 0.5);

startBtnEl.addEventListener("click", () => {
  start();
});

function onCardClick(event) {
  const card = event.target;
  if (lastOpenedCards.size < 2 && !lastOpenedCards.has(card)) {
    card.classList.add("flipped");
    lastOpenedCards.add(card);

    if (lastOpenedCards.size === 2) {
      setTimeout(() => {
        unfipCards();
      }, 1000);
    }
  }
}

function unfipCards() {
  for (const card of lastOpenedCards) {
    card.classList.remove("flipped");
    lastOpenedCards.delete(card);
  }
}

function start() {
  lastOpenedCards.clear();
  const currentEmojis = shuffleArr([...emojis, ...emojis]);

  boardEl.innerHTML = "";

  currentEmojis.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardEmoji = card.appendChild(document.createElement("div"));
    cardEmoji.innerText = emoji;

    card.addEventListener("click", onCardClick);
    boardEl.appendChild(card);
  });
}

start();
