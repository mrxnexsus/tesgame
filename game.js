const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

window.onload = window.onresize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

const gravity = 0.25;

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
        this.width = 40;
        this.height = 40;
        this.jumpForce = -10;
        this.maxSpeed = 5;
        this.maxFallSpeed = 3;
        this.isJumping = false;
    }

    draw() {
        this.context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Gravity and ground collision
        if (this.position.y + this.height < canvas.height) {
            this.velocity.y += gravity;
            // Limit fall speed
            if (this.velocity.y > this.maxFallSpeed) {
                this.velocity.y = this.maxFallSpeed;
            }
        } else {
            this.velocity.y = 0;
            this.position.y = canvas.height - this.height;
            this.isJumping = false;
        }

        // Handle keyboard input for left/right only
        if (keys.left.pressed) {
            this.moveLeft();
        } else if (keys.right.pressed) {
            this.moveRight();
        } else {
            this.velocity.x = 0;
        }
    }

    moveLeft() {
        this.velocity.x = -2; // Kurangi kecepatan dari -5 menjadi -2
    }

    moveRight() {
        this.velocity.x = 2; // Kurangi kecepatan dari 5 menjadi 2
    }

    jump() {
        if (!this.isJumping) {
            this.velocity.y = this.jumpForce;
            this.isJumping = true;
        }
    }

    stopX() {
        this.velocity.x = 0;
    }
}

class Key {
    constructor(context, position) {
        this.context = context;
        this.position = position;
        this.width = 30;
        this.height = 30;
    }

    draw() {
        this.context.fillStyle = 'gold';
        this.context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Obstacle {
    constructor(context, position, width, height) {
        this.context = context;
        this.position = position;
        this.width = width;
        this.height = height;
    }

    draw() {
        this.context.fillStyle = 'red';
        this.context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Platform {
    constructor(context, x, y, width, height) {
        this.context = context;
        this.position = { x, y };
        this.width = width;
        this.height = height;
    }

    draw() {
        this.context.fillStyle = '#4a4a4a';
        this.context.fillRect(this.position.x, this.position.y, this.width, this.height);
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

let key;
let obstacles = [];
let platforms = [];

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    context.fillStyle = '#87CEEB';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw platforms
    platforms.forEach(platform => platform.draw());
    
    // Update and draw obstacles
    obstacles.forEach(obstacle => obstacle.draw());
    
    // Draw key
    key.draw();
    
    // Update player
    player.update();
    
    // Handle collisions
    handleCollisions();
    
    requestAnimationFrame(gameLoop);
}

function startGame(playerImage) {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');
    
    // Create platforms
    platforms = [
        new Platform(context, 0, canvas.height - 20, canvas.width, 20), // Ground
        new Platform(context, 300, canvas.height - 120, 200, 20),
        new Platform(context, 600, canvas.height - 200, 200, 20),
    ];

    // Create obstacles
    obstacles = [
        new Obstacle(context, { x: 400, y: canvas.height - 160 }, 40, 40),
        new Obstacle(context, { x: 700, y: canvas.height - 240 }, 40, 40)
    ];

    // Place key in a challenging position
    key = new Key(context, { x: 750, y: canvas.height - 260 });

    // Initialize player
    player = new Player(playerImage, context);

    requestAnimationFrame(gameLoop);

    // Event listeners for controls
    document.getElementById('leftBtn').addEventListener('touchstart', () => player.moveLeft());
    document.getElementById('leftBtn').addEventListener('touchend', () => player.stopX());

    document.getElementById('rightBtn').addEventListener('touchstart', () => player.moveRight());
    document.getElementById('rightBtn').addEventListener('touchend', () => player.stopX());

    document.getElementById('upBtn').addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!player.isJumping) {
            player.jump();
        }
    });

    document.getElementById('upBtn').addEventListener('touchend', (e) => {
        e.preventDefault();
    });

    document.getElementById('playerSelection').classList.add('hidden');
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
        case 38: // Up arrow
        case 32: // Spacebar
            if (!player.isJumping) {
                player.jump();
            }
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

function checkCollision(rect1, rect2) {
    return (
        rect1.position.x < rect2.position.x + rect2.width &&
        rect1.position.x + rect1.width > rect2.position.x &&
        rect1.position.y < rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height > rect2.position.y
    );
}

function handleCollisions() {
    // Platform collisions
    platforms.forEach(platform => {
        if (checkCollision(player, platform)) {
            // Landing on top of platform
            if (player.velocity.y > 0 && 
                player.position.y + player.height - player.velocity.y <= platform.position.y) {
                player.position.y = platform.position.y - player.height;
                player.velocity.y = 0;
                player.isJumping = false;
            }
        }
    });

    // Obstacle collisions - reset player position
    obstacles.forEach(obstacle => {
        if (checkCollision(player, obstacle)) {
            player.position.x = 100;
            player.position.y = 100;
        }
    });

    // Key collection
    if (checkCollision(player, key)) {
        // Show victory message or next level
        alert('Level Complete!');
        startGame(player.image);
    }
}
