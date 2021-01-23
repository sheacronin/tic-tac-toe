const gameBoard = (() => {
    const gameBoardEl = document.querySelector('#game-board');
    const array = ['', '', '',
                   '', '', '',
                   '', '', ''];

    const displayMark = (event) => {
        if (game.xsTurn) {
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

    return {
        array,
        render
    }
})();

const game = (() => {
    // Init turn value so x starts.
    let xsTurn = true;
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
                        endGame(value);
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
        endGame('tie');
    }

    const endGame = (result) => {
        messages.declareWinner(result);
    }

    return {
        xsTurn,
        checkIfWinner
    }
})();

const messages = (() => {
    const gameMessage = document.querySelector('#game-message');
    const displayTurn = () => {
        gameMessage.textContent = game.xsTurn ? 'X\'s turn' : 'O\'s turn';
    }
    const declareWinner = (winner) => {
        if (winner === 'tie') {
            gameMessage.textContent = 'It\'s a tie.';
        } else {
            gameMessage.textContent = winner + ' wins!';
        }
    }

    return {
        displayTurn,
        declareWinner
    }
})();

const Player = (value) => {
    const _endTurn = () => {
        game.xsTurn = !game.xsTurn;
        messages.displayTurn();

        game.checkIfWinner(value);
    }
    const markSpot = spot => {
        if (spot.textContent === '') {
            // Change value in array.
            gameBoard.array[spot.dataset.index] = value;
            // Change value in DOM.
            spot.textContent = value;

            _endTurn();
        } else {
            alert('This spot is taken');
        }
    }

    return {value, markSpot}
}

gameBoard.render();

const playerX = Player('X');
const playerO = Player('O');