const board = document.getElementById("gameBoard")
const gridSize = 20;
const gameOver = document.getElementById("gameOver")
const instruction = document.getElementById("instruction")
const score = document.getElementById("score")
const highScoreText = document.getElementById("highScore")

let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let hasPlayed = false;

function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

function drawSnake() {
    snake.forEach((segment) => {
        const snakeEl = createGameElement("div", "snake");
        setPosition(snakeEl, segment)
        board.appendChild(snakeEl)
    });
}

function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

function drawFood() {
    if (gameStarted) {
        const foodEl = createGameElement("div", "food")
        setPosition(foodEl, food)
        board.appendChild(foodEl)
    }
}

function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * gridSize) + 1,
            y: Math.floor(Math.random() * gridSize) + 1
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

function move() {
    const head = { ...snake[0] }
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }
    else {
        snake.pop();
    }
}

function startGame() {
    gameStarted = true;
    instruction.style.display = "none";
    gameOver.style.display = "none";

    if (hasPlayed) {
        gameOver.style.display = "none";
    }

    hasPlayed = true;

    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay)
}

function handleKeypress(event) {
    if (!gameStarted && event.code === "Space") {
        startGame();
    }
    else {
        switch (event.key) {
            case "ArrowUp":
                if (direction !== "down") direction = "up";
                break;
            case "ArrowDown":
                if (direction !== "up") direction = "down";
                break;
            case "ArrowLeft":
                if (direction !== "right") direction = "left";
                break;
            case "ArrowRight":
                if (direction !== "left") direction = "right";
                break;
        }
    }
}

document.addEventListener("keydown", handleKeypress);

function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    }
    else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    }
    else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    }
    else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 1 || head.x > gridSize ||
        head.y < 1 || head.y > gridSize) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    clearInterval(gameInterval);
    updateScore();
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10 }]
    food = generateFood();
    direction = "right"
    gameSpeedDelay = 200;
    gameStarted = false;
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, "0");
}

function stopGame() {
    clearInterval(gameInterval);
    instruction.style.display = "block";
    gameOver.style.display = "block";

    if (hasPlayed) {
        gameOver.style.display = "block";
        instruction.style.padding = 0;
    }
}

function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, "0")
    }
    highScoreText.style.display = "block"
}