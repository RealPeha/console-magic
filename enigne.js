const canvas = {
    width: 70,
    height: 40,
    getContext(type) {
        if (type != '2d') {
            return console.log('Only 2d');
        }
        return new Context2D(type);
    }
}

class Context2D {
    constructor(type) {
        this.fillStyle = '⬛';
        this.emptyStyle = '⬜';//'░░';
        this.map = [];
        for (let i = 0; i < canvas.height; i++) {
            this.map[i] = [];
            for (let j = 0; j < canvas.width; j++) {
                this.map[i][j] = this.emptyStyle;
            }
        }
        this.path = [];
        this.clear();
    }

    fillRect(x, y, width, height) {
        for (let i = y; i < y + height; i++) {
            for (let j = x; j < x + width; j++) {
                if (!this.map[i]) break;
                this.map[i][j] = this.fillStyle;
            }
        }
        this.draw();
    }

    strokeRect(x, y, width, height) {
        for (let j = x; j < x + width; j++) {
            this.map[y][j] = this.fillStyle;
            this.map[y + height - 1][j] = this.fillStyle;
        }
        for (let i = y + 1; i < y + height - 1; i++) {
            this.map[i][x] = this.fillStyle;
            this.map[i][x + width - 1] = this.fillStyle;
        }
        this.draw();
    }

    clearRect(x, y, width, height) {
        for (let i = y; i < y + height; i++) {
            for (let j = x; j < x + width; j++) {
                this.map[i][j] = this.emptyStyle;
            }
        }
        this.draw();
    }

    beginPath() {
        this.path = [];
    }

    moveTo(x, y) {
        this.path.push([Math.round(x), Math.round(y), true]);
    }

    lineTo(x, y) {
        this.path.push([Math.round(x), Math.round(y)]);
    }

    closePath() {
        if (!this.path.length) return false
        this.path.push([this.path[0][0], this.path[0][1]]);
    }

    stroke() {
        const path = this.path;
        for (let i = 0; i < path.length - 1; i++) {
            const x0 = path[i][0];
            const y0 = path[i][1];
            const x1 = path[i+1][0];
            const y1 = path[i+1][1];

            this.fillPixel(x1, y1);

            if (path[i+1][2]) continue;

            const deltaX = Math.abs(x1 - x0);
            const deltaY = Math.abs(y1 - y0);
            const signX = x0 < x1 ? 1 : -1;
            const signY = y0 < y1 ? 1 : -1;
            let error = deltaX - deltaY;
            let x = x0;
            let y = y0;
            while(x !== x1 || y !== y1) {
                this.fillPixel(x, y)
                const error2 = error * 2;
                if (error2 > -deltaY) {
                    error -= deltaY;
                    x += signX;
                }
                if (error2 < deltaX) {
                    error += deltaX;
                    y += signY;
                }
            }
        }
        this.draw();
    }

    fillPixel(x, y) {
        if (!this.map[y]) return false;
        this.map[y][x] = this.fillStyle;
    }

    arc(x1, y1, r) {
        let x = 0;
        let y = r;
        let delta = 1 - 2 * r;
        let error = 0;
        while (y >= 0) {
            this.moveTo(x1 + x, y1 + y);
            this.moveTo(x1 + x, y1 - y);
            this.moveTo(x1 - x, y1 + y);
            this.moveTo(x1 - x, y1 - y);
            error = 2 * (delta + y) - 1;
            if (delta < 0 && error <= 0) {
                delta += 2 * ++x + 1;
                continue;
            }
            if (delta > 0 && error > 0) {
                delta -= 2 * --y + 1;
                continue;
            }
            delta += 2 * (++x - y--);
        }
        this.draw()
    }

    draw() {
        this.clear();
        //2D to String
        const map = this.map.map(val => val.join('')).join('\n');
        console.log(map);
    }

    clear() {
        console.clear();
    }

    mapClear() {
        for (let i = 0; i < canvas.height; i++) {
            this.map[i] = [];
            for (let j = 0; j < canvas.width; j++) {
                this.map[i][j] = this.emptyStyle;
            }
        }
    }
}