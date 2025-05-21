// 1. Setup Global Variables and Constants
let gameBoard = [];
let score = 0;
let selectedCell = null; // To store {row, col, value} of the first selected cell
let gameOver = false; // NEW: Global game over state

const BOARD_COLS = 10; // Changed from 9 to 10
const NUM_INITIAL_ROWS = 14; // Changed from 5 to 14

// DOM Element References
let gameBoardElement;
let scoreValueElement;
let hintButtonElement;
let restartButtonElement;
let gameOverModalElement;
let finalScoreElement;
let playAgainButtonElement;
let submitScoreButtonElement;

// Function to initialize DOM element references
function initializeDOMReferences() {
  gameBoardElement = document.getElementById('game-board');
  scoreValueElement = document.getElementById('score-value');
  hintButtonElement = document.getElementById('hint-button');
  restartButtonElement = document.getElementById('restart-button');
  gameOverModalElement = document.getElementById('game-over-modal');
  finalScoreElement = document.getElementById('final-score');
  playAgainButtonElement = document.getElementById('play-again-button');
  submitScoreButtonElement = document.getElementById('submit-score-button');
}

// 2. generateBoard() Function
function generateBoard() {
  gameBoard = [];
  for (let i = 0; i < NUM_INITIAL_ROWS; i++) {
    const row = [];
    for (let j = 0; j < BOARD_COLS; j++) {
      row.push(Math.floor(Math.random() * 9) + 1);
    }
    gameBoard.push(row);
  }
}

// 3. displayBoard() Function
function displayBoard() {
  if (!gameBoardElement) return;
  gameBoardElement.innerHTML = '';

  gameBoard.forEach((rowValues, rowIndex) => {
    rowValues.forEach((cellValue, colIndex) => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');
      cellDiv.dataset.row = rowIndex;
      cellDiv.dataset.col = colIndex;

      if (cellValue !== null) {
        cellDiv.textContent = cellValue;
        cellDiv.addEventListener('click', () => handleCellClick(rowIndex, colIndex));
      } else {
        cellDiv.textContent = '';
        cellDiv.classList.add('empty-cell');
      }
      gameBoardElement.appendChild(cellDiv);
    });
  });
  updateScoreDisplay();
}

// 4. updateScoreDisplay() and updateScore(points)
function updateScoreDisplay() {
  if (!scoreValueElement) return;
  scoreValueElement.textContent = score;
}

function updateScore(points) {
  score += points;
  updateScoreDisplay();
}

// clearNumbers Function
function clearNumbers(cell1, cell2) {
  gameBoard[cell1.row][cell1.col] = null;
  gameBoard[cell2.row][cell2.col] = null;
}

// NEW: canMatch Function (Helper for Hints & Game Over)
function canMatch(cell1, cell2, currentBoard) {
  const valueMatch = (cell1.value === cell2.value) || (cell1.value + cell2.value === 10);
  if (!valueMatch) {
    return false;
  }

  let pathIsClear = false;

  // Same Row Check
  if (cell1.row === cell2.row) {
    pathIsClear = true;
    for (let c = Math.min(cell1.col, cell2.col) + 1; c < Math.max(cell1.col, cell2.col); c++) {
      if (currentBoard[cell1.row][c] !== null) {
        pathIsClear = false;
        break;
      }
    }
  }
  // Same Column Check
  else if (cell1.col === cell2.col) {
    pathIsClear = true;
    for (let r = Math.min(cell1.row, cell2.row) + 1; r < Math.max(cell1.row, cell2.row); r++) {
      if (currentBoard[r][cell1.col] !== null) {
        pathIsClear = false;
        break;
      }
    }
  }
  // Diagonal Check
  else if (Math.abs(cell1.row - cell2.row) === Math.abs(cell1.col - cell2.col)) {
    pathIsClear = true;
    const dr = (cell2.row - cell1.row > 0) ? 1 : -1;
    const dc = (cell2.col - cell1.col > 0) ? 1 : -1;
    let currentRow = cell1.row + dr;
    let currentCol = cell1.col + dc;
    while (currentRow !== cell2.row) { // Iterate up to (but not including) cell2
      if (currentBoard[currentRow][currentCol] !== null) {
        pathIsClear = false;
        break;
      }
      currentRow += dr;
      currentCol += dc;
    }
  }

  // Special Adjacency Rule (Only if other paths failed or weren't applicable)
  if (!pathIsClear) {
    if ((cell1.col === BOARD_COLS - 1 && cell2.col === 0 && cell1.row + 1 === cell2.row && currentBoard[cell1.row][cell1.col] !== null && currentBoard[cell2.row][cell2.col] !== null) ||
        (cell2.col === BOARD_COLS - 1 && cell1.col === 0 && cell2.row + 1 === cell1.row && currentBoard[cell2.row][cell2.col] !== null && currentBoard[cell1.row][cell1.col] !== null)) {
      pathIsClear = true;
    }
  }
  return pathIsClear;
}

// NEW: provideHint Function
function provideHint() {
  if (gameOver) return;

  for (let r1 = 0; r1 < gameBoard.length; r1++) {
    for (let c1 = 0; c1 < gameBoard[r1].length; c1++) {
      if (gameBoard[r1][c1] === null) continue;
      let cellA = { row: r1, col: c1, value: gameBoard[r1][c1] };

      for (let r2 = r1; r2 < gameBoard.length; r2++) {
        let startC2 = (r2 === r1) ? c1 + 1 : 0;
        for (let c2 = startC2; c2 < gameBoard[r2].length; c2++) {
          if (gameBoard[r2][c2] === null) continue;
          let cellB = { row: r2, col: c2, value: gameBoard[r2][c2] };

          if (canMatch(cellA, cellB, gameBoard)) {
            const cellAElement = document.querySelector(`[data-row="${r1}"][data-col="${c1}"]`);
            const cellBElement = document.querySelector(`[data-row="${r2}"][data-col="${c2}"]`);

            if (cellAElement && cellBElement) {
              cellAElement.classList.add('hint');
              cellBElement.classList.add('hint');
              console.log("Hint provided for:", cellA, "and", cellB);
              setTimeout(() => {
                cellAElement.classList.remove('hint');
                cellBElement.classList.remove('hint');
              }, 1500);
              return;
            }
          }
        }
      }
    }
  }
  console.log("No hints available.");
}

// NEW: isBoardEmpty Function
function isBoardEmpty() {
  for (let r = 0; r < gameBoard.length; r++) {
    for (let c = 0; c < gameBoard[r].length; c++) {
      if (gameBoard[r][c] !== null) {
        return false;
      }
    }
  }
  return true;
}

// NEW: addNewRows Function
function addNewRows(numberOfRows) {
  for (let i = 0; i < numberOfRows; i++) {
    const newRow = [];
    for (let j = 0; j < BOARD_COLS; j++) {
      newRow.push(Math.floor(Math.random() * 9) + 1);
    }
    gameBoard.push(newRow);
  }
  console.log(`${numberOfRows} new row(s) added.`);
}

// NEW: isMovePossible Function
function isMovePossible() {
  for (let r1 = 0; r1 < gameBoard.length; r1++) {
    for (let c1 = 0; c1 < gameBoard[r1].length; c1++) {
      if (gameBoard[r1][c1] === null) continue;
      let cellA = { row: r1, col: c1, value: gameBoard[r1][c1] };

      for (let r2 = r1; r2 < gameBoard.length; r2++) {
        let startC2 = (r2 === r1) ? c1 + 1 : 0;
        for (let c2 = startC2; c2 < gameBoard[r2].length; c2++) {
          if (gameBoard[r2][c2] === null) continue;
          let cellB = { row: r2, col: c2, value: gameBoard[r2][c2] };
          
          if (canMatch(cellA, cellB, gameBoard)) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

// NEW: showGameOverPopup Function
function showGameOverPopup() {
  if (finalScoreElement) finalScoreElement.textContent = score;
  if (gameOverModalElement) gameOverModalElement.style.display = 'block';
}

// NEW: checkGameOver Function
function checkGameOver() {
  if (!isMovePossible()) {
    gameOver = true;
    showGameOverPopup();
    console.log("Game Over! No more moves possible.");
  }
}

// MODIFIED: checkMatch Function (Original from Part 3, now enhanced)
function checkMatch(cell1, cell2) { // cell1 and cell2 are {row, col, value}
  // Value check (same as in canMatch)
  const valueMatch = (cell1.value === cell2.value) || (cell1.value + cell2.value === 10);
  if (!valueMatch) {
    // console.log("checkMatch: Invalid pair values.", cell1, cell2);
    return false;
  }

  // Path clearance (same logic as in canMatch, using gameBoard directly)
  let pathIsClear = false;
  if (cell1.row === cell2.row) {
    pathIsClear = true;
    for (let c = Math.min(cell1.col, cell2.col) + 1; c < Math.max(cell1.col, cell2.col); c++) {
      if (gameBoard[cell1.row][c] !== null) { pathIsClear = false; break; }
    }
  } else if (cell1.col === cell2.col) {
    pathIsClear = true;
    for (let r = Math.min(cell1.row, cell2.row) + 1; r < Math.max(cell1.row, cell2.row); r++) {
      if (gameBoard[r][cell1.col] !== null) { pathIsClear = false; break; }
    }
  } else if (Math.abs(cell1.row - cell2.row) === Math.abs(cell1.col - cell2.col)) {
    pathIsClear = true;
    const dr = (cell2.row - cell1.row > 0) ? 1 : -1;
    const dc = (cell2.col - cell1.col > 0) ? 1 : -1;
    let currentRow = cell1.row + dr;
    let currentCol = cell1.col + dc;
    while (currentRow !== cell2.row) {
      if (gameBoard[currentRow][currentCol] !== null) { pathIsClear = false; break; }
      currentRow += dr;
      currentCol += dc;
    }
  }
  if (!pathIsClear) { // Special Adjacency if other paths failed
    if ((cell1.col === BOARD_COLS - 1 && cell2.col === 0 && cell1.row + 1 === cell2.row && gameBoard[cell1.row][cell1.col] !== null && gameBoard[cell2.row][cell2.col] !== null) ||
        (cell2.col === BOARD_COLS - 1 && cell1.col === 0 && cell2.row + 1 === cell1.row && gameBoard[cell2.row][cell2.col] !== null && gameBoard[cell1.row][cell1.col] !== null)) {
      pathIsClear = true;
    }
  }

  if (pathIsClear) { // Value and path clear
    console.log("Match successful in checkMatch:", cell1, cell2);
    clearNumbers(cell1, cell2);
    updateScore(10); // Example: 10 points per match
    displayBoard(); // Refresh board after clearing

    if (isBoardEmpty()) {
      console.log("Board is empty, adding new rows.");
      addNewRows(5); // Changed to add 5 new rows instead of NUM_INITIAL_ROWS
      displayBoard(); // Refresh board after adding new rows
    }

    if (!gameOver) { // Only check game over if not already over
      checkGameOver();
    }
    return true;
  } else {
    // console.log("checkMatch: Path not clear.", cell1, cell2);
    return false;
  }
}

// MODIFIED: handleCellClick Function
function handleCellClick(row, col) {
  if (gameOver) return; // Do not process clicks if game is over

  const cellValue = gameBoard[row][col];
  if (cellValue === null) {
    return; // Clicked on an empty cell
  }

  const clickedCellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

  if (!selectedCell) {
    selectedCell = { row, col, value: cellValue };
    if (clickedCellElement) clickedCellElement.classList.add('selected');
  } else {
    const previousSelectedCellElement = document.querySelector(`[data-row="${selectedCell.row}"][data-col="${selectedCell.col}"]`);
    if (previousSelectedCellElement) previousSelectedCellElement.classList.remove('selected');

    if (selectedCell.row === row && selectedCell.col === col) {
      selectedCell = null; // Deselect if same cell clicked again
      return;
    }

    const cell1 = selectedCell; // First selected cell
    const cell2 = { row, col, value: cellValue }; // Currently clicked cell

    checkMatch(cell1, cell2); // Call checkMatch with {row, col, value} objects

    selectedCell = null; // Reset selection
  }
}

// MODIFIED: init() Function
function init() {
  initializeDOMReferences();
  gameOver = false; // Reset game over state
  score = 0;
  selectedCell = null;
  generateBoard();
  displayBoard();

  if (gameOverModalElement) gameOverModalElement.style.display = 'none';
  
  // Ensure event listeners are (re)attached
  if (restartButtonElement && !restartButtonElement.hasAttribute('listenerAttached')) {
    restartButtonElement.addEventListener('click', init);
    restartButtonElement.setAttribute('listenerAttached', 'true');
  }
  if (playAgainButtonElement && !playAgainButtonElement.hasAttribute('listenerAttached')) {
    playAgainButtonElement.addEventListener('click', init);
    playAgainButtonElement.setAttribute('listenerAttached', 'true');
  }
  if (hintButtonElement && !hintButtonElement.hasAttribute('listenerAttached')) {
    hintButtonElement.addEventListener('click', provideHint);
    hintButtonElement.setAttribute('listenerAttached', 'true');
  }
  if (submitScoreButtonElement && !submitScoreButtonElement.hasAttribute('listenerAttached')) {
    submitScoreButtonElement.addEventListener('click', () => {
      if (gameOver) {
        console.log('Submit score clicked. Final Score:', score);
        alert('Submit score functionality is not implemented yet.');
      }
    });
    submitScoreButtonElement.setAttribute('listenerAttached', 'true');
  }
}

// Initial Call
document.addEventListener('DOMContentLoaded', init);
