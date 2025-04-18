const boardEl = document.getElementById("game-board");
const startBtnEl = document.getElementById("startBtn");
const difficultySelectEl = document.getElementById("difficulty");
const statusEl = document.getElementById("status");

const shuffleArr = (arr) => arr.sort(() => Math.random() - 0.5);
const randomBool = () => Math.floor(Math.random() <= 0.5);

const emojis = ["🐶", "🍕", "🚗", "🌈", "🐱", "🍎", "🎵", "⚽"];

const lastOpenedCards = new Set();
const correctCards = new Set();
let shuffledEmojiList = [];

function start() {
  lastOpenedCards.clear();
  correctCards.clear();
  shuffledEmojiList = shuffleArr([...emojis, ...emojis]);

  boardEl.innerHTML = "";

  shuffledEmojiList.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card", "flipped");
    card._emoji = emoji;
    card.style.transform = "rotateY(180deg)";
    card.addEventListener("click", onCardClick);
    boardEl.appendChild(card);
  });
}

//button events
startBtnEl.addEventListener("click", () => {
  start();
});

function onCardClick(event) {
  const card = event.target;
  if (lastOpenedCards.size < 2 && !lastOpenedCards.has(card) && !correctCards.has(card)) {
    card.style.transform = "rotateY(0deg)";

    setTimeout(() => {
      card.innerText = card._emoji;
    }, 100);

    card.classList.remove("flipped");

    lastOpenedCards.add(card);

    //2 cards opened at the same time
    if (lastOpenedCards.size == 2) {
      const [firstCard, secondCard] = Array.from(lastOpenedCards);
      //if correct guess
      if (firstCard._emoji === secondCard._emoji) {
        correctCards.add(firstCard);
        correctCards.add(secondCard);
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        lastOpenedCards.clear();

        if (shuffledEmojiList.length === correctCards.size) {
          alert("you won");
        }
      } else {
        // flip cards back down
        setTimeout(() => {
          for (const card of lastOpenedCards) {
            card.classList.add("flipped");
            card.style.transform = "rotateY(180deg)";
            lastOpenedCards.delete(card);
            card.innerText = "";
          }
        }, 500);
      }
    }
  }
}

//init
start();
