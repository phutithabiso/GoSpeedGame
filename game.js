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
}
