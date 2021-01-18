const gameBoard = (() => {
    const gameBoardEl = document.querySelector('#game-board');
    const array = ['X', 'X', 'O',
                   'O', 'O', 'X',
                   'X', 'X', 'O'];

    const displayMark = (event) => {
        console.log('You clicked ' + event.target);
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
        render
    }
})();

const Player = (value) => {
    const markSpot = event => {
        const spot = event.target;
        if (spot.textContent === '') {
            // Change value in array.
            gameBoard.array[spot.dataset.index] = value;
            // Change value in DOM.
            spot.textContent = value;
        } else {
            alert('This spot is taken');
        }
    }

    return {markSpot}
}

gameBoard.render();

const playerX = Player('X');
const playerO = Player('O');