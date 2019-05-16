//Source: https://github.com/Pau1fitz/snake-js

window.onload = function()
{
    canvas.width = 70;
    canvas.height = 30;
    ctx = canvas.getContext('2d'),
    score = 0,
    direction = 0,
    snake = new Array(7),
    active = true;

    // Initialize the matrix.
    var map = []
    for (var i = 0; i < canvas.height; i++) {
        map[i] = []
        for (var j = 0; j < canvas.width; j++) {
            map[i][j] = 0
        }
    }

    // Add the snake
    map = generateSnake(map);

    // Add the food
    map = generateFood(map);

    drawGame();

    window.addEventListener('keydown', function(e) {
        if (e.keyCode === 38 && direction !== 3) {
            direction = 2; // Up
        } else if (e.keyCode === 40 && direction !== 2) {
            direction = 3; // Down
        } else if (e.keyCode === 37 && direction !== 0) {
            direction = 1; // Left
        } else if (e.keyCode === 39 && direction !== 1) {
            direction = 0; // Right
        }
    });

    function drawGame()
    {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);


        for (var i = snake.length - 1; i >= 0; i--) {

            // We're only going to perform the collision detection using the head
            // so it will be handled differently than the rest
            if (i === 0) {
                switch(direction) {
                    case 0: // Right
                        snake[0] = { x: snake[0].x + 1, y: snake[0].y }
                        break;
                    case 1: // Left
                        snake[0] = { x: snake[0].x - 1, y: snake[0].y }
                        break;
                    case 2: // Up
                        snake[0] = { x: snake[0].x, y: snake[0].y - 1 }
                        break;
                    case 3: // Down
                        snake[0] = { x: snake[0].x, y: snake[0].y + 1 }
                        break;
                }

                // Check that it's not out of bounds.
                if (snake[0].x < 0 ||
                    snake[0].x >= canvas.width ||
                    snake[0].y < 0 ||
                    snake[0].y >= canvas.height) {
                    return;
                }

                if (!map[snake[0].x]) {
                    map[snake[0].x] = []
                }
                if (map[snake[0].x][snake[0].y] === 1) {
                    score += 10;
                    map = generateFood(map);

                    // Add a new body piece to the array
                    snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
                    map[snake[snake.length - 1].x][snake[snake.length - 1].y] = 2;

                    if ((score % 100) == 0) {
                        level += 1;
                    }

                }/*  else if (map[snake[0].x][snake[0].y] === 2) {
                    return;
                } */

                map[snake[0].x][snake[0].y] = 2;
            } else {

                if (i === (snake.length - 1)) {
                    map[snake[i].x][snake[i].y] = null;
                }

                snake[i] = { x: snake[i - 1].x, y: snake[i - 1].y };
                map[snake[i].x][snake[i].y] = 2;
            }
        }

        drawMain();

        for (var x = 0; x < map.length; x++) {
            for (var y = 0; y < map[0].length; y++) {
                if (map[x][y] === 1) {
                    ctx.fillRect(x, y, 1, 1);
                } else if (map[x][y] === 2) {
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }

        if (active) {
            setTimeout(drawGame, 1000/10);
        }
    }


    function drawMain()
    {

        // The border is drawn on the outside of the rectangle, so we'll
        // need to move it a bit to the right and up. Also, we'll need
        // to leave a 20 pixels space on the top to draw the interface.
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    function generateFood(map)
    {
        var rndX = 2 + Math.round(Math.random() * 19),
            rndY = 2 + Math.round(Math.random() * 19);

        while (map[rndX][rndY] === 2) {
            rndX = 2 + Math.round(Math.random() * 19);
            rndY = 2 + Math.round(Math.random() * 19);
        }

        map[rndX][rndY] = 1;

        return map;
    }

    function generateSnake(map)
    {
        // Generate a random position for the row and the column of the head.
        var rndX = Math.round(Math.random() * 19),
            rndY = Math.round(Math.random() * 19);

        // Let's make sure that we're not out of bounds as we also need to make space to accomodate the
        // other two body pieces
        while ((rndX - snake.length) < 0) {
            rndX = Math.round(Math.random() * 19);
        }

        for (var i = 0; i < snake.length; i++) {
            snake[i] = { x: rndX - i, y: rndY };
            map[rndX - i][rndY] = 2;
        }

        return map;
    }
};