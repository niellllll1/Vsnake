const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

// Local Audio Elements
const eatSound = document.getElementById("eatSound");
const turnSound = document.getElementById("turnSound");
const failSound = document.getElementById("failSound");

const box = 20;
let score, gameActive, gameStarted, snake, d, gameLoop, food;

const TARGET_SCORE = 4;
const REDIRECT_URL = "Vpage.html";

// Mobile browsers require a "warm up" tap to allow audio
function unlockAudio() {
    [eatSound, turnSound, failSound].forEach(s => {
        s.play().then(() => { s.pause(); s.currentTime = 0; }).catch(()=>{});
    });
}

function init() {
    score = 0;
    scoreElement.innerHTML = score;
    gameActive = true;
    gameStarted = false;
    d = null;
    snake = [{ x: 10 * box, y: 10 * box }, { x: 10 * box, y: 11 * box }];
    food = getRandomPos();
    document.getElementById("gameOverScreen").classList.add("hidden");
    if(gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(draw, 140);
}

function getRandomPos() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function draw() {
    if (!gameActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Food (Heart)
    ctx.font = "20px serif";
    ctx.fillText("❤️", food.x, food.y + box - 2);

    // Snake Body
    snake.forEach((part, i) => {
        const isHead = i === 0;
        ctx.fillStyle = isHead ? "#ff758c" : "#ffb3c1";
        ctx.beginPath();
        ctx.roundRect(part.x + 1, part.y + 1, box - 2, box - 2, 8);
        ctx.fill();
        if (isHead) { // Eyes
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(part.x + 6, part.y + 7, 2, 0, Math.PI * 2);
            ctx.arc(part.x + 14, part.y + 7, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    if (!gameStarted) return;

    let sX = snake[0].x;
    let sY = snake[0].y;
    if(d === "UP") sY -= box;
    if(d === "DOWN") sY += box;
    if(d === "LEFT") sX -= box;
    if(d === "RIGHT") sX += box;

    // Screen wrapping
    if (sX < 0) sX = canvas.width - box; else if (sX >= canvas.width) sX = 0;
    if (sY < 0) sY = canvas.height - box; else if (sY >= canvas.height) sY = 0;

    let head = { x: sX, y: sY };

    // Death Check
    if (snake.some(p => p.x === head.x && p.y === head.y)) {
        gameActive = false;
        failSound.play().catch(()=>{}); // Optional local fail sound
        document.getElementById("gameOverScreen").classList.remove("hidden");
        return;
    }

    // Eat Check
    if (sX === food.x && sY === food.y) {
        score++;
        scoreElement.innerHTML = score;
        
        // Play EAT sound
        eatSound.currentTime = 0;
        eatSound.play().catch(()=>{});

        if (score >= TARGET_SCORE) {
            gameActive = false;
            window.location.href = REDIRECT_URL;
            return;
        }
        food = getRandomPos();
    } else {
        snake.pop();
    }
    snake.unshift(head);
}

function setDir(newDir) {
    if (!gameStarted) unlockAudio();
    
    // Play TURN sound only if direction actually changes
    if (d !== newDir) { 
        turnSound.currentTime = 0;
        turnSound.play().catch(()=>{}); 
    }

    gameStarted = true;
    if(newDir === "UP" && d !== "DOWN") d = "UP";
    if(newDir === "DOWN" && d !== "UP") d = "DOWN";
    if(newDir === "LEFT" && d !== "RIGHT") d = "LEFT";
    if(newDir === "RIGHT" && d !== "LEFT") d = "RIGHT";
}

["upBtn", "downBtn", "leftBtn", "rightBtn"].forEach(id => {
    const btn = document.getElementById(id);
    const dir = id.replace("Btn", "").toUpperCase();
    btn.onclick = (e) => { e.preventDefault(); setDir(dir); };
    btn.ontouchstart = (e) => { e.preventDefault(); setDir(dir); };
});

init();
