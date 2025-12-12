const board = document.querySelector('.board');
const startButton = document.querySelector(".btn-start")
const modal = document.querySelector(".modal")
const startGameModal = document.querySelector(".start-game")
const gameOverModal = document.querySelector(".game-over")
const restartButton = document.querySelector(".btn-restart")
const mobileControlButtons = document.querySelectorAll(".control-btn")

const highScoreElement = document.querySelector("#high-score")
const scoreElement = document.querySelector("#score")
const timeElement = document.querySelector("#Time")

// Dynamic block size based on screen width
function getBlockSize() {
    const width = window.innerWidth;
    if (width < 480) return 30;
    if (width < 768) return 40;
    return 50;
}

let blockHeight = getBlockSize()
let blockWidth = getBlockSize()

let highScore = 0
let score = 0
let gameTime = 0
let timerIntervalId = null

let cols = Math.floor(board.clientWidth / blockWidth);
let rows = Math.floor(board.clientHeight / blockHeight);
let intervalId = null;
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }

const blocks = []
let snake = [
    {
        x: 1, y: 3
    }]

let direction = 'down'
let nextDirection = 'down'

function initializeBoard() {
    // Clear existing blocks
    blocks.length = 0
    board.innerHTML = ''

    // Recalculate block size and grid
    blockHeight = getBlockSize()
    blockWidth = getBlockSize()
    cols = Math.floor(board.clientWidth / blockWidth)
    rows = Math.floor(board.clientHeight / blockHeight)

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const block = document.createElement('div');
            block.classList.add("block");
            board.appendChild(block);
            blocks[`${row}-${col}`] = block;
        }
    }
}

initializeBoard()

function render() {
    direction = nextDirection

    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add("food")

    if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    } else if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    } else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y }
    } else if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }

    //Wall collision logic
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId)
        clearInterval(timerIntervalId)
        modal.style.display = "flex"
        startGameModal.style.display = "none"
        gameOverModal.style.display = "flex"
        return;
    }

    //food Consume Logic
    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food")
        food = {
            x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)
        }

        blocks[`${food.x}-${food.y}`].classList.add("food")
        snake.unshift(head)

        score += 10
        scoreElement.innerText = score

        if (score > highScore) {
            highScore = score
            highScoreElement.innerText = highScore
            localStorage.setItem("highScore", highScore)
        }
    } else {
        snake.forEach(segment => {
            blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
        })

        snake.unshift(head)
        snake.pop()
    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    })
}

startButton.addEventListener("click", () => {
    modal.style.display = "none"
    direction = 'down'
    nextDirection = 'down'
    gameTime = 0
    score = 0
    scoreElement.innerText = score
    timeElement.innerText = "00:00"

    // Clear any existing timers
    clearInterval(timerIntervalId)
    clearInterval(intervalId)

    // Start timer
    timerIntervalId = setInterval(() => {
        gameTime++
        const minutes = Math.floor(gameTime / 60)
        const seconds = gameTime % 60
        timeElement.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }, 1000)

    // Start game
    intervalId = setInterval(() => { render() }, 300)
})

restartButton.addEventListener("click", restartGame)

function restartGame() {
    blocks[`${food.x}-${food.y}`].classList.remove("food")
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })

    modal.style.display = "none"
    direction = "down"
    nextDirection = "down"
    snake = [{ x: 1, y: 3 }]
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
    gameTime = 0
    score = 0
    scoreElement.innerText = score
    timeElement.innerText = "00:00"

    clearInterval(timerIntervalId)
    clearInterval(intervalId)

    timerIntervalId = setInterval(() => {
        gameTime++
        const minutes = Math.floor(gameTime / 60)
        const seconds = gameTime % 60
        timeElement.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }, 1000)

    intervalId = setInterval(() => { render() }, 300)
}

// Keyboard controls
addEventListener("keydown", (event) => {
    if (event.key == "ArrowUp" && direction !== "down") {
        nextDirection = "up"
        event.preventDefault()
    } else if (event.key == "ArrowRight" && direction !== "left") {
        nextDirection = "right"
        event.preventDefault()
    } else if (event.key == "ArrowLeft" && direction !== "right") {
        nextDirection = "left"
        event.preventDefault()
    } else if (event.key == "ArrowDown" && direction !== "up") {
        nextDirection = "down"
        event.preventDefault()
    }
})

// Mobile touch controls
mobileControlButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const newDirection = button.getAttribute('data-direction')

        // Prevent opposite direction
        if ((direction === 'up' && newDirection === 'down') ||
            (direction === 'down' && newDirection === 'up') ||
            (direction === 'left' && newDirection === 'right') ||
            (direction === 'right' && newDirection === 'left')) {
            return
        }

        nextDirection = newDirection
        e.preventDefault()
    })
})

// Handle window resize for responsiveness
window.addEventListener('resize', () => {
    const newBlockSize = getBlockSize()
    if (newBlockSize !== blockWidth) {
        initializeBoard()
    }
})

// Load high score from localStorage
window.addEventListener('load', () => {
    const savedHighScore = localStorage.getItem("highScore")
    if (savedHighScore) {
        highScore = parseInt(savedHighScore)
        highScoreElement.innerText = highScore
    }
})

