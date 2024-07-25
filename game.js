// game.js
const board = document.getElementById('board');
const currentPlayerElement = document.getElementById('currentPlayer');
const resetButton = document.getElementById('resetButton');

const boardSize = 15;
const cellSize = 40;

function createBoard() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    const cell = event.target;
    if (cell.firstChild) return; // Cell already has a piece.
    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);

    const piece = document.createElement('div');
    piece.classList.add(currentPlayer === 1 ? 'black-piece' : 'white-piece');
    cell.appendChild(piece);

    if (checkWin(row, col)) {
        alert(`Player ${currentPlayer} wins!`);
        resetGame();
    } else {
        currentPlayer = 3 - currentPlayer;
        currentPlayerElement.textContent = currentPlayer === 1 ? '黑棋' : '白棋';
        aiMakeMove(); // AI makes a move after the player.
    }
}

let currentPlayer = 1; // 1 for black, 2 for white
createBoard();

function checkWin(row, col) {
    const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
    for (let [dx, dy] of directions) {
        let count = 1;
        for (let k = 1; k < 5; k++) {
            let x = row + dx * k;
            let y = col + dy * k;
            if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) break;
            if (getCell(x, y).firstChild) count++;
            else break;
        }
        for (let k = 1; k < 5; k++) {
            let x = row - dx * k;
            let y = col - dy * k;
            if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) break;
            if (getCell(x, y).firstChild) count++;
            else break;
        }
        if (count >= 5) return true;
    }
    return false;
}

function getCell(row, col) {
    return document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

function aiMakeMove() {
    // Simple AI logic
    let bestScore = -Infinity;
    let bestMove = null;
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = getCell(i, j);
            if (!cell.firstChild) { // Check if the cell is empty
                // Simulate placing a piece and evaluating the board
                cell.appendChild(document.createElement('div'));
                const score = evaluateBoard(i, j, currentPlayer); // Pass currentPlayer here
                cell.removeChild(cell.lastChild); // Remove the simulated piece
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = [i, j];
                }
            }
        }
    }

    if (bestMove) {
        const [row, col] = bestMove;
        const cell = getCell(row, col);
        const piece = document.createElement('div');
        piece.classList.add(currentPlayer === 1 ? 'black-piece' : 'white-piece');
        cell.appendChild(piece);
        if (checkWin(row, col)) {
            alert(`Player ${currentPlayer} wins!`);
            resetGame();
        } else {
            currentPlayer = 3 - currentPlayer; // Switch players
            currentPlayerElement.textContent = currentPlayer === 1 ? '黑棋' : '白棋';
        }
    }
}

function evaluateBoard(row, col) {
    const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
    let score = 0;
    for (let [dx, dy] of directions) {
        let count = 1;
        for (let k = 1; k < 5; k++) {
            let x = row + dx * k;
            let y = col + dy * k;
            if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) break;
            if (getCell(x, y).firstChild) count++;
            else break;
        }
        for (let k = 1; k < 5; k++) {
            let x = row - dx * k;
            let y = col - dy * k;
            if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) break;
            if (getCell(x, y).firstChild) count++;
            else break;
        }
        score += count;
    }
    return score;
}

function resetGame() {
    board.innerHTML = '';
    currentPlayer = 1;
    currentPlayerElement.textContent = '黑棋';
    createBoard();
}

resetButton.addEventListener('click', resetGame);