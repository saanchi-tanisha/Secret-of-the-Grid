const homeScreen = document.getElementById('home-screen');
const gameContainer = document.getElementById('game-container');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const nextBtn = document.getElementById('nextBtn');
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');


const tileSize = 110;
const gap = 10;
const startX = (canvas.width - (tileSize * 3 + gap * 2)) / 2;
const startY = 110;


let tiles = new Array(3, 7, 1, 8, 0, 4, 2, 6, 5);
let selectedIndex = null;
let secondsLeft = 60;
let timerInterval = null;
let isSolved = false;
let isGameOver = false;


const gridImg = new Image();
gridImg.src = 'assets/vault1-map.png';
let imageReady = false;
gridImg.onload = () => {
  imageReady = true;
  if (!gameContainer.classList.contains('hidden')) drawVault1();
};

startBtn.addEventListener('click', () => {
  homeScreen.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  resetVault1();
});

restartBtn.addEventListener('click', () => {
  resetVault1();
});

function resetVault1() {
  tiles = new Array(3, 7, 1, 8, 0, 4, 2, 6, 5);
  selectedIndex = null;
  secondsLeft = 60;
  isSolved = false;
  isGameOver = false;
  restartBtn.style.display = 'none';
  nextBtn.style.display = 'none';

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (isSolved || isGameOver) return;
    secondsLeft--;
    if (secondsLeft <= 0) {
      secondsLeft = 0;
      isGameOver = true;
      clearInterval(timerInterval);
      restartBtn.style.display = 'inline-block';
    }
    drawVault1();
  }, 1000);

  drawVault1();
}


function drawVault1() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;


  ctx.fillStyle = '#facc15';
  ctx.font = '15px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText('VAULT 1: ALIGN THE GRID', canvas.width / 2, 45,  );

  ctx.fillStyle = secondsLeft <= 10 ? '#ef4444' : '#38bdf8';
  ctx.font = '12px "Press Start 2P"';
  ctx.fillText(`TIME LEFT: ${secondsLeft}s`, canvas.width / 2, 78);


  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      const x = startX + col * (tileSize + gap);
      const y = startY + row * (tileSize + gap);
      const tileValue = tiles[index];

      if (imageReady) {
        const pieceW = gridImg.width / 3;
        const pieceH = gridImg.height / 3;
        const origRow = Math.floor(tileValue / 3);
        const origCol = tileValue % 3;

        ctx.drawImage(
          gridImg,
          origCol * pieceW, origRow * pieceH, pieceW, pieceH,
          x, y, tileSize, tileSize
        );
      } else {
        ctx.fillStyle = (index === selectedIndex) ? '#facc15' : '#1e293b';
        ctx.fillRect(x, y, tileSize, tileSize);

        ctx.fillStyle = (index === selectedIndex) ? '#0b0f19' : '#38bdf8';
        ctx.font = '24px "Press Start 2P"';
        ctx.fillText(tileValue + 1, x + tileSize / 2, y + tileSize / 2 + 10);
      }

    
      if (index === selectedIndex) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, tileSize, tileSize);
      }
    }
  }

  if (isSolved) {
    ctx.fillStyle = 'rgba(11, 15, 25, 0.9)';
    ctx.fillRect(140, 200, canvas.width - 280, 140);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.strokeRect(140, 200, canvas.width - 280, 140);

    ctx.fillStyle = '#22c55e';
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText('VAULT 1 UNLOCKED!', canvas.width / 2, 250);
    ctx.fillStyle = '#facc15';
    ctx.font = '13px "Press Start 2P"';
    ctx.fillText('CLUE #1: PIN 4829', canvas.width / 2, 295);
  } else if (isGameOver) {
    ctx.fillStyle = 'rgba(11, 15, 25, 0.9)';
    ctx.fillRect(140, 200, canvas.width - 280, 120);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.strokeRect(140, 200, canvas.width - 280, 120);

    ctx.fillStyle = '#ff0000';
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText('SYSTEM LOCKED!', canvas.width / 2, 268);
  }
}

canvas.addEventListener('click', (e) => {
  if (isSolved || isGameOver) return;

  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      const x = startX + col * (tileSize + gap);
      const y = startY + row * (tileSize + gap);

      if (mouseX >= x && mouseX <= x + tileSize && mouseY >= y && mouseY <= y + tileSize) {
        if (selectedIndex === null) {
          selectedIndex = index;
        } else {
          const temp = tiles[selectedIndex];
          tiles[selectedIndex] = tiles[index];
          tiles[index] = temp;
          selectedIndex = null;

          if (tiles.every((val, i) => val === i)) {
            isSolved = true;
            clearInterval(timerInterval);
            nextBtn.style.display = 'inline-block';
          }
        }
        drawVault1();
      }
    }
  }
});


nextBtn.addEventListener('click', () => {
    window.location.href = 'vault2.html';
});