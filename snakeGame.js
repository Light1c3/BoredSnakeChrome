// Constants
var COLS=26, ROWS=26
// IDs
var EMPTY=0, SNAKE=1, FRUIT=2
// Directions
var LEFT=0, UP=1, RIGHT=2, DOWN=3
// Game objects
var canvas, ctx, keystate, frames, score, ttlscore, lvl;
//KeyCodes
var Key_LEFT=37, Key_UP=38, Key_RIGHT=39, Key_DOWN=40, Key_ENTER=13
// Current level
var gs = 6

var inStartScreen = true;

var grid = {

	width: null,
	height: null,
	_grid: null,

	init: function(d, c, r) {
		this.width = c;
		this.height = r;

		this._grid = [];
		for (var x=0; x < c; x++) {
			this._grid.push([]);
			for (var y=0; y < r; y++) {
				this._grid[x].push(d);
			}
		}

	},

	set: function(val, x, y) {
		this._grid[x][y] = val;
	},

	get: function(x, y) {
		return this._grid[x][y];
	}
}

var snake = {

	direction: null,
    head: null,
	last: null,
	_queue: null,

	init: function (d, x, y){
		this.direction = d;

		this._queue = [];
		this.insert(x, y);
	},

	insert: function (x, y) {
		this._queue.unshift({x:x, y:y});
		this.last = this._queue[0];
        //this.last = this_queue[(score/10) - 1]
	},

	remove: function () {
		return this._queue.pop();
	}
}


function setFood() {
	var empty = [];

	for (var x=0; x < grid.width; x++) {
		for (var y=0; y < grid.height; y++) {
			if (grid.get(x, y) === EMPTY) {
				empty.push({x:x, y:y});
			}
		}
	}

var randpos = empty[Math.round(Math.random()*(empty.length - 1))];
	grid.set(FRUIT, randpos.x, randpos.y);
}

function main() {
	canvas = document.createElement("canvas");
	canvas.width = COLS*20;
	canvas.height = ROWS*20;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);

	frames = 0;
	keystate = {};

	// keeps track of the keyboard input
	document.addEventListener("keydown", function(evt) {
		keystate[evt.keyCode] = true;
        if (evt.keyCode == Key_ENTER && inStartScreen) {
            init();
            loop();
        }
	});
	document.addEventListener("keyup", function(evt) {
		delete keystate[evt.keyCode];
	});

  //Attempting to create a welcome screen
	startGameScreen();

	//init();
	//loop();

}

function startGameScreen() {
        inStartScreen = true
		ctx.font = "25px Helvetica";
		drawStartScreen();
}

function endGameScreen() {
        inStartScreen = true
		ctx.font = "25px Helvetica";
		drawEndScreen();
}

function drawStartScreen() {

	var tw = canvas.width/grid.width;
	var th = canvas.height/grid.height;

	for (var x = 0; x < grid.width; x++) {
		for (var y = 0; y < grid.height; y++) {
			switch (grid.get(x, y)) {
				case EMPTY:
					ctx.fillStyle = "#fff";
					break;
				case SNAKE:
					ctx.fillStyle = "#fff";
					break;
				case FRUIT:
					ctx.fillStyle = "#fff";
					break;
			}
			ctx.fillRect(x*tw, y*th, tw, th);
		}
	}
	ctx.fillStyle = "#000";
	ctx.fillText("Press Enter To Start", canvas.width - 380, canvas.height / 2);
}

function drawEndScreen() {

	var tw = canvas.width/grid.width;
	var th = canvas.height/grid.height;

	for (var x = 0; x < grid.width; x++) {
		for (var y = 0; y < grid.height; y++) {
			switch (grid.get(x, y)) {
				case EMPTY:
					ctx.fillStyle = "#fff";
					break;
				case SNAKE:
					ctx.fillStyle = "#fff";
					break;
				case FRUIT:
					ctx.fillStyle = "#fff";
					break;
			}
			ctx.fillRect(x*tw, y*th, tw, th);
		}
	}
    ctx.fillStyle = "#000";
    if (lvl === 6) {
        ctx.fillText("You Did It!", canvas.width - 330, canvas.height - 450);
    } else
	ctx.fillText("Game Over", canvas.width - 330, canvas.height - 450);

    ctx.fillStyle = "#000";
    ctx.fillText("Your Score: " + ttlscore, canvas.width - 380, canvas.height - 350);

    ctx.fillStyle = "#000";
    ctx.fillText("Your Level: " + lvl, canvas.width - 380, canvas.height - 300);

    ctx.fillStyle = "#000";
	ctx.fillText("Press Enter To Start", canvas.width - 380, canvas.height - 100);
}

function init() {
    inStartScreen = false;
    ctx.font = "12px Helvetica";
	frames = 0;
	ttlscore = 0;
    score = 0;
	lvl = 1;
	gs = 5;
	grid.init(EMPTY, COLS, ROWS);

	var sp = {x:Math.floor(COLS/2), y:ROWS-1};
	snake.init(UP, sp.x, sp.y );
	grid.set(SNAKE, sp.x, sp.y);

	setFood();
}

function loop() {
    if (inStartScreen)
    {
        return;
    }

	update();
    if (inStartScreen)
    {
        return;
    }
	draw();

	window.requestAnimationFrame(loop, canvas);
}

function update() {
	frames++;

	if (keystate[Key_LEFT] && !keystate[Key_UP] && !keystate[Key_DOWN] && snake.direction !== RIGHT) {
		snake.direction = LEFT;
	}
		if (keystate[Key_UP] && !keystate[Key_LEFT] && !keystate[Key_RIGHT] && snake.direction !== DOWN) {
		snake.direction = UP;
	}
		if (keystate[Key_RIGHT] && !keystate[Key_UP] && !keystate[Key_DOWN] && snake.direction !== LEFT) {
		snake.direction = RIGHT;
	}
		if (keystate[Key_DOWN] && !keystate[Key_LEFT] && !keystate[Key_RIGHT] && snake.direction !== UP) {
		snake.direction = DOWN;
	}



	if (score > 40) {
		lvl++
		gs--
		score = 0

	}


	if (frames%gs === 0) {

		var nx = snake.last.x;
		var ny = snake.last.y;

		switch (snake.direction) {
			case LEFT:
				nx--;
				break;
			case UP:
				ny--;
				break;
			case RIGHT:
				nx++;
				break;
			case DOWN:
				ny++;
				break;
		}

		if (0 > nx || nx > grid.width-1  ||
			0 > ny || ny > grid.height-1 ||
			grid.get(nx, ny) === SNAKE
		) {
            endGameScreen();
            return;
		}

		if (grid.get(nx, ny) === FRUIT) {
			var tail = {x:nx, y:ny};
			score = score + 10;
            ttlscore = ttlscore + 10;
			setFood();
		} else {
			var tail = snake.remove();
			grid.set(EMPTY, tail.x, tail.y);
			tail.x = nx;
			tail.y = ny;
		}


		grid.set(SNAKE, nx, ny);

		snake.insert(nx, ny);

	}

}

function draw() {
	var tw = canvas.width/grid.width;
	var th = canvas.height/grid.height;

	for (var x = 0; x < grid.width; x++) {
		for (var y = 0; y < grid.height; y++) {
			switch (grid.get(x, y)) {
				case EMPTY:
					ctx.fillStyle = "#fff";
					break;
				case SNAKE:
					ctx.fillStyle = "#0ff";
					break;
				case FRUIT:
					ctx.fillStyle = "#f00";
					break;
			}
			ctx.fillRect(x*tw, y*th, tw, th);
		}
	}
	ctx.fillStyle = "#000";
	ctx.fillText("SCORE: " + ttlscore, 10, canvas.height - 10);

	ctx.fillStyle = "#000";
	ctx.fillText("Level: " + lvl, canvas.width-50, canvas.height - 10);
}

main();
