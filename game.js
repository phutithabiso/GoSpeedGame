class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.gameOver = false;
        this.paused = false;
        this.car = { x: 0, y: 0, speed: 5, lane: 1, width: 40, height: 60 };
        this.obstacles = [];
        this.lastObstacleTime = 0;
        this.animationFrame = null;

        this.scoreElement = document.getElementById('scoreValue');
        this.highScoreElement = document.getElementById('highScoreValue');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.pauseButton = document.getElementById('pauseButton');
        this.gameMessage = document.getElementById('gameMessage');

        // Initialize the high score display
        this.highScoreElement.textContent = `High Score: ${this.highScore}`;

        // Bind event listeners
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.resetGame());
        this.pauseButton.addEventListener('click', () => this.togglePause());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Define lane lines
        this.laneLines = [];
        this.numLaneLines = 10; // Number of lane lines to fill screen
        this.laneLineHeight = this.canvas.height / this.numLaneLines; // Height of each lane line
        this.laneSpeed = 4; // Speed at which lane lines move
    }

startGame() {
    this.gameStarted = true;
    this.gameOver = false;
    this.score = 0;
    this.scoreElement.textContent = '0';
    this.car = { x: this.canvas.width / 3, y: this.canvas.height - 100, speed: 5, lane: 1, width: 40, height: 60 };
    this.car = { x: 0, y: 0, speed: 5, lane: 1, width: 40, height: 60 };

    this.obstacles = [];
    this.lastObstacleTime = 0;
    this.gameMessage.textContent = 'Use left and right arrow keys to move between lanes';
    this.gameMessage.classList.remove('game-over');
    this.startButton.classList.add('hidden');
    this.restartButton.classList.add('hidden');
    this.pauseButton.classList.remove('hidden');
    this.gameLoop();

    // Initialize lane lines position
    for (let i = 0; i < this.numLaneLines; i++) {
        this.laneLines.push(i * this.laneLineHeight); // Starting positions for lane lines
    }
}
resetGame() {
    this.gameStarted = false;
    this.gameOver = false;
    this.paused = false;
    this.score = 0;
    this.scoreElement.textContent = '0';
    this.car = { x: this.canvas.width / 3, y: this.canvas.height - 100, speed: 5, lane: 1, width: 40, height: 60 };
    this.obstacles = [];
    this.lastObstacleTime = 0;
    this.gameMessage.textContent = 'Use left and right arrow keys to move between lanes';
    this.gameMessage.classList.remove('game-over');
    this.startButton.classList.remove('hidden');
    this.restartButton.classList.add('hidden');
    this.pauseButton.classList.add('hidden');
}
createObstacle() {
    const speedIncrease = Math.min(5, this.score / 1000);
    return {
        lane: Math.floor(Math.random() * 3),
        y: -50,
        speed: 3 + speedIncrease + Math.random() * 2
    };
}
handleKeyPress(e) {
    if (!this.gameStarted || this.gameOver || this.paused) return;

    if (e.key === 'ArrowLeft' && this.car.lane > 0) {
        this.car.lane--;
    } else if (e.key === 'ArrowRight' && this.car.lane < 2) {
        this.car.lane++;
    }
}
drawCar(x, y, color, windowColor) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, this.car.width, this.car.height);

    this.ctx.fillStyle = windowColor;
    this.ctx.fillRect(x + 5, y + 10, 30, 20);

    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(x - 3, y + 5, 6, 15);
    this.ctx.fillRect(x + this.car.width - 3, y + 5, 6, 15);
    this.ctx.fillRect(x - 3, y + this.car.height - 20, 6, 15);
    this.ctx.fillRect(x + this.car.width - 3, y + this.car.height - 20, 6, 15);
}
togglePause() {
    if (this.gameOver || !this.gameStarted) return;

    this.paused = !this.paused;

    if (this.paused) {
        cancelAnimationFrame(this.animationFrame);
        this.pauseButton.textContent = 'Resume';
    } else {
        this.pauseButton.textContent = 'Pause';
        this.gameLoop();
    }
}

}