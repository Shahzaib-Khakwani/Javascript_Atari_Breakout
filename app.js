const cvs = document.getElementById('breakout-canvas');
let ctx = cvs.getContext('2d');

// ADD BORDER TO CANVAS
cvs.style.border = "1px solid #0ff";
ctx.lineWidth = 3;

//loading images
//const BG_IMG = new Image();
//BG_IMG.src = "img/bg.jpg";

//game varible
let Paddle_bottom_margin = 50;
let Paddle_height = 20;
let Paddle_width = 100;
let Paddle_Right = false;
let Paddle_Left = false;
const ballRadius = 8;
let LIFE = 3;
let SCORE = 0;
let level = 1;
let GameOver = false;



// paddle object
let paddle = {
    x: cvs.width / 2 - (Paddle_width / 2),
    y: cvs.height - Paddle_bottom_margin - Paddle_height,
    width: Paddle_width,
    height: Paddle_height,
    dx: 5
}


//draw paddle
function drawPaddle() {
    ctx.fillStyle = "#2e3548";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "#ffcd05";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

//move paddle
function movePaddle() {
    if (Paddle_Right && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx;
    }
    else if (Paddle_Left && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}

//move paddle eventlistener
document.addEventListener('keydown', function (event) {
    if (event.keyCode == '37') {
        Paddle_Left = true;
    }

    if (event.keyCode == '39') {
        Paddle_Right = true;
    }
}
);

document.addEventListener('keyup', function (event) {
    if (event.keyCode == '37') {
        Paddle_Left = false;
    }

    if (event.keyCode == '39') {
        Paddle_Right = false;
    }
}
);

//ball object
let ball = {
    speed: 4,
    radius: ballRadius,
    x: cvs.width / 2,
    y: paddle.y - ballRadius,
    dy: -3,
    dx: 3 * Math.floor(Math.random() * 2 - 1)
}



//draw ball
function drawBall() {
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffcd05";
    ctx.fill();

    ctx.strokeStyle = "#2e3548";
    ctx.stroke();

    ctx.closePath();
}

//move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

//ball-wall-collision
function ballWallCollision() {
    if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    if (ball.y + ball.radius > cvs.height) {
        LIFE--;
        resetBall();
    }
}

// RESET THE BALL
function resetBall() {
    ball.x = cvs.width / 2;
    ball.y = paddle.y - ballRadius;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

//ball-paddle collision
function ballPaddleCollision() {
    if (ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y) {


        // CHECK WHERE THE BALL HIT THE PADDLE
        let collidePoint = ball.x - (paddle.x + paddle.width / 2);

        // NORMALIZE THE VALUES
        collidePoint = collidePoint / (paddle.width / 2);

        // CALCULATE THE ANGLE OF THE BALL
        let angle = collidePoint * Math.PI / 3;


        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}

//brick
let brick = {
    height: 20,
    width: 55,
    row: 2,
    column: 5,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: "#2e3548",
    strokeColor: "#FFF"
};

// bricks array
let bricks = [];

// crate bricks function
function createBricks() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                stutas: true
            };

        }

    }
}

createBricks();

//draw bricks function

function drawBricks() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            if (bricks[r][c].stutas) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);
            }

        }

    }
}

//ball brick collision
function ballBrickCollision() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            if (bricks[r][c].stutas) {
                if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
                    ball.dy = - ball.dy;
                    b.stutas = false;
                    SCORE += 1;
                }

            }

        }

    }
}

//show stats
function showStats(text, textX, textY, img, imgX, imgY) {
    ctx.fillStyle = "#fff";
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);
    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

//gameOver
function gameOver() {
    if (LIFE <= 0) {
        GameOver = true;
        showYouLose();
    }
}

// SHOW GAME OVER MESSAGE
/* SELECT ELEMENTS */
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

// SHOW YOU WIN
function showYouWin() {
    gameover.style.display = "block";
    youwon.style.display = "block";
}

// SHOW YOU LOSE
function showYouLose() {
    gameover.style.display = "block";
    youlose.style.display = "block";
}



//game draw function
function draw() {
    drawPaddle();
    drawBall();
    drawBricks();
    showStats(SCORE, 35, 25, Score_IMG, 5, 5);
    showStats(LIFE, 350, 25, Life_IMG, cvs.width - 35, 5);
    showStats(level, cvs.width / 2, 25, Level_IMG, cvs.width / 2 - 30, 5);
}



//game update function
function update() {
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleCollision();
    ballBrickCollision();
    gameOver();
}


//game loop
function loop() {
    //clear canvas
    ctx.drawImage(BG_IMG, 0, 0);

    draw();
    update();
    requestAnimationFrame(loop);
}

loop();