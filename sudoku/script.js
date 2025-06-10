const boardSize = 6;
const solution = [
  [1, 2, 3, 4, 5, 6],
  [4, 5, 6, 1, 2, 3],
  [2, 3, 4, 5, 6, 1],
  [5, 6, 1, 2, 3, 4],
  [3, 4, 5, 6, 1, 2],
  [6, 1, 2, 3, 4, 5]
];

let puzzle = [
  [1, 0, 0, 4, 5, 0],
  [0, 5, 6, 0, 0, 3],
  [0, 3, 4, 0, 6, 1],
  [5, 0, 1, 2, 3, 0],
  [0, 4, 5, 6, 0, 2],
  [6, 0, 2, 3, 4, 5]
];

let undoStack = [];
let redoStack = [];
let timeLeft = 60;
let timerInterval;

const board = document.getElementById('sudoku-board');
const timerElement = document.getElementById('timer');
const winMessage = document.getElementById('win-message');

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `⏱️ ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert('Time\'s up!');
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function renderBoard() {
  board.innerHTML = '';
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      if (puzzle[r][c] !== 0) {
        cell.textContent = puzzle[r][c];
        cell.classList.add('filled');
      } else {
        cell.classList.add('empty');
        cell.setAttribute('draggable', true);
        cell.addEventListener('dragover', (e) => e.preventDefault());
        cell.addEventListener('drop', handleDrop);
      }
      board.appendChild(cell);
    }
  }
}

function createDraggableNumbers() {
  const numbers = [1, 2, 3, 4, 5, 6];
  numbers.forEach((num) => {
    const numElement = document.createElement('div');
    numElement.classList.add('draggable-number');
    numElement.textContent = num;
    numElement.id = `num-${num}`;
    numElement.setAttribute('draggable', true);
    numElement.addEventListener('dragstart', handleDragStart);
    document.body.appendChild(numElement);
  });
}

function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.id);
}

function handleDrop(e) {
  const cell = e.target;
  const numId = e.dataTransfer.getData('text/plain');
  const num = parseInt(numId.split('-')[1]);
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  if (puzzle[row][col] === 0) {
    puzzle[row][col] = num;
    undoStack.push({ row, col, prevValue: 0 });
    renderBoard();
    checkCompletion();
  }
}

function checkCompletion() {
  const isComplete = puzzle.every((row, r) =>
    row.every((value, c) => value === solution[r][c])
  );
  if (isComplete) {
    stopTimer();
    winMessage.style.display = 'block';
  }
}

function resetGame() {
  puzzle = [
    [1, 0, 0, 4, 5, 0],
    [0, 5, 6, 0, 0, 3],
    [0, 3, 4, 0, 6, 1],
    [5, 0, 1, 2, 3, 0],
    [0, 4, 5, 6, 0, 2],
    [6, 0, 2, 3, 4, 5]
  ];
  undoStack = [];
  redoStack = [];
  timeLeft = 60;
  timerElement.textContent = `⏱️ ${timeLeft}`;
  startTimer();
  renderBoard();
  createDraggableNumbers();
  winMessage.style.display = 'none';
}

function redoMove() {
  const lastMove = undoStack.pop();
  if (lastMove) {
    const { row, col, prevValue } = lastMove;
    puzzle[row][col] = prevValue;
    redoStack.push(lastMove);
    renderBoard();
  }
}

renderBoard();
createDraggableNumbers();
startTimer();
