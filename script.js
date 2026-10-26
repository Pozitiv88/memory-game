const gameBoard = document.querySelector("#gameBoard");
const movesElement = document.querySelector("#moves");
const gameMessage = document.querySelector("#gameMessage");
const bestScoreElement = document.querySelector("#bestScore");
const restartButton = document.querySelector("#restartButton");

const gameTitle = document.querySelector("#gameTitle");
const movesLabel = document.querySelector("#movesLabel");
const bestLabel = document.querySelector("#bestLabel");

const symbols = ["🐱", "🐶", "🐸", "🦊", "🐼", "🐵", "🦁", "🐧"];

let moves = 0;
let matchedPairs = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;

const languages = ["ru", "en", "ua", "pl"];
let currentLanguage = "en";
let newRecordAchieved = false;

const translations = {
  ru: {
    title: "Игра на память",
    moves: "Ходы",
    best: "Рекорд",
    restart: "Сыграть ещё раз",
    victory: moves => `Победа! Все пары найдены. Ходов: ${moves} 🎉`,
    newRecord: " Новый рекорд!",
  },

  en: {
    title: "Memory Game",
    moves: "Moves",
    best: "Best score",
    restart: "Play again",
    victory: moves => `You won! All pairs found in ${moves} moves 🎉`,
    newRecord: " New record!",
  },

  ua: {
    title: "Гра на пам’ять",
    moves: "Ходи",
    best: "Рекорд",
    restart: "Зіграти ще раз",
    victory: moves => `Перемога! Усі пари знайдено. Ходів: ${moves} 🎉`,
    newRecord: " Новий рекорд!",
  },

  pl: {
    title: "Gra w pamięć",
    moves: "Ruchy",
    best: "Rekord",
    restart: "Zagraj ponownie",
    victory: moves => `Wygrana! Wszystkie pary znalezione. Ruchów: ${moves} 🎉`,
    newRecord: " Nowy rekord!",
  },
};

function updateLanguage() {
  const text = translations[currentLanguage];

  gameTitle.textContent = text.title;
  movesLabel.textContent = text.moves;
  bestLabel.textContent = text.best;
  restartButton.textContent = text.restart;

  if (matchedPairs === symbols.length) {
    gameMessage.textContent = text.victory(moves);

    if (newRecordAchieved) {
      gameMessage.textContent += text.newRecord;
    }
  }
}

document.querySelectorAll('input[name="language"]').forEach(input => {
  input.addEventListener("change", () => {
    currentLanguage = input.value;
    updateLanguage();
  });
});

// Загружаем сохранённый рекорд
const savedScore = localStorage.getItem("memoryBestScore");
let bestScore = savedScore === null ? null : Number(savedScore);

function updateBestScore() {
  bestScoreElement.textContent = bestScore === null ? "—" : bestScore;
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function startGame() {
  // Очищаем старые карточки
  gameBoard.innerHTML = "";

  // Сбрасываем состояние игры
  moves = 0;
  matchedPairs = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  movesElement.textContent = moves;
  gameMessage.textContent = "";
  restartButton.hidden = true;

  // Создаём и перемешиваем карточки
  const cards = [...symbols, ...symbols];
  cards.sort(() => Math.random() - 0.5);

  cards.forEach(symbol => {
    const card = document.createElement("div");

    card.classList.add("card");
    card.textContent = "?";
    card.dataset.symbol = symbol;

    card.addEventListener("click", () => {
      if (
        lockBoard ||
        card === firstCard ||
        card.classList.contains("matched")
      ) {
        return;
      }

      card.textContent = card.dataset.symbol;

      if (firstCard === null) {
        firstCard = card;
        return;
      }

      secondCard = card;
      lockBoard = true;

      moves++;
      movesElement.textContent = moves;

      if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        matchedPairs++;

        if (matchedPairs === symbols.length) {
          newRecordAchieved = false;

          if (bestScore === null || moves < bestScore) {
            bestScore = moves;

            localStorage.setItem("memoryBestScore", String(bestScore));

            updateBestScore();
            newRecordAchieved = true;
          }

          updateLanguage();
          restartButton.hidden = false;

          // Проверяем, побит ли рекорд
          if (bestScore === null || moves < bestScore) {
            bestScore = moves;

            localStorage.setItem("memoryBestScore", String(bestScore));

            updateBestScore();
            gameMessage.textContent += " Новый рекорд!";
          }

          restartButton.hidden = false;
        }

        resetTurn();
      } else {
        setTimeout(() => {
          firstCard.textContent = "?";
          secondCard.textContent = "?";

          resetTurn();
        }, 800);
      }
    });

    gameBoard.append(card);
  });
}

// Кнопка запускает новую игру
restartButton.addEventListener("click", startGame);

// Показываем сохранённый рекорд и запускаем первую игру
updateBestScore();
updateLanguage();
startGame();
