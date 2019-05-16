
//The game board 1 = walls, 0 = free space, and -1 = the goal
var board = [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [ 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    [ 0, 0, 0, 0, 1, 1, 1, 0, 1, 0],
    [ 0, 1, 1, 0, 0, 0, 1, 0, 1, 0],
    [ 0, 0, 1, 1, 1, 1, 1, 0, 1, 0],
    [ 1, 0, 1, 0, 0, 0, 1, 0, 1, 0],
    [ 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
    [ 1, 0, 1, 0, 1, 0, 0, 1, 1, 0],
    [-1, 0, 1, 0, 1, 1, 0, 0, 0, 0]
];
var player = {
    x: 0,
    y: 0
};
var goalX;
var goalY;
//Draw the game board
function draw() {
    canvas.width = 20
    canvas.height = 20
    var ctx = canvas.getContext('2d')
    var width = ctx.w;
    var blockSize = 2;
    ctx.clearRect(0, 0, width, width);
    //Loop through the board array drawing the walls and the goal
    for(var y = 0; y < board.length; y++){
        for(var x = 0; x < board[y].length; x++){
            //Draw a wall
            if(board[y][x] === 1){
                ctx.fill = '▉▉';
                ctx.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);
            }
            //Draw the goal
            else if(board[y][x] === -1){
                ctx.fill = '▞▞';
                goalX = x*blockSize;
                goalY = y;
                ctx.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);
            }
        }
    }
    //Draw the player
    ctx.beginPath();
    var half = blockSize/2;
    //ctx.fillStyle = "blue";
    ctx.fill = '▒▒';
    ctx.fillRect(player.x*blockSize, player.y*blockSize, 2, 2);
    ctx.stroke();
}

//Check to see if the new space is inside the board and not a wall
function canMove(x, y){
    return (y>=0) && (y<board.length) && (x >= 0) && (x < board[y].length) && (board[y][x] != 1);
}

document.onkeydown = function(e){
    if((e.which == 38) && canMove(player.x, player.y-1))//Up arrow
        player.y--;
    else if((e.which == 40) && canMove(player.x, player.y+1)) // down arrow
        player.y++;
    else if((e.which == 37) && canMove(player.x-1, player.y))
        player.x--;
    else if((e.which == 39) && canMove(player.x+1, player.y))
        player.x++;
    draw();
    if (player.x === goalX && player.y === goalY) {
        alert('Good')
    }
    e.preventDefault();
}
draw();