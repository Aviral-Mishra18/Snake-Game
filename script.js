const board = document.querySelector('.board');
const startButton = document.querySelector(".btn-start")
const modal = document.querySelector(".modal")
const startGameModal = document.querySelector(".start-game")
const gameOverModal = document.querySelector(".game-over")
const restartButton = document.querySelector(".btn-restart")

const highScoreElement = document.querySelector("#high-score")
const scoreElement = document.querySelector("#score")
const timeElement = document.querySelector("#time")


const blockHeight = 50
const blockWidth = 50

let highScore = 0
let score = 0
let time = `00-00`

const cols = Math.floor(board.clientWidth / blockWidth); /*ye board ki width ko block width se divide karke columns nikal raha hai*/
const rows = Math.floor(board.clientHeight / blockHeight);/*ye board ki height ko block height se divide karke rows nikal raha hai*/
let intervalId = null;
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }

const blocks = []
let snake = [
    {
        x: 1, y: 3
    }]


let direction = 'down'

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block"); //ye block class add karega
        board.appendChild(block);
        block.innerText = `${row}-${col}`//ye board me blocks add karega..
        blocks[`${row}-${col}`] = block;
    }
}

function render() {

    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add("food") /*ye food ke position pe food class add karega*/

    if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    } else if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    } else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y }
    } else if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }

    //Wll collison logic..
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        alert("Game Over")
        clearInterval(intervalId)
        modal.style.display = "flex"
        startGameModal.style.display = "none"
        gameOverModal.style.display = "flex"
        return;
    }

    //food Consume Logic..
    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food")
        food = {
            x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)
        }/*ye naya food generate karega*/

        blocks[`${food.x}-${food.y}`].classList.add("food")
        snake.unshift(head)

        score += 10
        scoreElement.innerText = score

        if(score>highScore){
            highScore = scorelocalStorage.setitem("highScore",highScore)
        }

    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");/*ye segment ke hisab se block ko access karega aur fill class remove karega*/
    })

    snake.unshift(head) /*ye snake ke head me naya segment add karega*/
    snake.pop() /*ye snake ke tail se last segment remove karega*/
    snake.forEach(segment => {  // console.log(segment)
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
        /*ye segment ke hisab se block ko access karega*/
    })
}

// intervalId = setInterval(() => {
//     render();
// }, 300); /*ye function har 300 milliseconds me chalega*/

startButton.addEventListener("click", () => {
    modal.style.display = "none"
    intervalId = setInterval(() => { render() }, 300)
})

restartButton.addEventListener("click", restartGame)

function restartGame() {

    blocks[`${food.x}-${food.y}`].classList.remove("food")
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })

    modal.style.display = "none" /*ye modal ko hide karega*/
    direction = "down"
    snake = [{ x: 1, y: 3 }]
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
    intervalId = setInterval(() => { render() }, 300)
}


addEventListener("keydown", (event) => { /*ye arrow keys ke liye event listener add karega*/
    if (event.key == "ArrowUp") {
        direction = "up"
    } else if (event.key == "ArrowRight") {
        direction = "right"
    } else if (event.key == "ArrowLeft") {
        direction = "left"
    } else if (event.key == "ArrowDown") {
        direction = "down"
    }
})

