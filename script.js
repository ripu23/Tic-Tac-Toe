var origBoard;
const huPlayer = '0';
const aiPlayer = 'X';
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8]
]

const cells = document.querySelectorAll('.cell'); //to select all the rows with class cell
startGame();

function startGame() { 

    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());// creates an array with values intialized from 0-9
    for( var i = 0; i < cells.length; i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
    
}

function turnClick (square) {
    if(typeof origBoard[square.target.id] == 'number'){//so that same cell is not played more than once
        console.log(square.target.id);
        turn(square.target.id, huPlayer);
        if(!checkTie() && !checkWon(origBoard, huPlayer)){
            turn(aiMove(), aiPlayer);
        }
    }
    
}

function emptySquares() {
    return origBoard.filter(item => typeof(item) == 'number');
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
    
}

function checkTie() {
    if(emptySquares().length == 0) {
        for(let i = 0;i < cells.length; i++){
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie");
        return true;
    }
    
    return false;
}


function aiMove() {
    return minimax(origBoard, aiPlayer).index;
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gamewon = checkWon(origBoard, player);
    if(gamewon){
        gameover(gamewon);
    }
}

function checkWon(board, player) {
    let plays = board.reduce((a, e, i) => 
                (e === player) ? a.concat(i) : a, []);
    //for the above code, it basically returns an array of id of cells 
    //in which the corresponding player has played
    //a == accumulator, e == element that is being traversed, i == index of the cell
    
    let gameWon = null;
    for(let [index, win] of winCombos.entries()){
        
        if(win.every(elem => plays.indexOf(elem) > -1)){ 
            gameWon = {index : index, player : player};
            break;
        }
    }
    return gameWon;
                
}

function gameover(gameWon) {
    for(let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = 
        (gameWon.player == huPlayer) ? "blue" : "red";
    }
    
    for(let i = 0; i < cells.length ; i++){
        document.getElementById(cells[i].removeEventListener('click', turnClick, false));
    }
    declareWinner(gameWon.player == huPlayer? 'You Win!' : 'You Lose!');
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWon(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWon(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
