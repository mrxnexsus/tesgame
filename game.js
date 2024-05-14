const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const playerSelectionScreen = document.getElementById('playerSelection');
const controls = document.querySelector('.controls');
let selectedPlayerImage;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 100; // Adjust for controls
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const gravity = 0.5;

class Player {
    constructor(image) {
        this.image = image;
        this.position = {
            x: 100,
            y: 100
        };
        this.velocity = {
            x: 0,
            y: 1
        };
        this.width = 50;
        this.height = 50;
    }

    draw() {
        context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }
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

// Player selection
document.querySelectorAll('.player').forEach(playerDiv => {
    playerDiv.addEventListener('click', (e) => {
        const selectedPlayer = e.currentTarget.getAttribute('data-player');
        console.log(`Selected player: ${selectedPlayer}`);
        selectedPlayerImage = new Image();
        selectedPlayerImage.src = `path/to/${selectedPlayer}.png`; // Pastikan jalur gambar benar
        selectedPlayerImage.onload = () => {
            player = new Player(selectedPlayerImage);
            console.log('Player image loaded');
            playerSelectionScreen.classList.add('hidden');
            canvas.classList.remove('hidden');
            controls.classList.remove('hidden');
            resizeCanvas();
        };
    });
});
