class Game2048 {
    constructor() {
        this.board = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.gameBoard = document.getElementById('game-board');
        this.scoreDisplay = document.getElementById('score');
        this.newGameButton = document.getElementById('new-game');

        this.newGameButton.addEventListener('click', () => this.resetGame());
        document.addEventListener('keydown', this.handleKeyPress.bind(this));

        this.initializeGame();
    }

    initializeGame() {
        this.board = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.scoreDisplay.textContent = this.score;
        this.addRandomTile();
        this.addRandomTile();
        this.renderBoard();
    }

    addRandomTile() {
        const emptyCells = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c] === 0) {
                    emptyCells.push({r, c});
                }
            }
        }

        if (emptyCells.length > 0) {
            const {r, c} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                if (this.board[r][c] !== 0) {
                    tile.textContent = this.board[r][c];
                    tile.classList.add(`tile-${this.board[r][c]}`);
                }
                this.gameBoard.appendChild(tile);
            }
        }
    }

    handleKeyPress(event) {
        const key = event.key;
        let moved = false;

        switch(key) {
            case 'ArrowUp':
                moved = this.moveUp();
                break;
            case 'ArrowDown':
                moved = this.moveDown();
                break;
            case 'ArrowLeft':
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
                moved = this.moveRight();
                break;
        }

        if (moved) {
            this.addRandomTile();
            this.renderBoard();
            this.checkGameStatus();
        }
    }

    moveLeft() {
        let moved = false;
        for (let r = 0; r < 4; r++) {
            const row = this.board[r].filter(val => val !== 0);
            for (let c = 0; c < row.length - 1; c++) {
                if (row[c] === row[c + 1]) {
                    row[c] *= 2;
                    this.score += row[c];
                    row.splice(c + 1, 1);
                    moved = true;
                }
            }
            while (row.length < 4) {
                row.push(0);
            }
            this.board[r] = row;
            if (JSON.stringify(this.board[r]) !== JSON.stringify(row)) moved = true;
        }
        this.scoreDisplay.textContent = this.score;
        return moved;
    }

    moveRight() {
        for (let r = 0; r < 4; r++) {
            this.board[r].reverse();
        }
        const moved = this.moveLeft();
        for (let r = 0; r < 4; r++) {
            this.board[r].reverse();
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let c = 0; c < 4; c++) {
            const column = [];
            for (let r = 0; r < 4; r++) {
                column.push(this.board[r][c]);
            }
            const filteredColumn = column.filter(val => val !== 0);
            for (let i = 0; i < filteredColumn.length - 1; i++) {
                if (filteredColumn[i] === filteredColumn[i + 1]) {
                    filteredColumn[i] *= 2;
                    this.score += filteredColumn[i];
                    filteredColumn.splice(i + 1, 1);
                    moved = true;
                }
            }
            while (filteredColumn.length < 4) {
                filteredColumn.push(0);
            }
            for (let r = 0; r < 4; r++) {
                if (this.board[r][c] !== filteredColumn[r]) moved = true;
                this.board[r][c] = filteredColumn[r];
            }
        }
        this.scoreDisplay.textContent = this.score;
        return moved;
    }

    moveDown() {
        for (let c = 0; c < 4; c++) {
            const column = [];
            for (let r = 0; r < 4; r++) {
                column.push(this.board[r][c]);
            }
            column.reverse();
            const filteredColumn = column.filter(val => val !== 0);
            for (let i = 0; i < filteredColumn.length - 1; i++) {
                if (filteredColumn[i] === filteredColumn[i + 1]) {
                    filteredColumn[i] *= 2;
                    this.score += filteredColumn[i];
                    filteredColumn.splice(i + 1, 1);
                }
            }
            while (filteredColumn.length < 4) {
                filteredColumn.push(0);
            }
            column.splice(0, filteredColumn.length, ...filteredColumn);
            column.reverse();
            for (let r = 0; r < 4; r++) {
                this.board[r][c] = column[r];
            }
        }
        this.scoreDisplay.textContent = this.score;
        return true;
    }

    checkGameStatus() {
        // Check if 2048 is reached
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c] === 2048) {
                    alert('Congratulations! You reached 2048!');
                    return;
                }
            }
        }

        // Check if game is over
        const isBoardFull = this.board.every(row => row.every(cell => cell !== 0));
        const canMove = this.checkIfMovePossible();

        if (isBoardFull && !canMove) {
            alert('Game Over! No more moves possible.');
        }
    }

    checkIfMovePossible() {
        // Check if any adjacent tiles can be merged
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (c < 3 && this.board[r][c] === this.board[r][c + 1]) return true;
                if (r < 3 && this.board[r][c] === this.board[r + 1][c]) return true;
            }
        }
        return false;
    }

    resetGame() {
        this.initializeGame();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});
