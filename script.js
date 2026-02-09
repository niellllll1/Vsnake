const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOverScreen");

const box = 20; 
let score, gameActive, gameStarted, snake, d, gameLoop, foodItems;

function init() {
    score = 0;
    scoreElement.innerHTML = score;
    gameActive = true;
    gameStarted = false;
    snake = [{ x: 8 * box, y: 8 * box }];
    d = null;
    foodItems = [getRandomPos(), getRandomPos()]; // 2 random apples
    gameOverScreen.classList.add("hidden");
    if(gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(draw, 140);
}

function getRandomPos() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function setDirection(newDir) {
    if (!gameActive) return;
    gameStarted = true;
    if(newDir == "LEFT" && d != "RIGHT") d = "LEFT";
    else if(newDir == "UP" && d != "DOWN") d = "UP";
    else if(newDir == "RIGHT" && d != "LEFT") d = "RIGHT";
    else if(newDir == "DOWN" && d != "UP") d = "DOWN";
}

document.addEventListener("keydown", (e) => {
    const keys = { 37: "LEFT", 38: "UP", 39: "RIGHT", 40: "DOWN" };
    if (keys[e.keyCode]) setDirection(keys[e.keyCode]);
});

function draw() {
    if (!gameActive) return;
    ctx.fillStyle = "#16213e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Apples
    ctx.fillStyle = "#ff4d4d";
    foodItems.forEach(item => ctx.fillRect(item.x, item.y, box, box));

    // Draw Snake
    snake.forEach((part, i) => {
        ctx.fillStyle = (i == 0) ? "#4ecca3" : "#45b293";
        ctx.fillRect(part.x, part.y, box, box);
    });

    if (!gameStarted) {
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "16px Arial";
        ctx.fillText("TAP ARROWS TO START", canvas.width/2, canvas.height/2);
        return;
    }

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if(d == "LEFT") snakeX -= box;
    if(d == "UP") snakeY -= box;
    if(d == "RIGHT") snakeX += box;
    if(d == "DOWN") snakeY += box;

    // Wall Warp
    if (snakeX < 0) snakeX = canvas.width - box;
    else if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box;
    else if (snakeY >= canvas.height) snakeY = 0;

    let newHead = { x: snakeX, y: snakeY };

    // Self-Collision
    if (snake.some((p, i) => i !== 0 && p.x === snakeX && p.y === snakeY)) {
        gameActive = false;
        clearInterval(gameLoop);
        gameOverScreen.classList.remove("hidden");
        return;
    }

    // Eat Apple Logic
    let ateFood = false;
    for(let i = 0; i < foodItems.length; i++) {
        if(snakeX === foodItems[i].x && snakeY === foodItems[i].y) {
            score++;
            scoreElement.innerHTML = score;
            if (score >= 4) {
                clearInterval(gameLoop);
                window.location.href = "Vpage.html";
                return;
            }
            foodItems[i] = getRandomPos();
            ateFood = true;
            break; 
        }
    }

    if(!ateFood) snake.pop();
    snake.unshift(newHead);
}

function resetGame() { init(); }
init();
