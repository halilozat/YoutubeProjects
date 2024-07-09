const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
let snake = [
    { x: gridSize * 5, y: gridSize * 5 }
];
let direction = { x: 0, y: 0 };
let food = getRandomFoodPosition();
let score = 0;
let maxScore = localStorage.getItem("maxScore") || 0; // Local Storage'dan maxScore'u al, yoksa 0 olarak ayarla
let gameLoopInterval;
let isPaused = false;

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

document.addEventListener("keydown", handleKeydown);
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("resumeButton").addEventListener("click", resumeGame);

const gameMusic = document.getElementById("gameMusic");

function startGame() {
    document.getElementById("startButton").disabled = true;
    resetGame();
    gameMusic.play();
    gameLoopInterval = setInterval(gameLoop, 100);
}

function resumeGame() {
    isPaused = false;
    document.getElementById("resumeButton").style.display = "none";
    gameLoopInterval = setInterval(gameLoop, 100);
}

function handleKeydown(event) {
    const key = event.keyCode;
    if (key === 32) { // Space bar
        if (isPaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    } else if (key === 37 && direction.x === 0) {
        direction = { x: -gridSize, y: 0 };
    } else if (key === 38 && direction.y === 0) {
        direction = { x: 0, y: -gridSize };
    } else if (key === 39 && direction.x === 0) {
        direction = { x: gridSize, y: 0 };
    } else if (key === 40 && direction.y === 0) {
        direction = { x: 0, y: gridSize };
    }
}

function pauseGame() {
    isPaused = true;
    clearInterval(gameLoopInterval);
    document.getElementById("resumeButton").style.display = "inline";
}

function gameLoop() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x === food.x && head.y === food.y) {
        food = getRandomFoodPosition();
        score++;
        document.getElementById("score").textContent = score;
    } else {
        snake.pop();
    }

    snake.unshift(head);

    if (
        head.x < 0 || head.y < 0 ||
        head.x >= canvas.width || head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        endGame();
    }

    if (score > maxScore) {
        maxScore = score;
        localStorage.setItem("maxScore", maxScore);
    }

    drawEverything();
}

function drawEverything() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = "green";
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Draw head (half-circle)
            ctx.beginPath();
            ctx.arc(segment.x + gridSize / 2, segment.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (index === snake.length - 1) {
            // Draw tail (half-circle)
            ctx.beginPath();
            ctx.arc(segment.x + gridSize / 2, segment.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Draw body (rectangle with rounded corners)
            ctx.beginPath();
            ctx.moveTo(segment.x, segment.y);
            ctx.arcTo(segment.x + gridSize, segment.y, segment.x + gridSize, segment.y + gridSize, 10);
            ctx.arcTo(segment.x + gridSize, segment.y + gridSize, segment.x, segment.y + gridSize, 10);
            ctx.arcTo(segment.x, segment.y + gridSize, segment.x, segment.y, 10);
            ctx.arcTo(segment.x, segment.y, segment.x + gridSize, segment.y, 10);
            ctx.fill();
        }
    });

    // Draw food
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw max score
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Max Skor: ${maxScore}`, 10, 30);
}

function getRandomFoodPosition() {
    return {
        x: Math.floor(Math.random() * canvas.width / gridSize) * gridSize,
        y: Math.floor(Math.random() * canvas.height / gridSize) * gridSize
    };
}

function resetGame() {
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = { x: 0, y: 0 };
    score = 0;
    document.getElementById("score").textContent = score;
}

function endGame() {
    clearInterval(gameLoopInterval);
    gameMusic.pause();
    gameMusic.currentTime = 0;
    document.getElementById("startButton").disabled = false;
}
