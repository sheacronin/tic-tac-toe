console.log('Hello!');

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
        })
    }

    return {
        render
    }
})();

gameBoard.render();