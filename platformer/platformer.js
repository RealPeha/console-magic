var width = 50,
    height = 20
    
    canvas.width = width;
    canvas.height = height;
var ctx = canvas.getContext('2d')

// Define player object
var player = {
    x: width / 2,
    y: height - 3,
    width: 3,
    height: 3,
    speed: 1.5,
    velX: 0,
    velY: 0,
    jumping: false
};

// init an array of keys to be pressed
var keys = [];

// add friction
var friction = 0.8;

// add gravity
var gravity = 0.3;
let move = false;
function update () {
    // check for keys
    // --
    // up arrow or space
    if (keys[38] || keys[32]) {
        // jump!
        if (!player.jumping) {
            player.jumping = true;
            player.velY = -player.speed * 1.5;
        }
    }

    // right arrow
    if (keys[39]) {
        // increase speed to the right
        if (player.velX < player.speed) {
            player.velX++;
        }
    }

    // left arrow
    if (keys[37]) {
        // increase speed to the right
        if (player.velX > -player.speed) {
            player.velX--;
        }
    }

    // apply friction
    player.velX *= friction;

    // apply gravity
    player.velY += gravity;
    // move the player
    player.x += Math.round(player.velX);
    player.y += Math.round(player.velY);

    // don't allow the player to go outside the canvas
    if (player.x >= width - player.width) {
        player.x = width - player.width;
    } else if (player.x <= 0) {
        player.x = 0;
    }

    // don't allow the player to jump off the screen
    if (player.y >= height - player.height) {
        player.y = height - player.height;
        player.jumping = false;
    }

    // draw player
    ctx.clearRect(0,0,width,height);
    //ctx.fillStyle = "red";

    ctx.fill = '▉▉';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

const Platformer = {
    launch: (always = false) => {
        window.addEventListener("keydown", function (e) {
            keys[e.keyCode] = true;
            move = true
        });
        
        window.addEventListener("keyup", function (e) {
            keys[e.keyCode] = false;
            move = false
        })
        setInterval(() => {
            if (always) {
                update()
                return;
            }
            if (move || player.jumping) {
                update();
            }
        }, 1000/10)
        update()
    }
}
Platformer.launch()