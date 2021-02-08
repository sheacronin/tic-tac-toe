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
        // Tell Player obj whose turn it is to mark the spot
        // that was clicked.
        game.getWhoseTurn().markSpot(event.target);
    }

    const render = () => {
        let i = 0;
        array.forEach(item => {
            const spot = document.createElement('div');
            spot.dataset.index = i;

            // Add event listener to run display mark when clicked.
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

    // Trigger disableBoard when the game ends.
    events.on('gameOver', disableBoard);

    const resetBoard = () => {
        // Reset array values to empty strings.
        for (let i = 0; i < array.length; i++) {
            array[i] = '';
        }
    
        gameBoardEl.childNodes.forEach(spot => {
            // Reset text content of spots to empty.
            spot.textContent = '';
            // Remove style classes to reset colors.
            spot.classList.remove('x', 'o');
            // Enable event listeners on the board.
            spot.addEventListener('click', displayMark);
        });
        

    }

    events.on('restart', resetBoard);

    // Render game board on page load.
    render();

    return {
        array
    }
})();

// Factory for Player objects.
const Player = (value, name) => {
    const markSpot = spot => {
        if (game.getWhoseTurn().value === value) { // Check if it's your turn.
              if (spot.textContent === '') {
                // Change value in array.
                gameBoard.array[spot.dataset.index] = value;
                // Change value in DOM.
                spot.textContent = value;
                // Add class style with color.
                spot.classList.add(value.toLowerCase());

                events.emit('spotMarked', game.getWhoseTurn());
            } else {
                alert('This spot is taken');
            }
        } else {
            console.log('Not your turn, ' + name);
        }
    }

    return {value, name, markSpot}
}

// Create an empty array to store the two players.
const players = [];

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
        // Get name typed into input.
        const name = e.target.previousElementSibling.value;
        // Check if no name has been input.
        if (!name) {
            alert('Please enter your name.');
        } else {
            // Grab dataset value attribute.
            const value =  e.target.dataset.value;

            // Push new Player object into players array.
            players.push(Player(value, name));

            // Run DOM functions once player has been created.
            disableInput(e);
            showPlayerReady(e);
        }
    }

    const nameBtns = document.querySelectorAll('.name-btn');

    const switchToGameBoard = () => {
        // if both name buttons are disabled
        if (nameBtns[0].disabled && nameBtns[1].disabled) {
            // then hide these inputs
            const gameSetup = document.getElementById('game-setup');
            gameSetup.style.display = 'none';
            // and show gameboard
            events.emit('playersReady');
        }
    }

    nameBtns.forEach(btn => {
        btn.addEventListener('click', createPlayer);
        btn.addEventListener('click', switchToGameBoard);
    });
})();

// Module to control the flow of the game.
const game = (() => {
    // Init whoseTurn variable.
    let whoseTurn;

    const getWhoseTurn = () => {
        return whoseTurn;
    }

    // Function to change turn value at beginning of game
    // and after the end of each turn.
    const setWhoseTurn = () => {
        if (whoseTurn === players[0]) { // If it was just player1's turn.
            whoseTurn = players[1];
        } else { // If it was player2's turn, OR if whoseTurn is empty (beginning of game).
            whoseTurn = players[0];
        }
    }

    // Bind to turnEnded event.
    events.on('turnEnded', setWhoseTurn);
    // Bind to playersReady event to set init turn to player1.
    events.on('playersReady', setWhoseTurn);
    // Bind to restart of game.
    events.on('restart', setWhoseTurn);

    const checkIfWin = (player) => {
        // Array to store all possible 3-in-a-row game board
        // indexes as arrays.
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

        // Loop through each winning condition.
        for (let i = 0; i < winningConditions.length; i++) {
            const line = winningConditions[i];
            // Loop through each index in the winning condition.
            for (let j = 0; j < line.length; j++) {
                // Check if that game board index matches player's value.
                if (gameBoard.array[line[j]] === player.value) {
                    if (j === 2) { // All three indexes match - 3 in a row.
                        events.emit('gameOver', player);
                        // Stop the rest of the function from running
                        // and return that there is a winner.
                        return true;
                    }
                    continue;
                } else { // If the index doesn't match the player's value,
                         // skip to next possible winning condition.
                    break;
                }
            }
        }
        
        // If no value returned in that loop, there is no winner.
        // Run function to check if there's a tie.
        checkIfTie();
        return false;
    }

    // Bind checkIfWin to run every time a player marks a spot.
    events.on('spotMarked', checkIfWin);

    // Function runs if no winner was found in checkIfWin.
    const checkIfTie = () => {
        // Loop through every spot on the game board.
        for (let i = 0; i < gameBoard.array.length; i++) {
            if (gameBoard.array[i] === '') {
                // There is an empty space, so game continues.
                events.emit('turnEnded');
                return false;
            }
        }
        // If loops through all spots and none are left empty:
        events.emit('gameOver', 'tie');
    }

    return {
        getWhoseTurn
    }
})();

// Module for the status messages above the game board.
const messages = (() => {
    const gameMessage = document.querySelector('#game-message');

    const displayStatus = (result) => {
        // Clear message element.
        gameMessage.textContent = '';

        // Create a strong element to state the player's name.
        const player = game.getWhoseTurn();
        const playerEl = document.createElement('strong');
        // Style the element with player's color.
        playerEl.classList.add(player.value.toLowerCase());
        playerEl.textContent = player.name;
        // Apend player name to message el.
        gameMessage.appendChild(playerEl);


        // Create p element to store rest of message.
        const p = document.createElement('p');
        
        // Check if there is a result argument,
        // meaning that the game has ended.
        if (result) {
            if (result === 'tie') {
                // State the tie result, overriding player el.
                gameMessage.textContent = "It's a tie.";
                // End function b/c we do not need the p element.
                return;
            } else { // There is a winner of the game.
                p.textContent = ' wins!';
            }
        } else { // The game is continuing.
            p.textContent = "'s turn."
        }

        // Append rest of message to message el.
        gameMessage.appendChild(p);
    }

    // Display turn initially at start of game.
    events.on('playersReady', displayStatus);
    // Bind displayTurn to turnEnded event.
    events.on('turnEnded', displayStatus);
    // Bind to end of game.
    events.on('gameOver', displayStatus)
    // Bind to restart of game.
    events.on('restart', displayStatus);

    const addRestartBtn = () => {
        const restartBtn = document.createElement('button');
        restartBtn.id = 'restart-btn';
        restartBtn.textContent = 'RESTART';
        // Emit restart event when button is clicked.
        restartBtn.addEventListener('click', () => events.emit('restart'));
        gameMessage.appendChild(restartBtn);
    }

    // Bind addRestartBtn() to run on game over event.
    events.on('gameOver', addRestartBtn);
})();