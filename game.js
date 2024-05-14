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

        // Pengereman bertahap
        if (!keys.left.pressed && !keys.right.pressed) {
            this.velocity.x *= 0.9; // Kurangi kecepatan secara bertahap
        }
    }

    moveLeft() {
        this.velocity.x = -2; // Kurangi kecepatan dari -5 menjadi -2
    }

    moveRight() {
        this.velocity.x = 2; // Kurangi kecepatan dari 5 menjadi 2
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

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan canvas
    if (keys.left.pressed) {
        player.moveLeft();
    }
    if (keys.right.pressed) {
        player.moveRight();
    }
    player.update(); // Update status player
    player.draw(); // Gambar player ke canvas
    requestAnimationFrame(gameLoop); // Panggil gameLoop lagi di frame berikutnya
}

function startGame(playerImage) {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    player = new Player(playerImage, context); // Pastikan ini adalah variabel global atau dapat diakses

    requestAnimationFrame(gameLoop); // Mulai loop game

    // Event listeners for controls
    document.getElementById('leftBtn').addEventListener('touchstart', () => player.moveLeft());
    document.getElementById('leftBtn').addEventListener('touchend', () => player.stopX());

    document.getElementById('rightBtn').addEventListener('touchstart', () => player.moveRight());
    document.getElementById('rightBtn').addEventListener('touchend', () => player.stopX());

    document.getElementById('upBtn').addEventListener('touchstart', () => player.jump());
    document.getElementById('upBtn').addEventListener('touchend', () => player.stopX());
}

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
