const statusDisplay = document.querySelector('.game--status');

let gameActive = true;
const humanPlayer = "X";
const aiPlayer = "O";
let currentPlayer = humanPlayer;
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningMessage = () => (currentPlayer === humanPlayer ? 'You win' : 'Computer win');
const drawMessage = () => 'Game tie';
const currentPlayerTurn = () => (currentPlayer === humanPlayer ? 'Your turn' : '');

statusDisplay.innerHTML = currentPlayerTurn();

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    for(let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];
        if(a === '' || b === '' || c === '')
            continue;
        if(a === b && b === c) {
            roundWon = true;
            break
        }
    }

    if(roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    const roundDraw = !gameState.includes("");
    if(roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if(gameState[clickedCellIndex] !== "" || !gameActive || currentPlayer !== humanPlayer)
        return;

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    if (gameActive && currentPlayer === aiPlayer) {
        setTimeout(() => {
            computerMove();
        }, 300);
    }
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = humanPlayer;
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}


document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);

function checkWinner(board) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function isBoardFull(board) {
    return !board.includes("");
}

function minimax(board, depth, isMaximizing) {
    const winner = checkWinner(board);
    if (winner === aiPlayer) return 10 - depth;
    if (winner === humanPlayer) return depth - 10;
    if (isBoardFull(board)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = aiPlayer;
                const score = minimax(board, depth + 1, false);
                board[i] = "";
                if (score > bestScore) bestScore = score;
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = humanPlayer;
                const score = minimax(board, depth + 1, true);
                board[i] = "";
                if (score < bestScore) bestScore = score;
            }
        }
        return bestScore;
    }
}

function findBestMove(board) {
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = aiPlayer;
            const score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function computerMove() {
    if (!gameActive || currentPlayer !== aiPlayer) return;
    const bestIndex = findBestMove(gameState.slice());
    if (bestIndex === -1) return;
    const cell = document.querySelector(`[data-cell-index="${bestIndex}"]`);
    handleCellPlayed(cell, bestIndex);
    handleResultValidation();
}
