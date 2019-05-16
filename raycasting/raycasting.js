//Source: https://github.com/jclg/raycasting.js

var Raycasting = {

    rotate: function(data) {
        return [data.xPosOne * Math.cos(data.alpha) - data.yPosOne * Math.sin(data.alpha),
                data.xPosOne * Math.sin(data.alpha) + data.yPosOne * Math.cos(data.alpha)];
    },

    translate: function(data) {
        return [data.xPosOne + data.xPosZero,
                data.yPosOne + data.yPosZero];
    },

    getYIntersection: function(data, map) {
        var xInter;
        var yInter;
        var kTemp;
        var kY;
        var vx;
        var vy;

        vx = data.xPosOne - data.xPosZero;
        vy = data.yPosOne - data.yPosZero;
        kY = 500;
        yInter = 0;
        while (yInter < map.length)
        {
            kTemp = (yInter - data.yPosZero) / vy;
            xInter = data.xPosZero + kTemp * vx;
            if (parseInt(yInter) >= 0 && parseInt(yInter) < map.length && parseInt(xInter) >= 0 &&
                parseInt(xInter) < map.length)
                if (map[parseInt(yInter)][parseInt(xInter)] == 1 && kTemp < kY && kTemp > 0 &&
                    map[parseInt(yInter)][parseInt(xInter) + 1] == 1 && kTemp < kY && kTemp > 0)
                    kY = kTemp;
            yInter++;
        }
        return (kY);
    },

    getXIntersection: function(data, map) {
        var xInter;
        var yInter;
        var kTemp;
        var kX;
        var vx;
        var vy;

        vx = data.xPosOne - data.xPosZero;
        vy = data.yPosOne - data.yPosZero;
        kX = 500;
        xInter = 0;
        while (xInter < map.length) {
            kTemp = (xInter - data.xPosZero) / vx;
            yInter = data.yPosZero + kTemp * vy;
            if (parseInt(yInter) >= 0 && parseInt(yInter) < map.length-1 && parseInt(xInter) >= 0 &&
                parseInt(xInter) < map.length)
                if (map[parseInt(yInter)][parseInt(xInter)] == 1 && kTemp < kX && kTemp > 0 &&
                    map[parseInt(yInter) + 1][parseInt(xInter)] == 1 && kTemp < kX && kTemp > 0)
                    kX = kTemp;
            xInter++;
        }
        return kX;
    },


    raycasting: function(x, data, map, winX) {
        var    p;
        var    d;
        var    k;
        var    kY;
        var    kX;

        p = 1;
        d = p / 2;
        data.xPosOne = d;
        data.yPosOne = (p * (winX / 2 - x) / winX);

        rotation = Raycasting.rotate(data);
        data.xPosOne = rotation[0];
        data.yPosOne = rotation[1];

        translation = Raycasting.translate(data);
        data.xPosOne = translation[0];
        data.yPosOne = translation[1];

        kY = Raycasting.getXIntersection(data, map);
        kX = Raycasting.getYIntersection(data, map);
        if (kX < kY && kX > 0)
            k = kX;
        else
            k = kY;


        return k;
    }
}

/*
** Render (draw) the sky, walls and floor with HTML canvas.
*/
var Render = {
    winX: 0,
    winY: 0,

    drawSky: function(x, top, ctx) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, top);
    },

    drawWall: function(x, top, bottom, ctx) {
        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);
    },

    drawFloor: function(x, bottom, ctx) {
        ctx.moveTo(x, bottom);
        ctx.lineTo(x, Render.winY);
    },

    getTop: function(k) {
        var middle = Render.winY / 2;
        var wall_middle_height = Render.winY / (2 * k);
        return middle - wall_middle_height;
    },

    getBottom: function(k) {
        var middle = Render.winY / 2;
        var wall_middle_height = Render.winY / (2 * k);
        return middle + wall_middle_height;
    },

    render: function(ctx, kk, win_x, win_y) {
        Render.winX = win_x;
        Render.winY = win_y;

        // Draw sky from left to right
        ctx.beginPath();
        x = 0;
        while (x < Render.winX) {
            Render.drawSky(x, Render.getTop(kk[x]), ctx);
            x++;
        }
        ctx.fillStyle = '░░'
        ctx.stroke();

        // Draw wall from left to right
        ctx.beginPath();
        x = 0;
        let s = false;
        while (x < Render.winX) {
            Render.drawWall(x, Render.getTop(kk[x]), Render.getBottom(kk[x]), ctx);
            x++;
        }
        ctx.fillStyle = '▉▉'; //'▓▓'
        ctx.stroke()

        // Draw floor from left to right
        ctx.beginPath();
        x = 0;
        while (x < Render.winX) {
            Render.drawFloor(x, Render.getBottom(kk[x]), ctx);
            x++;
        }
        ctx.fillStyle = '▒▒' //▓
        ctx.stroke();
    }

    }

    /*
    ** Event handles keyboard events in order to move the player.
    */
    var Event = {

        moveSpeed: 0.7,
        pi: 3.14159265358979323846,

        onKeyUp: function(player) {
            player.xPosZero = player.xPosZero + Event.moveSpeed * Math.cos(player.alpha);
            player.yPosZero = player.yPosZero + Event.moveSpeed * Math.sin(player.alpha);
        },

        onKeyDown: function(player) {
            player.xPosZero = player.xPosZero - Event.moveSpeed * Math.cos(player.alpha);
            player.yPosZero = player.yPosZero - Event.moveSpeed * Math.sin(player.alpha);
        },

        onKeyRight: function(player) {
            if (player.alpha > Event.pi)
                player.alpha = - Event.pi;
            else if (player.alpha < - Event.pi)
                player.alpha = Event.pi;
            player.alpha -= 0.1;
        },

        onKeyLeft: function(player) {
            if (player.alpha > Event.pi)
                player.alpha = - Event.pi;
            else if (player.alpha < - Event.pi)
                player.alpha = Event.pi;
            player.alpha += 0.1;
        }
    }

    /*
    ** Game configuration and initialization.
    */
    var Game = {
    
    player: {
        xPosZero: 5,
        yPosZero: 5,
        alpha: 0,
        xPosOne: 0,
        yPosOne: 0,
    },

    map: [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],

    ctx: {},
    winX: 80,
    winY: 60,


    updateScreen: function() {
        Game.ctx.clearRect(0, 0, Game.winX, Game.winY);
        var x = 0;
        var kk = [];
        while (x < Game.winX) {
            kk[x] = Raycasting.raycasting(x, Game.player, Game.map, Game.winX);
            x++;
        }
        if (Render.render(Game.ctx, kk, Game.winX, Game.winY) === false) return false
    },

    bindEvents: function() {
        document.onkeydown = function(e) {
            var update = false;
            switch (e.keyCode) {
            case 37: // Left
                Event.onKeyLeft(Game.player);
                update = true;
                break;
            case 38: // Up
                Event.onKeyUp(Game.player);
                update = true;
                break;
            case 39: // Right
                Event.onKeyRight(Game.player);
                update = true;
                break;
            case 40: // Down
                Event.onKeyDown(Game.player);
                update = true;
                break;
            }
            if (update) {
                Game.updateScreen();
            }
        };
    },

    launch: function() {
        canvas.width = 80;
        canvas.height = 60;
        Game.ctx = canvas.getContext('2d');
        Game.bindEvents();
        Game.updateScreen();
    }

}