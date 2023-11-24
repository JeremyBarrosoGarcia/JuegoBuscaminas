let boardSize = 8;
let mineCount = 10;
let board = [];
let backgroundMusic = document.getElementById('backgroundMusic');

function initializeBoard() {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));

  for (let i = 0; i < mineCount; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * boardSize);
      y = Math.floor(Math.random() * boardSize);
    } while (board[x][y] === 'M');
    board[x][y] = 'M';
  }

  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      if (board[x][y] !== 'M') {
        board[x][y] = countMinesAround(x, y);
      }
    }
  }

  renderBoard();
}

function countMinesAround(x, y) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newX = x + i;
      const newY = y + j;
      if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize && board[newX][newY] === 'M') {
        count++;
      }
    }
  }
  return count;
}

function renderBoard() {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = '';

  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      const cell = document.createElement('div');
      cell.className = 'cell hidden';
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.addEventListener('click', handleClick);

      if (board[x][y] === 'M') {
        const img = document.createElement('img');
        img.src = 'https://media.istockphoto.com/id/842671590/es/vector/bomba-de-dibujos-animados-ilustraci%C3%B3n.jpg?s=612x612&w=0&k=20&c=CVDc3LX4qfQyU6QCqdLwE-tQSr2O7n4c5ptc17wvVvA=';
        img.alt = 'Bomba';
        img.classList.add('mine-image');
        cell.classList.add('mine');
        cell.appendChild(img);
      }

      boardElement.appendChild(cell);
    }
  }

  // Iniciar música de fondo
  backgroundMusic.play();
}

function handleClick(event) {
  const x = parseInt(event.target.dataset.x);
  const y = parseInt(event.target.dataset.y);

  if (board[x][y] === 'M') {
    revealBoard();
    alert('¡BOOOOOOOOMMMMM!');
    initializeBoard();
  } else {
    revealEmptyCells(x, y);
    event.target.classList.remove('hidden');
  }

  checkForWin();
}

function revealEmptyCells(x, y) {
  if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    if (cell && cell.classList.contains('hidden')) {
      cell.classList.remove('hidden');
      if (board[x][y] === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            revealEmptyCells(x + i, y + j);
          }
        }
      }
    }
  }
}

function revealBoard() {
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
      if (board[x][y] === 'M') {
        const img = cell.querySelector('.mine-image');
        img.style.display = 'block';
        cell.classList.add('exploded');
      }
      cell.classList.remove('hidden');
    }
  }

  
  // Pausar música de fondo al revelar el tablero
  backgroundMusic.pause();
  
}

function checkForWin() {
  const hiddenCells = document.querySelectorAll('.cell.hidden');
  if (hiddenCells.length === mineCount) {
    revealBoard();
    alert('¡Ganaste! Haz clic en OK para reiniciar.');
    initializeBoard();
  }
}

// Iniciar juego al hacer clic en el botón "Iniciar Juego"
document.getElementById('startButton').addEventListener('click', () => {
  initializeBoard();
  document.querySelectorAll('.win-message, .lose-message').forEach(message => {
    message.style.display = 'none';
  });
});

