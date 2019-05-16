    canvas.width = 70
    canvas.height = 40
    var ctx = canvas.getContext('2d')
    var ballRadius = 2;
    var x = canvas.width/2;
    var y = canvas.height-30;
    var dx = 2;
    var dy = -2;
    var paddleHeight = 1;
    var paddleWidth = 8;
    var paddleX = (canvas.width-paddleWidth)/2;
    var brickRowCount = 15;
    var brickColumnCount = 3;
    var brickWidth = 2;
    var brickHeight = 2;
    var brickPadding = 1;
    var brickOffsetTop = 0;
    var brickOffsetLeft = 10;
    var score = 0;
    var lives = 3;

    var bricks = [];
    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    document.onkeydown = function(e){
        if((e.which == 37) && paddleX > 0)
            paddleX -= 5;
        else if((e.which == 39) && paddleX < canvas.width - paddleWidth)
            paddleX += 5;
        e.preventDefault();
    }

    function collisionDetection() {
        for(var c=0; c<brickColumnCount; c++) {
            for(var r=0; r<brickRowCount; r++) {
                var b = bricks[c][r];
                if(b.status == 1) {
                    if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if(score == brickRowCount*brickColumnCount) {
                            alert("YOU WIN, CONGRATS!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

    function drawBall() {
        ctx.fillPixel(x, y);
    }
    function drawPaddle() {
        ctx.fillRect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    }
    function drawBricks() {
        ctx.fill = '⬛'
        for(var c=0; c<brickColumnCount; c++) {
            for(var r=0; r<brickRowCount; r++) {
                if(bricks[c][r].status == 1) {
                    var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                    var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();

        if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if(y + dy < ballRadius) {
            dy = -dy;
        }
        else if(y + dy > canvas.height-ballRadius) {
            if(x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                lives--;
                /* if(!lives) {
                    alert("GAME OVER");
                    document.location.reload();
                }
                else { */
                    x = canvas.width/2;
                    y = canvas.height-30;
                    dx = 3;
                    dy = -3;
                    paddleX = (canvas.width-paddleWidth)/2;
                //}
            }
        }

        x += dx;
        y += dy;
        //requestAnimationFrame(draw);
    }

    setInterval(draw, 1000/5)