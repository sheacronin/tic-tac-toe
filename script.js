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

        winningConditions.forEach(line => {
            for (let i = 0; i < line.length; i++) {
                if (gameBoard.array[line[i]] === value) {
                    if (i === 2) { // All three indexes match.
                        console.log(value + ' wins!');
                        return;
                    }
                    continue;
                } else {
                    break;
                }
                // if (gameBoard.array[line[i]] !== value) {
                //     break;
                // } 
                // i++;
                // if (gameBoard.array[line[i]] !== value) {
                //     break;
                // } 
                // i++;
                // if (gameBoard.array[line[i]] !== value) {
                //     break;
                // } 
                // console.log(value + ' wins!');
            }
        });

        console.log('No winner yet.');
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

    return {
        displayTurn
    }
})();

const Player = (value) => {
    const _endTurn = () => {
        game.xsTurn = !game.xsTurn;
        messages.displayTurn();
    }
    const markSpot = spot => {
        if (spot.textContent === '') {
            // Change value in array.
            gameBoard.array[spot.dataset.index] = value;
            // Change value in DOM.
            spot.textContent = value;

            game.checkIfWinner(value);
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