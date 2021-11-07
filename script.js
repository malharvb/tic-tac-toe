let cells = document.querySelectorAll('.cell')

function player()
{
    let input = 'X';
    let score = 0;
    
    return {input, score}
}

let player1 = player();

let gameBoard = (function (){

    let gameState = [0,1,2,3,4,5,6,7,8];
    let input = (playerInput, pos) => {
        gameState[pos] = playerInput;
    }
    let checkTie = () => {
        if(AI.emptyIndexies(gameBoard.gameState).length == 0)
        {
            displayController.result.innerHTML = 'Tie';
            displayController.displayScore();
            resetBoard();
        }

    }
    let checkWin = (inputVal) => {
        if(_checkRows(gameBoard.gameState, inputVal) || _checkCol(gameBoard.gameState, inputVal) || _checkDia(gameBoard.gameState, inputVal))
        {    
            return true;
        }
        else
        {
            return false
        }  
        
    }
    let _checkRows = (arr, inputVal) => {
        

        for(let i = 0; i < arr.length; i+=3)
        {
            if(arr[i] === inputVal && arr[i+1] === inputVal && arr[i+2] === inputVal)
                return true;
        }
        
    };
    let _checkCol = (arr, inputVal) => {
        

        for(let i = 0; i < 3; i++)
        {
            if(arr[i] === inputVal && arr[i+3] === inputVal && arr[i+6] === inputVal)
                return true;
        }
        
        
    };
    let _checkDia = (arr, inputVal) => {
        
        if(arr[0] === inputVal && arr[4] === inputVal && arr[8] === inputVal)
            return true;
        else if(arr[2] === inputVal && arr[4] === inputVal && arr[6] === inputVal)
            return true;
        
        
    };

    let resetBoard = () => {
        
        
        setTimeout(() => {cells.forEach(cell => cell.innerHTML = ''); gameBoard.gameState = [0,1,2,3,4,5,6,7,8]}, 300)
        
    }
    return {input, checkWin, resetBoard, checkTie, gameState}

})()

let AI = (function (doc) {

    let input = 'O';
    let score = 0;
    function emptyIndexies(arr){
        return  arr.filter(s => s != "O" && s != "X");
    }
    let Easy = () => {
        
        let availSpots = emptyIndexies(gameBoard.gameState)

        let x = availSpots[Math.floor(Math.random() * availSpots.length)]
        printFn(x);
        
        
    }

    let minimax = (player) => {
        //I have taken a lot of code references from the FCC minimax article
        let availSpots = emptyIndexies(gameBoard.gameState);

        if(gameBoard.checkWin(player1.input))
        {
            return {score:-10};
        }
        else if(gameBoard.checkWin(AI.input))
        {
           return {score:10};
        }
        else if (availSpots.length === 0)
        {
            return {score:0};
        }
        let moves = [];

        // loop through available spots
        for (let i = 0; i < availSpots.length; i++){
            //create an object for each and store the index of that spot 
            let move = {};
  	        move.index = gameBoard.gameState[availSpots[i]];

            // set the empty spot to the current player
            gameBoard.gameState[availSpots[i]] = player;

            /*collect the score resulted from calling minimax 
            on the opponent of the current player*/
            if (player == AI.input){
                var result = minimax(player1.input);
                move.score = result.score;
            }
            else{
                var result = minimax(AI.input);
                move.score = result.score;
            }

            // reset the spot to empty
            gameBoard.gameState[availSpots[i]] = move.index;

            // push the object to the array
            moves.push(move);
        }

        let bestMove;
        if(player === AI.input)
        {
            let bestScore = -10000;
            for(let i = 0; i < moves.length; i++)
            {
                if(moves[i].score > bestScore)
                {
                bestScore = moves[i].score;
                bestMove = i;
                }
            }
        }
        else
        {
            let bestScore = 10000;
            for(let i = 0; i < moves.length; i++)
            {
                if(moves[i].score < bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
    
        return moves[bestMove];
        
    }

    let printFn = (x) => {
        gameBoard.gameState[x] = 'O'
        let input = doc.querySelector('#c' + x)
        input.innerHTML = 'O'
    }
    return {Easy, minimax, printFn, emptyIndexies, input, score}
})(document)

let displayController = (function (doc) {


    let diff = 0;
    let flag = 0;
    let result = doc.querySelector('#result');
    let score = doc.querySelector('#score')

    let change = function () {
        
        cells.forEach(cell => cell.addEventListener('click', () => {
        if(cell.innerHTML == '' || (cell.innerHTML != 'X' && cell.innerHTML != 'O'))
        {
            
            cell.innerHTML = player1.input;
            gameBoard.gameState[cell.id[1]] = player1.input;
            if(gameBoard.checkWin(player1.input))
            {
                result.innerHTML = 'Player won last round'
                gameBoard.resetBoard();
                player1.score++;
                flag++;
                displayScore();
            }
            if(flag == 0)
            {
                gameBoard.checkTie();
                if (diff == 0)
                {
                    AI.Easy();
                }
                else if(diff == 1)
                {
                    let bestMove = AI.minimax(AI.input);
                    if(bestMove.index != undefined)
                    {
                        AI.printFn(bestMove.index);
                    }
                }
            }

            if(gameBoard.checkWin(AI.input))
            {
                result.innerHTML = 'AI won last round'
                gameBoard.resetBoard();
                AI.score++;
                displayScore();
            }
            
            flag = 0;
        
            
        }

        

        }));
    }
    let dropDwn = doc.querySelector('#diff')

    dropDwn.addEventListener('change', (e) => {
    
        if(e.target.value == 'easy')
        {
            diff = 0;
        }
        else if(e.target.value == 'hard')
        {
            diff = 1;
        }
        gameBoard.resetBoard();
    })


    let displayScore = () => {

        score.innerHTML= `Player : ${player1.score}                              AI : ${AI.score}`

    }
    return {change, displayScore, result, flag}

    
})(document)

displayController.change()
