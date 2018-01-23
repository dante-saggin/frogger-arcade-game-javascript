// Game Constants for multiple needs
const GAMECONST = {};
GAMECONST.DURATION = 30000; // Game Duration value in milliseconds = 30 secs
GAMECONST.NUMBER_ENEMIES = 4; //MNumber of enemies that Will apear on screen
GAMECONST.Y_AJUST = 20; // Ajust to improve UX
GAMECONST.NUMBER_COLECTIBLES = 3; // Number of colectibles that will apear on canvas, which one will be chosen by random
GAMECONST.SQR_LEN_X = 101; //X Size of the base square
GAMECONST.SQR_LEN_Y = 83; //Y Size of the base square
GAMECONST.numRow = 6;
GAMECONST.numCols = 5;
// [images, points]
GAMECONST.COLLECTIBLES = [
    ['images/Gem Blue.png', 30],
    ['images/Gem Green.png', 30],
    ['images/Gem Orange.png', 30],
    ['images/Heart.png', 10],
    ['images/Star.png', 10],
    ['images/Rock.png', 0],
    ['images/Key.png', 10]
];
// PLAYER CONSTANTS
const CONSTPLAYER = {};
CONSTPLAYER.START_X_POS = 2 * GAMECONST.SQR_LEN_X; //X axis Player Start Position
CONSTPLAYER.START_Y_POS = 5 * GAMECONST.SQR_LEN_Y; // Y Axus Player Start Position
CONSTPLAYER.MIN_X_POS = 0;
CONSTPLAYER.MIN_Y_POS = -40;
CONSTPLAYER.MAX_X_POS = 4 * GAMECONST.SQR_LEN_X; //404;
CONSTPLAYER.MAX_Y_POS = 5 * GAMECONST.SQR_LEN_Y; //415;



var playerPrevXPos;
var playerPrevYPos;


// Enemies our player must avoid
var Enemy = function(startX, startY) {
    this.sprite = 'images/enemy-bug.png';
    this.x = startX;
    this.y = startY;
    this.speed = Math.floor((Math.random() * 100) + 100); // speed  between 100 and 200
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var enemyMaxXPos = 5 * GAMECONST.SQR_LEN_X;
    if (this.x < enemyMaxXPos) {
        this.x += this.speed * dt;
    } else {
        this.x = -GAMECONST.SQR_LEN_X;
        this.y = Math.floor((Math.random() * 3) + 1) * GAMECONST.SQR_LEN_Y;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// These are collectibles to earn points and other things
var Collectible = function(img, points, xPos, yPos) {
    this.sprite = img;
    this.points = points;
    this.x = xPos;
    this.y = yPos;
    this.fading = false;
    this.toDestroy = false;
};

Collectible.prototype.render = function() {
    if (this.toDestroy) {
        this.remove();
    } else {
        if (this.fading) { ctx.globalAlpha = 0.5; }
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        ctx.globalAlpha = 1;
    }
};

Collectible.prototype.remove = function() {
    canvasCollectibles.splice(canvasCollectibles.indexOf(this), 1);
};

Collectible.prototype.disappear = function(fadeTime) {
    var that = this;
    var destroyTime = fadeTime + 2000;

    setTimeout(function() {
        that.fading = true;
    }, fadeTime);

    setTimeout(function() {
        that.toDestroy = true;
    }, destroyTime);
};

Collectible.prototype.move = function() {
    var that = this;
    var EXPIRE_TIME = 5000;

    setTimeout(function() {
        setInterval(function() {
            if (that.y < 415) {
                that.y = that.y + 1;
            } else {
                clearInterval();
                that.disappear(0);
            }
        }, 1);
    }, EXPIRE_TIME);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.setSprite();
    this.x = CONSTPLAYER.START_X_POS;
    this.y = CONSTPLAYER.START_Y_POS;
    this.score = 0;
};

Player.prototype.setSprite = function() {
    this.sprite = $('.active').attr('src');
};

// Update the player's position,
// automatically to start position, when reached the water line
Player.prototype.update = function(dt) {
    if (this.y <= 0) {
        this.score += 20;
        this.reset(this.score);
        placeCollectiblesOnCanvas();
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Draw the player on the screen, required method for game
Player.prototype.handleInput = function(key) {

    switch (key) {
        case 'left': // x cannot be smaller than CONSTPLAYER.MIN_X_POS
            var leftPos = this.x - GAMECONST.SQR_LEN_X;
            if (leftPos >= CONSTPLAYER.MIN_X_POS) {
                this.x = leftPos;
            };
            break;
        case 'up': // y cannot be smaller than CONSTPLAYER.MIN_Y_POS)
            var upPos = this.y - GAMECONST.SQR_LEN_Y;
            if (upPos >= CONSTPLAYER.MIN_Y_POS) {
                this.y = upPos;
            };
            break;
        case 'right': // x cannot be bigger than CONSTPLAYER.MAX_X_POS
            var rightPos = this.x + GAMECONST.SQR_LEN_X;
            if (rightPos <= CONSTPLAYER.MAX_X_POS) {
                this.x = rightPos;
            };
            break;
        case 'down': // y cannot be bigger than CONSTPLAYER.MAX_Y_POS)
            var downPos = this.y + GAMECONST.SQR_LEN_Y;
            if (downPos <= CONSTPLAYER.MAX_Y_POS) {
                this.y = downPos;
            };
            break;
        default:
            console.log("wrong key for moving player");
    }
};

Player.prototype.reset = function(score) {
    this.x = CONSTPLAYER.START_X_POS;
    this.y = CONSTPLAYER.START_Y_POS;
    this.score = score;
    var scoreEl = document.getElementById('score');
    scoreEl.innerHTML = this.score;
};

Player.prototype.collect = function(score) {
    this.score += score;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies

var allEnemies;

function placeEnemiesOnCanvas() {
    allEnemies = [];
    for (var i = 0; i < GAMECONST.NUMBER_ENEMIES; i++) {
        var startX = -(Math.floor((Math.random() * GAMECONST.numCols)) * GAMECONST.SQR_LEN_X);
        var startY = Math.floor((Math.random() * 3) + 1) * GAMECONST.SQR_LEN_Y;
        allEnemies.push(new Enemy(startX, startY));
    }
}

function removeEnemiesFromCanvas() {
    allEnemies = [];
}



var allCollectibles = []; // create a all Collectibles array
var canvasCollectibles = []; // make sure, they do not overlap

function placeCollectiblesOnCanvas() {
    allCollectibles = [];
    canvasCollectibles = [];

    // create a copy of collectibles => allCollectibles
    GAMECONST.COLLECTIBLES.forEach(function(collectible) {
        allCollectibles.push(collectible);
    });
    var positions = []
    var xPos, yPos;
    var playCollectibleImgPoints = [];

    // only the number of Game Constant NUMBER_COLECTIBLES are placed on the canvas
    for (var x = 0; x < GAMECONST.NUMBER_COLECTIBLES; x++) {
        var index = Math.floor(Math.random() * allCollectibles.length);
        playCollectibleImgPoints.push(allCollectibles[index]);
        allCollectibles.splice(index, 1);
    }

    // place the first collectible on the canvas and for all the others call 'checkPosition'
    // to place each collectible on its own tile
    for (var i = 0; i < playCollectibleImgPoints.length; i++) {
        xPos = Math.floor((Math.random() * GAMECONST.numCols) + 0) * GAMECONST.SQR_LEN_X;
        yPos = (Math.floor((Math.random() * 3) + 1) * GAMECONST.SQR_LEN_Y) - GAMECONST.Y_AJUST;
        if (positions.length != 0) {
            var position = checkPosition(positions, xPos, yPos);
            xPos = position[0];
            yPos = position[1];
        };
        canvasCollectibles.push(new Collectible(playCollectibleImgPoints[i][0], playCollectibleImgPoints[i][1], xPos, yPos));
        positions.push([xPos, yPos]);
        // console.log("Gem position: ", playCollectibleImgPoints[i][0],xPos,yPos);
    }

    // this is a recursive function to ensure that only one collectible is placed at the place
    function checkPosition(positions, xPos, yPos) {
        for (var j = 0; j < positions.length; j++) {
            if ((xPos == positions[j][0]) && (yPos == positions[j][1])) {
                xPos = Math.floor((Math.random() * GAMECONST.numCols) + 0) * GAMECONST.SQR_LEN_X;
                yPos = (Math.floor((Math.random() * 3) + 1) * GAMECONST.SQR_LEN_Y) - GAMECONST.Y_AJUST;
                return checkPosition(positions, xPos, yPos);
            }
        }
        return [xPos, yPos];
    }

    // all Collectibles will disapear after a calculated time 10% of the game total time except the rock
    for (var i = 0; i < canvasCollectibles.length; i++) {
        if (!((canvasCollectibles[i].sprite).indexOf("Rock") > -1)) {
            canvasCollectibles[i].disappear(GAMECONST.DURATION / 10);
        }
    }
}

function removeCollectiblesFromCanvas() {
    canvasCollectibles = [];
}

// Place the player object in a variable called player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
// After adding a timer to the game, there is an activateKeys AND deactivateKeys function
// game start activate the keys, game over deactivate the keys

function activateKeys() {
    document.addEventListener('keyup', keyFunction);
}

function deactivateKeys() {
    document.removeEventListener('keyup', keyFunction);
}


function keyFunction(e) {
    // storing previous player x,y position to reset to when hitting an obstacle (stone)
    playerPrevXPos = player.x;
    playerPrevYPos = player.y;

    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
}

// set a timer for the game, started in start() function in engine.js
// with a duration of 'GAMECONST.DURATION' in milliseconds

var timerEl = document.getElementById('timer');
var timer;
var gameInterval;

function gameStart() {
    player.render();
    activateKeys(); // each game start => activate the keys
    placeEnemiesOnCanvas();
    timer = GAMECONST.DURATION / 1000;
    timerEl.innerHTML = timer;
    gameInterval = setInterval(function() {
        timer -= 1;
        timerEl.innerHTML = timer;
    }, 1000);
    disableCharacterSelection();
}

function gameStop() {
    deactivateKeys(); // each game stop => deactivate the keys
    removeEnemiesFromCanvas();
    timerEl.innerHTML = 0;
    clearInterval(gameInterval); // stop timer
    player.reset(0); // move player to start position
    removeCollectiblesFromCanvas();
    enableCharacterSelection();
}