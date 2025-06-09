const puzzle = document.getElementById('puzzle');
const timerEl = document.getElementById('timer');
const movesEl = document.getElementById('moves');
const pauseBtn = document.getElementById('pauseBtn');
const winMessage = document.getElementById('winMessage');
const finalTime = document.getElementById('finalTime');
const finalMoves = document.getElementById('finalMoves');
const bestTimeEl = document.getElementById('bestTime');
const bestMovesEl = document.getElementById('bestMoves');

let tiles = [];
let timer = 0;
let moves = 0;
let interval = null;
let isPaused = false;
let gameOver = false;

function init() {
  tiles = [...Array(15).keys()].map(n => n + 1);
  tiles.push(null);
  timer = 0;
  moves = 0;
  isPaused = false;
  gameOver = false;
  winMessage.classList.add('hidden');
  pauseBtn.textContent = '⏸ Pause';
  updateStatus();
  draw();
  startTimer();
  loadBestScores();
}

function draw() {
  puzzle.innerHTML = '';
  tiles.forEach((tile, i) => {
    const div = document.createElement('div');
    div.className = tile ? 'tile' : 'tile empty';
    if (tile && tile === i + 1) div.classList.add('correct');
   if (tile) {
  const span = document.createElement('span');
  span.textContent = tile;
  div.appendChild(span);
}

    div.addEventListener('click', () => {
      if (!isPaused && !gameOver) move(i);
    });
    puzzle.appendChild(div);
  });
}

function move(index) {
  const emptyIndex = tiles.indexOf(null);

  const row = Math.floor(index / 4);
  const col = index % 4;
  const emptyRow = Math.floor(emptyIndex / 4);
  const emptyCol = emptyIndex % 4;

  const isAdjacent =
    (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
    (col === emptyCol && Math.abs(row - emptyRow) === 1);

  if (isAdjacent) {
    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
    moves++;
    updateStatus();
    draw();
    checkWin();
  }
}

function shuffle() {
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  moves = 0;
  timer = 0;
  isPaused = false;
  gameOver = false;
  pauseBtn.textContent = '⏸ Pause';
  winMessage.classList.add('hidden');
  updateStatus();
  draw();
  startTimer();
}

function updateStatus() {
  timerEl.textContent = timer;
  movesEl.textContent = moves;
}

function startTimer() {
  clearInterval(interval);
  interval = setInterval(() => {
    if (!isPaused && !gameOver) {
      timer++;
      updateStatus();
    }
  }, 1000);
}

function togglePause() {
  if (gameOver) return;
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? '▶ Resume' : '⏸ Pause';
}

function checkWin() {
  const isSolved = tiles.every((tile, i) => (i === 15 ? tile === null : tile === i + 1));
  if (isSolved) {
    clearInterval(interval);
    gameOver = true;
    finalTime.textContent = timer;
    finalMoves.textContent = moves;
    winMessage.classList.remove('hidden');
    saveBestScores();
  }
}

function saveBestScores() {
  const bestTime = localStorage.getItem('bestTime');
  const bestMoves = localStorage.getItem('bestMoves');

  if (!bestTime || timer < parseInt(bestTime)) {
    localStorage.setItem('bestTime', timer);
  }

  if (!bestMoves || moves < parseInt(bestMoves)) {
    localStorage.setItem('bestMoves', moves);
  }

  loadBestScores();
}

function loadBestScores() {
  const bestTime = localStorage.getItem('bestTime');
  const bestMoves = localStorage.getItem('bestMoves');
  bestTimeEl.textContent = bestTime || '--';
  bestMovesEl.textContent = bestMoves || '--';
}

init();
