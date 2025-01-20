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

    gameLoop(timestamp) {
        if (!this.gameStarted || this.gameOver || this.paused) return;

        if (!this.lastObstacleTime || timestamp - this.lastObstacleTime > 1500) {
            this.obstacles.push(this.createObstacle());
            this.lastObstacleTime = timestamp;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = '#fff';
        this.ctx.setLineDash([20, 20]);

        // Increase the speed of the lane lines as score increases
        const laneSpeedIncrease = Math.min(6, this.score / 100); // Max speed increase

        // Move lane lines downward and wrap them around
        for (let i = 0; i < this.laneLines.length; i++) {
            this.laneLines[i] += this.laneSpeed + laneSpeedIncrease;

            // If the lane line is off the bottom, reset it to the top
            if (this.laneLines[i] > this.canvas.height) {
                this.laneLines[i] = -this.laneLineHeight;
            }

            // Draw each lane line
            this.ctx.beginPath();
            this.ctx.moveTo(this.canvas.width / 3, this.laneLines[i]);
            this.ctx.lineTo(this.canvas.width / 3, this.laneLines[i] + this.laneLineHeight);
            this.ctx.moveTo((this.canvas.width / 3) * 2, this.laneLines[i]);
            this.ctx.lineTo((this.canvas.width / 3) * 2, this.laneLines[i] + this.laneLineHeight);
            this.ctx.stroke();
        }

        // Increase car's speed based on score
        this.car.speed = 5 + Math.min(10, this.score / 100);

        // Gradually increase car's Y-position based on score
        const carY = this.canvas.height - 100 - Math.min(200, this.score); // Max 200px lift
        let collision = false;

        this.obstacles = this.obstacles.filter(obstacle => {
            obstacle.y += obstacle.speed;

            if (
                obstacle.lane === this.car.lane &&
                obstacle.y + 40 > carY &&
                obstacle.y < carY + 60
            ) {
                collision = true;
            }

            const x = (this.canvas.width / 3) * obstacle.lane + 20;
            this.drawCar(x, obstacle.y, '#ff0000', '#990000');

            return obstacle.y < this.canvas.height;
        });

        if (collision) {
            this.gameOver = true;
            this.gameMessage.textContent = `Game Over! Score: ${this.score}`;
            this.gameMessage.classList.add('game-over');
            this.restartButton.classList.remove('hidden');
            this.pauseButton.classList.add('hidden');

            // Check and update high score
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('highScore', this.highScore);  // Save to localStorage
            }

            this.highScoreElement.textContent = `High Score: ${this.highScore}`;
            return;
        }

        const playerX = (this.canvas.width / 3) * this.car.lane + 20;
        this.drawCar(playerX, carY, '#4CAF50', '#2E7D32');

        this.score++;
        this.scoreElement.textContent = this.score;

        this.animationFrame = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
}

// Initialize game when the page loads
window.addEventListener('load', () => {
    new Game();
});
