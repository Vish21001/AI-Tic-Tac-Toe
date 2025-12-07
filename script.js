const cells = document.querySelectorAll(".cell");
const restartBtn = document.getElementById("restart");
let board = ["", "", "", "", "", "", "", "", ""];
const human = "X";
const ai = "O";

// Winning combinations
const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// Add click event to cells
cells.forEach(cell => cell.addEventListener("click", humanTurn));

function humanTurn(e){
    const idx = e.target.dataset.index;
    if(board[idx] === ""){
        board[idx] = human;
        e.target.textContent = human;
        if(checkWin(board, human)){
            alert("You win!");
            return endGame();
        } else if(boardFull()){
            alert("Draw!");
            return endGame();
        }
        aiTurn();
    }
}

function aiTurn(){
    let bestSpot = minimax(board, ai).index;
    board[bestSpot] = ai;
    cells[bestSpot].textContent = ai;

    if(checkWin(board, ai)){
        alert("AI wins!");
        endGame();
    } else if(boardFull()){
        alert("Draw!");
        endGame();
    }
}

// Check for winner
function checkWin(bd, player){
    return winCombos.some(combo => combo.every(i => bd[i] === player));
}

function boardFull(){
    return board.every(cell => cell !== "");
}

function endGame(){
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => cell.textContent = "");
}

// Minimax algorithm for AI
function minimax(newBoard, player){
    let availSpots = newBoard.map((v,i) => v === "" ? i : null).filter(v => v !== null);

    if(checkWin(newBoard, human)) return {score: -10};
    else if(checkWin(newBoard, ai)) return {score: 10};
    else if(availSpots.length === 0) return {score: 0};

    let moves = [];
    for(let i=0; i<availSpots.length; i++){
        let move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if(player === ai){
            let result = minimax(newBoard, human);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, ai);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if(player === ai){
        let bestScore = -Infinity;
        moves.forEach(m => { if(m.score > bestScore){ bestScore = m.score; bestMove = m; } });
    } else {
        let bestScore = Infinity;
        moves.forEach(m => { if(m.score < bestScore){ bestScore = m.score; bestMove = m; } });
    }
    return bestMove;
}

// Restart button
restartBtn.addEventListener("click", () => {
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => cell.textContent = "");
});
