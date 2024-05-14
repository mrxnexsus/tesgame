document.addEventListener('DOMContentLoaded', () => {
    const players = document.querySelectorAll('.player');
    players.forEach(player => {
        player.addEventListener('click', () => {
            const playerImageSrc = player.querySelector('img').src;
            localStorage.setItem('playerImage', playerImageSrc);
            document.getElementById('playerSelection').classList.add('hidden');
            document.getElementById('gameCanvas').classList.remove('hidden');
            document.querySelector('.controls').classList.remove('hidden');
            const playerImage = new Image();
            playerImage.src = playerImageSrc;
            playerImage.onload = () => {
                startGame(playerImage);
            };
        });
    });
});
