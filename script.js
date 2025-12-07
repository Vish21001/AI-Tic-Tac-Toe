const cells = document.querySelectorAll(".cell");
const restartBtn = document.getElementById("restart");
const difficultySelect = document.getElementById("difficulty");
const humanScoreEl = document.getElementById("human-score");
const aiScoreEl = document.getElementById("ai-score");

let board = ["", "", "", "", "", "", "", "", ""];
const human = "X";
const ai = "O";
let humanScore = 0;
let aiScore = 0;

// Winning combinations
const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// Add click event to cells
cells.forEach(cell => cell.addEventListener("click", humanTurn));

// Human turn
function humanTurn(e){
    const idx = e.target.dataset.index;
    if(board[idx] === ""){
        board[idx] = human;
        e.target.textContent = human;
        if(checkWin(board, human)){
            alert("You win!");
            humanScore++;
            updateScore();
            return endGame();
        } else if(boardFull()){
            alert("Draw!");
            return endGame();
        }
        aiTurn();
    }
}

// AI turn with difficulty
function aiTurn(){
    let bestSpot;
    const difficulty = difficultySelect.value;
    
    if(difficulty === "easy"){
        let empty = board.map((v,i)=> v===""?i:null).filter(v=>v!==null);
        bestSpot = empty[Math.floor(Math.random() * empty.length)];
    } else if(difficulty === "medium"){
        bestSpot = mediumAI(board);
    } else {
        bestSpot = minimax(board, ai).index;
    }

    board[bestSpot] = ai;
    cells[bestSpot].textContent = ai;

    if(checkWin(board, ai)){
        alert("AI wins!");
        aiScore++;
        updateScore();
        endGame();
    } else if(boardFull()){
        alert("Draw!");
        endGame();
    }
}

// Medium AI logic: block human or random
function mediumAI(bd){
    for(let i=0;i<bd.length;i++){
        if(bd[i]===""){
            bd[i] = human;
            if(checkWin(bd,human)){
                bd[i]="";
                return i; // block human
            }
            bd[i]="";
        }
    }
    // Else pick random
    let empty = bd.map((v,i)=> v===""?i:null).filter(v=>v!==null);
    return empty[Math.floor(Math.random()*empty.length)];
}

// Check for winner
function checkWin(bd, player){
    return winCombos.some(combo => combo.every(i => bd[i] === player));
}

// Check for draw
function boardFull(){
    return board.every(cell => cell !== "");
}

// End game: reset board
function endGame(){
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => cell.textContent = "");
}

// Update score display
function updateScore(){
    humanScoreEl.textContent = humanScore;
    aiScoreEl.textContent = aiScore;
}

// Minimax AI (hard)
function minimax(newBoard, player){
    let availSpots = newBoard.map((v,i)=> v===""?i:null).filter(v=>v!==null);

    if(checkWin(newBoard,human)) return {score:-10};
    else if(checkWin(newBoard,ai)) return {score:10};
    else if(availSpots.length===0) return {score:0};

    let moves = [];
    for(let i=0;i<availSpots.length;i++){
        let move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if(player===ai){
            let result = minimax(newBoard,human);
            move.score = result.score;
        } else {
            let result = minimax(newBoard,ai);
            move.score = result.score;
        }

        newBoard[availSpots[i]]="";
        moves.push(move);
    }

    let bestMove;
    if(player===ai){
        let bestScore = -Infinity;
        moves.forEach(m=>{ if(m.score>bestScore){ bestScore=m.score; bestMove=m; } });
    } else {
        let bestScore = Infinity;
        moves.forEach(m=>{ if(m.score<bestScore){ bestScore=m.score; bestMove=m; } });
    }
    return bestMove;
}

// Restart button
restartBtn.addEventListener("click", () => {
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => cell.textContent = "");
});
