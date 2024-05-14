const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 100; // Adjust for controls
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const gravity = 0.5;

class Player {
    constructor(image, context) {
        this.image = image;
        this.context = context;
        this.position = {
            x: 100,
            y: 100
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.width = 50;
        this.height = 50;
    }

    draw() {
        this.context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        // Add gravity effect
        if (this.position.y + this.height < this.context.canvas.height) {
            this.velocity.y += 0.5;
        } else {
            this.velocity.y = 0;
            this.position.y = this.context.canvas.height - this.height; // Adjust position to stay on ground
        }
    }

    moveLeft() {
        this.velocity.x = -5;
    }

    moveRight() {
        this.velocity.x = 5;
    }

    jump() {
        if (this.position.y + this.height === this.context.canvas.height) {
            this.velocity.y = -10;
        }
    }

    stopX() {
        this.velocity.x = 0;
    }
}

let player;
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    up: {
        pressed: false
    },
    down: {
        pressed: false
    }
};

function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (player) player.update();

    if (keys.right.pressed && player.position.x < canvas.width - player.width) {
        player.velocity.x = 5;
    } else if (keys.left.pressed && player.position.x > 0) {
        player.velocity.x = -5;
    } else {
        player.velocity.x = 0;
    }

    if (keys.up.pressed && player.velocity.y === 0) {
        player.velocity.y = -10;
    }
}

animate();

window.addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 37:
            keys.left.pressed = true;
            break;
        case 39:
            keys.right.pressed = true;
            break;
        case 38:
            keys.up.pressed = true;
            break;
        case 40:
            keys.down.pressed = true;
            break;
    }
});

window.addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 37:
            keys.left.pressed = false;
            break;
        case 39:
            keys.right.pressed = false;
            break;
        case 38:
            keys.up.pressed = false;
            break;
        case 40:
            keys.down.pressed = false;
            break;
    }
});

// Control buttons for mobile
document.getElementById('leftBtn').addEventListener('touchstart', () => keys.left.pressed = true);
document.getElementById('leftBtn').addEventListener('touchend', () => keys.left.pressed = false);

document.getElementById('rightBtn').addEventListener('touchstart', () => keys.right.pressed = true);
document.getElementById('rightBtn').addEventListener('touchend', () => keys.right.pressed = false);

document.getElementById('upBtn').addEventListener('touchstart', () => keys.up.pressed = true);
document.getElementById('upBtn').addEventListener('touchend', () => keys.up.pressed = false);

document.getElementById('downBtn').addEventListener('touchstart', () => keys.down.pressed = true);
document.getElementById('downBtn').addEventListener('touchend', () => keys.down.pressed = false);

document.addEventListener('DOMContentLoaded', () => {
    const playerImageSrc = localStorage.getItem('playerImage');

    if (playerImageSrc) {
        const playerImage = new Image();
        playerImage.src = playerImageSrc;
        playerImage.onload = () => {
            startGame(playerImage);
        };
    } else {
        // Jika tidak ada gambar pemain yang dipilih, tampilkan layar pemilihan pemain
        document.getElementById('playerSelection').classList.remove('hidden');
        document.getElementById('gameCanvas').classList.add('hidden');
        document.querySelector('.controls').classList.add('hidden');
    }
});

function startGame(playerImage) {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    const player = new Player(playerImage, context);

    function gameLoop() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        player.update();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();

    // Event listeners for controls
    document.getElementById('leftBtn').addEventListener('mousedown', () => player.moveLeft());
    document.getElementById('leftBtn').addEventListener('mouseup', () => player.stopX());
    document.getElementById('rightBtn').addEventListener('mousedown', () => player.moveRight());
    document.getElementById('rightBtn').addEventListener('mouseup', () => player.stopX());
    document.getElementById('upBtn').addEventListener('mousedown', () => player.jump());
}

