// Module to help all modules communicate.
const events = {
    events: {},
    on: function(eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },
    off: function(eventName, fn) {
        if (this.events[eventName]) {
            for (let i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    },
    emit: function(eventName, data){
        console.log(eventName + ' was emitted');
        if (this.events[eventName]) {
            this.events[eventName].forEach(fn => fn(data));
        }
    }
}

// Module for the game board object.
const gameBoard = (() => {
    const gameBoardEl = document.querySelector('#game-board');

    const showGameBoard = () => {
        gameBoardEl.style.removeProperty('display');
    }

    events.on('playersReady', showGameBoard);

    const array = ['', '', '',
                   '', '', '',
                   '', '', ''];

    const displayMark = (event) => {
        if (game.getWhoseTurn() === 'X') {
            playerX.markSpot(event.target);
        } else {
            playerO.markSpot(event.target);
        }
    }

    const render = () => {
        let i = 0;
        array.forEach(value => {
            const spot = document.createElement('div');
            spot.textContent = value;
            spot.dataset.index = i;
            // // Add listener to emit spotClicked event when spot is clicked.
            // spot.addEventListener('click', e => events.emit('spotClicked', e.target));
            spot.addEventListener('click', displayMark);

            // Check which spot to add border styles.
            if (i === 1 || i === 7) {
                spot.classList.add('ver-middle-spot');
            } else if (i === 4) {
                spot.classList.add('middle-spot');
            } else if (i === 3 || i === 5) {
                spot.classList.add('hor-middle-spot');
            }

            gameBoardEl.appendChild(spot);

            i++;
        });
    }

    const disableBoard = () => {
        gameBoardEl.childNodes.forEach(spot => {
            spot.removeEventListener('click', displayMark);
        });

        gameBoardEl.classList.add('game-over');
    }

    return {
        array,
        render,
        disableBoard
    }
})();

// Module to control the flow of the game.
const game = (() => {
    // Init turn value so x starts.
    let whoseTurn = 'X';

    const getWhoseTurn = () => {
        return whoseTurn;
    }

    const switchTurn = () => {
        console.log(whoseTurn + '\'s turn ended');
        if (whoseTurn === 'X') {
            whoseTurn = 'O';
        } else {
            whoseTurn = 'X';
        }
        console.log(whoseTurn + '\'s turn now');
    }

    // Bind to turnEnded event.
    events.on('turnEnded', switchTurn);

    const checkIfWinner = (value) => {
        console.log('Checking if ' + value + ' is a winner...');
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

        for (let i = 0; i < winningConditions.length; i++) {
            const line = winningConditions[i]; 
            for (let j = 0; j < line.length; j++) {
                if (gameBoard.array[line[j]] === value) {
                    if (j === 2) { // All three indexes match.
                        console.log(value + ' wins!');
                        _endGame(value);
                        return true;
                    }
                    continue;
                } else {
                    break;
                }
            }
        }

        checkIfTie();
        console.log('No winner.');
    }

    const checkIfTie = () => {
        for (let i = 0; i < gameBoard.array.length; i++) {
            if (gameBoard.array[i] === '') {
                return false;
            }
        }
        // If loops through all values and none are left empty:
        _endGame('tie');
    }

    const _endGame = (result) => {
        messages.declareWinner(result);
        // Disable board from being interacted with.
        gameBoard.disableBoard();

        messages.addRestartBtn();

    }

    return {
        checkIfWinner,
        getWhoseTurn
    }
})();

// Module for the status messages above the game board.
const messages = (() => {
    const gameMessage = document.querySelector('#game-message');

    const displayTurn = (value) => {
        // Display name based on player value.
        gameMessage.textContent = value === 'X' ? 'O\'s turn' : 'X\'s turn';
    }

    const declareWinner = (winner) => {
        if (winner === 'tie') {
            gameMessage.textContent = 'It\'s a tie.';
        } else {
            gameMessage.textContent = winner + ' wins!';
        }
    }
    // Bind displayTurn to turnEnded event.
    events.on('turnEnded', displayTurn);

    const addRestartBtn = () => {
        const restartBtn = document.createElement('button');
        restartBtn.textContent = 'RESTART';
        gameMessage.appendChild(restartBtn);
    }

    return {
        displayTurn,
        declareWinner,
        addRestartBtn
    }
})();

// Factory for Player objects.
const Player = (value, name) => {
    // let myTurn = value === 'X' ? true : false;

    const _endTurn = () => {
        // Emit event to mediator.
        events.emit('turnEnded', value);
        // messages.displayTurn();

        // game.checkIfWinner(value);
    }

    // const switchTurn = () => {
    //     myTurn = !myTurn;
    // }

    // events.on('turnEnded', switchTurn);

    const markSpot = spot => {
        console.log(value + ' trying to mark...')
        if (game.getWhoseTurn() === value) { // Check if it's your turn.
              if (spot.textContent === '') {
                // Change value in array.
                gameBoard.array[spot.dataset.index] = value;
                // Change value in DOM.
                spot.textContent = value;

                _endTurn();
            } else {
                alert('This spot is taken');
            }
        } else {
            console.log('Not your turn, ' + value);
        }
    }

    // // Bind to spotClicked event.
    // events.on('spotClicked', markSpot);

    return {value, name, markSpot}
}

// Set up Player variables to be defined in config.
// This is not ideal!! Global variables.
let playerX;
let playerO;

// Module for setting up game.
const config = (() => {

    const disableInput = (e) => {
        const inputEl = e.target.previousElementSibling;
        inputEl.disabled = true;
        const btnEl = e.target;
        btnEl.disabled = true;
    }

    const showPlayerReady = (e) => {
        const readyP = document.createElement('p');
        readyP.textContent = 'Player ready!';
        readyP.classList.add('player-ready');

        const parentEl = e.target.parentElement;
        parentEl.appendChild(readyP);
    }

    const createPlayer = (e) => {
        const name = e.target.previousElementSibling.value;
        // Grab dataset value attribute.
        const value =  e.target.dataset.value;

        if (value === 'X') {
            playerX = Player(value, name);
        } else {
            playerO = Player(value, name);
        }
    }

    const nameBtns = document.querySelectorAll('.name-btn');

    const switchToGameBoard = () => {
        // if both name buttons are disabled
        if (nameBtns[0].disabled && nameBtns[1].disabled) {
            console.log('both buttons disabled.');
            // then hide these inputs
            const gameSetup = document.getElementById('game-setup');
            gameSetup.style.display = 'none';
            // and show gameboard
            events.emit('playersReady');
        }
    }

    nameBtns.forEach(btn => {
        btn.addEventListener('click', disableInput);
        btn.addEventListener('click', showPlayerReady);
        btn.addEventListener('click', createPlayer);
        btn.addEventListener('click', switchToGameBoard);
    });

    // Return player objects??
})();

// Render game board on page load.
gameBoard.render();