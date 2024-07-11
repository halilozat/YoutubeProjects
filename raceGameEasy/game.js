const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const carWidth = 50;
const carHeight = 100;
let carX = canvas.width / 2 - carWidth / 2;
let carY = canvas.height - carHeight - 10;
const carSpeed = 5;

const obstacles = [];
const obstacleWidth = 50;
const obstacleHeight = 100;
const obstacleSpeed = 5;

const roadWidth = 300;
const laneMarkWidth = 10;
const laneMarkHeight = 50;
const laneMarkSpacing = 100;

let laneMarks = [];

let keys = {};

let score = 0;
const scoreboard = document.getElementById("scoreboard");
const gameOverText = document.getElementById("gameOver");
const restartButton = document.getElementById("restartButton");

// Araba resimleri
const playerCarImage = new Image();
const enemyCarImage = new Image();
playerCarImage.src = 'playerCar.png';
enemyCarImage.src = 'enemyCar.png';

// Yol grafiği
const roadTexture = new Image();
roadTexture.src = 'roadTexture.jpg';  // İndirilen yol grafiği

function createLaneMarks() {
    for (let i = 0; i < canvas.height; i += laneMarkHeight + laneMarkSpacing) {
        laneMarks.push(i);
    }
}

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function drawCar(image, x, y) {
    ctx.drawImage(image, x, y, carWidth, carHeight);
}

function createObstacle() {
    const x = canvas.width / 2 - roadWidth / 2 + Math.random() * (roadWidth - obstacleWidth);
    obstacles.push({ x, y: 0, passed: false });
}

function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        drawCar(enemyCarImage, obstacle.x, obstacle.y);
        obstacle.y += obstacleSpeed;

        if (obstacle.y > carY && !obstacle.passed) {
            score++;
            obstacle.passed = true;
            updateScore();
        }

        if (obstacle.y > canvas.height) {
            obstacles.splice(i, 1);
            i--;
        }

        if (collision(carX, carY, carWidth, carHeight, obstacle.x, obstacle.y, obstacleWidth, obstacleHeight)) {
            endGame();
        }
    }
}

function drawRoad() {
    const roadX = canvas.width / 2 - roadWidth / 2;

    // Yol dokusunu tam sığdır
    ctx.drawImage(roadTexture, roadX, 0, roadWidth, canvas.height);

    for (let i = 0; i < laneMarks.length; i++) {
        const y = laneMarks[i];
        ctx.fillRect(canvas.width / 2 - laneMarkWidth / 2, y, laneMarkWidth, laneMarkHeight);
        laneMarks[i] += obstacleSpeed;
        if (laneMarks[i] > canvas.height) {
            laneMarks[i] = -laneMarkHeight;
        }
    }
}


function collision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           y1 + h1 > y2;
}

function updateScore() {
    scoreboard.innerText = `Score: ${score}`;
}

function endGame() {
    gameOverText.style.display = "block";
    restartButton.style.display = "block";
    cancelAnimationFrame(animationFrameId);
}

function restartGame() {
    score = 0;
    updateScore();
    carX = canvas.width / 2 - carWidth / 2;
    carY = canvas.height - carHeight - 10;
    obstacles.length = 0;
    laneMarks.length = 0;
    createLaneMarks();
    gameOverText.style.display = "none";
    restartButton.style.display = "none";
    update();
}

let animationFrameId;
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (keys["ArrowLeft"] && carX > canvas.width / 2 - roadWidth / 2) {
        carX -= carSpeed;
    }
    if (keys["ArrowRight"] && carX < canvas.width / 2 + roadWidth / 2 - carWidth) {
        carX += carSpeed;
    }
    if (keys["ArrowUp"] && carY > 0) {
        carY -= carSpeed;
    }
    if (keys["ArrowDown"] && carY < canvas.height - carHeight) {
        carY += carSpeed;
    }

    drawRoad();
    drawCar(playerCarImage, carX, carY);
    drawObstacles();

    animationFrameId = requestAnimationFrame(update);
}

createLaneMarks();
setInterval(createObstacle, 2000);
update();
