const formContainer = document.getElementById("form-container");
const gameContainer = document.getElementById("game-container");
const startForm = document.getElementById("start-form");
const nameInput = document.getElementById("name");
const cardCountInput = document.getElementById("card-count");
const gridContainer = document.querySelector(".grid-container");
const playerNameElement = document.querySelector(".player-name");
const timerElement = document.querySelector(".timer");
let cardCount;
let cards = [];
let dup = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let playerName = "";
let startTime, endTime, timerInterval;
let gameComplete = false;

let jsonCards = 
[
    {
      "image": "./assets/chili.png",
      "name": "chili"
  },
  {
      "image": "./assets/grapes.png",
      "name": "grapes"
  },
  {
      "image": "./assets/lemon.png",
      "name": "lemon"
  },
  {
      "image": "./assets/orange.png",
      "name": "orange"
  },
  {
      "image": "./assets/pineapple.png",
      "name": "pineapple"
  },
  {
      "image": "./assets/strawberry.png",
      "name": "strawberry"
  },
  {
      "image": "./assets/tomato.png",
      "name": "tomato"
  },
  {
      "image": "./assets/watermelon.png",
      "name": "watermelon"
  },
  {
      "image": "./assets/cherries.png",
      "name": "cherries"
  },
  {
      "image": "./assets/almond.png",
      "name": "almond"
  },
  {
      "image": "./assets/avocado.png",
      "name": "avocado"
  },
  {
      "image": "./assets/bananas.png",
      "name": "bananas"
  },
  {
      "image": "./assets/blueberries.png",
      "name": "blueberries"
  },
  {
      "image": "./assets/coconut-milk.png",
      "name": "coconut-milk"
  },
  {
      "image": "./assets/dragon-fruit.png",
      "name": "dragon-fruit"
  },
  {
      "image": "./assets/drink.png",
      "name": "drink"
  },
  {
      "image": "./assets/eggplant.png",
      "name": "eggplant"
  },
  {
      "image": "./assets/fruits.png",
      "name": "fruits"
  },
  {
      "image": "./assets/grape.png",
      "name": "grape"
  },
  {
      "image": "./assets/kiwi.png",
      "name": "kiwi"
  },
  {
      "image": "./assets/lemon2.png",
      "name": "lemon2"
  },
  {
      "image": "./assets/orange-juice.png",
      "name": "orange-juice"
  },
  {
      "image": "./assets/orange2.png",
      "name": "orange2"
  },
  {
      "image": "./assets/passion-fruit.png",
      "name": "passion-fruit"
  },
  {
      "image": "./assets/peach.png",
      "name": "peach"
  },
  {
      "image": "./assets/pear.png",
      "name": "pear"
  },
  {
      "image": "./assets/pepper.png",
      "name": "pepper"
  },
  {
      "image": "./assets/pomelo.png",
      "name": "pomelo"
  },
  {
      "image": "./assets/star-fruit.png",
      "name": "star-fruit"
  },
  {
      "image": "./assets/vegetable.png",
      "name": "vegetable"
  }
]

function startGame(event) {
  event.preventDefault();

  playerName = nameInput.value.trim();
  cardCount = parseInt(cardCountInput.value);
  
  if (playerName === "" || isNaN(cardCount)) {
    alert("Please enter a valid name and number of cards.");
    return;
  }

  if (cardCount < 2 || cardCount > 60) {
    alert("Number of cards should be between 2 and 60.");
    return;
  }

  if (cardCount % 2 !== 0) {
    cardCount -= 1;
    alert("Number of cards must be an even number. Adjusted to " + cardCount + ".");
  }

  formContainer.style.display = "none";
  gameContainer.style.display = "block";

  playerNameElement.textContent = playerName;
  cards = [...jsonCards]; //COPY jsonCards to cards
  cards.length = cardCount / 2;
  dup = cards;
  cards = cards.concat(dup); //create a set of pairs
  resetTimer();
  shuffleCards();
  generateCards();
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerElement.textContent = "00:00";
  startTimer();
}

function updateTimer() {
  const currentTime = Date.now();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000);
  timerElement.textContent = formatTime(elapsedTime);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${padTime(minutes)}:${padTime(seconds)}`;
}

function padTime(time) {
  return time.toString().padStart(2, "0");
}

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();

  if (isGameComplete()) {
    stopTimer();
    showGameWonMessage();
  }
}

function showGameWonMessage() {
  const gameWonMessage = document.getElementById("win-message");
  gameWonMessage.classList.remove("hidden");
}

function removeGameWonMessage() {
  const gameWonMessage = document.getElementById("win-message");
  gameWonMessage.classList.add("hidden");
}

function isGameComplete() {
  const flippedCards = document.querySelectorAll(".card.flipped");
  const isComplete = flippedCards.length === cards.length;

  return isComplete;
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    disableCards();
    score += 1;
    document.querySelector(".score").textContent = score;
  }
  else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
  resetTimer();
  removeGameWonMessage();
}

function returnToMainPage() {
  gameContainer.style.display = "none";
  formContainer.style.display = "block";
  gridContainer.innerHTML = "";
  clearMainPageText();
  removeGameWonMessage();
}

function clearMainPageText() {
  nameInput.value = "";
  cardCountInput.value = "";
}