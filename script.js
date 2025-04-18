const boardEl = document.getElementById("game-board");
const startBtnEl = document.getElementById("startBtn");
const difficultySelectEl = document.getElementById("difficulty");
const statusEl = document.getElementById("status");
const timeLeftEl = document.getElementById("timeLeft");
const stepsLeftEl = document.getElementById("stepsLeft");

const shuffleArr = (arr) => arr.sort(() => Math.random() - 0.5);
const randomBool = () => Math.floor(Math.random() <= 0.5);
const clearStatuses = () =>
  [statusEl, timeLeftEl, stepsLeftEl].forEach((el) => (el.innerHTML = ""));

const emojis = ["🐶", "🍕", "🚗", "🌈", "🐱", "🍎", "🎵", "⚽"];

const lastOpenedCards = new Set();
const correctCards = new Set();
let shuffledEmojiList = [];
let difficulty = "easy";
let interval = null;
const timeAllowed = 30;
let timeLeft = timeAllowed;
const allowedSteps = 30;
let stepsLeft = allowedSteps;

boardEl.style.display = "none";

function start() {
  if (interval) clearInterval(interval);
  difficulty = difficultySelectEl.value;
  boardEl.style.display = "";
  boardEl.style.opacity = "0";
  boardEl.innerHTML = "";
  clearStatuses();

  lastOpenedCards.clear();
  correctCards.clear();
  shuffledEmojiList = shuffleArr([...emojis, ...emojis]);

  if (difficulty === "normal" || difficulty === "extreme") {
    timeLeft = timeAllowed;
    const timeLeftUpdate = () => {
      if (timeLeft <= 0) {
        triggerGameLost();
      } else {
        timeLeft -= 1;
        timeLeftEl.innerText = `Time left: ${timeLeft} seconds`;
      }
    };
    timeLeftEl.innerText = `Time left: ${timeLeft} seconds`;
    interval = setInterval(timeLeftUpdate, 1000);
  }

  if (difficulty === "hard" || difficulty === "extreme") {
    stepsLeft = allowedSteps;
    stepsLeftEl.innerText = `Steps left: ${stepsLeft}`;
  }

  shuffledEmojiList.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card", "flipped");
    card._emoji = emoji;
    card.style.transform = "rotateY(180deg)";
    card.addEventListener("click", onCardClick);
    boardEl.appendChild(card);
  });

  setTimeout(() => {
    boardEl.style.opacity = "1";
  }, 500);
}

//button events
startBtnEl.addEventListener("click", () => {
  start();
});

function onCardClick(event) {
  const card = event.target;
  if (lastOpenedCards.size < 2 && !lastOpenedCards.has(card) && !correctCards.has(card)) {
    card.style.transform = "rotate(0deg)";

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
          triggerGameWon();
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

      //hard difficulty logic
      if (difficulty === "hard" || difficulty === "extreme") {
        if (stepsLeft <= 1) {
          stepsLeftEl.innerText = `Steps left: 0`;
          triggerGameLost("You run out of steps.");
        } else {
          stepsLeft -= 1;
          stepsLeftEl.innerText = `Steps left: ${stepsLeft}`;
        }
      }
    }
  }
}

function triggerGameWon() {
  if (interval) clearInterval(interval);
  clearStatuses();

  setTimeout(() => {
    boardEl.style.opacity = "0";
    setTimeout(() => {
      boardEl.style.display = "none";
      statusEl.innerHTML = "You won!";
    }, 1000);
  }, 500);
}

function triggerGameLost(message = "You lost!") {
  if (interval) clearInterval(interval);
  clearStatuses();

  setTimeout(() => {
    boardEl.style.opacity = "0";
    setTimeout(() => {
      boardEl.style.display = "none";
      boardEl.innerHTML = "";
      statusEl.innerHTML = message;
    }, 1000);
  }, 500);
}
