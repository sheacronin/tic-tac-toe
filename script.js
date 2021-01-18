const gameBoard = (() => {
    const gameBoardEl = document.querySelector('#game-board');
    const gameBoardArray = ['X', 'X', 'O',
                            'O', 'O', 'X',
                            'X', 'X', 'O'];

    const render = () => {
        gameBoardArray.forEach(value => {
            const valueEl = document.createElement('div');
            valueEl.textContent = value;
            gameBoardEl.appendChild(valueEl);
        });
    }

    return {
        render
    }
})();

const Player = (value) => {
    const markSpot = spot => {
        if (spot.textContent === '') {
            spot.textContent = value;
        } else {
            alert('This spot is taken');
        }
    }

    return {markSpot}
}

gameBoard.render();