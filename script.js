const snakeSegments = document.getElementsByClassName('snake'); // Existing snake segments
const boardSize = 400;
const segmentSize = 20;
let score = 0;
let endGame = false;
let counter = 0;
let direction = { x: 1, y: 0 }; // Start moving to the right

let snake = [
    { x: 200, y: 200 }, // Head
    { x: 180, y: 200 }  // Body segment
];

// Create apple element and set initial position
const appleElement = document.querySelector('.apple');
let applePosition = getRandomApplePosition();

function getRandomApplePosition() {
    const maxPosition = boardSize / segmentSize - 1;
    return {
        x: Math.floor(Math.random() * maxPosition) * segmentSize,
        y: Math.floor(Math.random() * maxPosition) * segmentSize
    };
}

function placeApple() {
    appleElement.style.left = applePosition.x + "px";
    appleElement.style.top = applePosition.y + "px";
}

function updateSnakePosition() {
    if (endGame) return;

    // Calculate new head position
    const newHead = {
        x: snake[0].x + direction.x * segmentSize,
        y: snake[0].y + direction.y * segmentSize
    };

    // Add new head to the snake array
    snake.unshift(newHead);

    // Check for apple collision
    if (newHead.x === applePosition.x && newHead.y === applePosition.y) {
        score++;
        document.getElementById('score').textContent = score;

        // Move apple to a new position
        applePosition = getRandomApplePosition();
        placeApple();

        // Add a new segment to the snake (grow the snake)
        const newSegment = document.createElement('div');
        newSegment.classList.add('snake');
        newSegment.style.width = segmentSize + "px";
        newSegment.style.height = segmentSize + "px";
        newSegment.style.backgroundColor = "green";
        newSegment.style.position = "absolute";
        document.querySelector('.game-board').appendChild(newSegment);

    } else {
        // Remove the last segment if no apple was eaten
        snake.pop();
    }

    // Update each segment div's position
    Array.from(snakeSegments).forEach((segment, index) => {
        if (snake[index]) {
            segment.style.left = snake[index].x + "px";
            segment.style.top = snake[index].y + "px";
        }
    });

    // Check for wall collisions
    if (newHead.x < 0 || newHead.x >= boardSize || newHead.y < 0 || newHead.y >= boardSize) {
        console.log("Game Over!");
        endGame = true;
        clearInterval(gameLoop); // Stop the game loop
    }
}

// Start the game loop to move the snake every 150ms
const gameLoop = setInterval(updateSnakePosition, 150);

// Start game function for resetting the game and taking turns
const startGame = () => {
    counter = 0;
    score = 0;
    endGame = false;
    snake = [{ x: 200, y: 200 }, { x: 180, y: 200 }]; // Reset snake position
    document.getElementById('score').textContent = score; // Reset score display
    applePosition = getRandomApplePosition(); // Reset apple position
    placeApple();

    // Clear any existing snake segments and re-create the initial segments
    document.querySelectorAll('.snake').forEach(segment => segment.remove());
    snake.forEach(() => {
        const segment = document.createElement('div');
        segment.classList.add('snake');
        segment.style.width = segmentSize + "px";
        segment.style.height = segmentSize + "px";
        segment.style.backgroundColor = "green";
        segment.style.position = "absolute";
        document.querySelector('.game-board').appendChild(segment);
    });

    takeTurn();
};

// Initialize apple position
placeApple();

// Add event listener for starting the game
document.getElementById('start').addEventListener('click', startGame);

// Add event listener for arrow key presses to change direction
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Function to handle the game turn logic
const takeTurn = () => {
    counter++;
    if (counter >= 25) endGame = true; // End game after 25 turns

    if (!endGame) {
        moveMole();
    }
};
