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
    const xsTurn = true;

    return {
        xsTurn,
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
    const endTurn = () => {
        game.xsTurn = !game.xsTurn;
        messages.displayTurn();
    }
    const markSpot = spot => {
        if (spot.textContent === '') {
            // Change value in array.
            gameBoard.array[spot.dataset.index] = value;
            // Change value in DOM.
            spot.textContent = value;

            endTurn();
        } else {
            alert('This spot is taken');
        }
    }

    return {markSpot, endTurn}
}

gameBoard.render();

const playerX = Player('X');
const playerO = Player('O');