'use strict';

var SCORE = 0;
var HIGH_SCORE = 0;
var ENEMY_X_INIT = 0;
var ALL_ENEMIES = []; 
var Y_LOC = [ENEMY_ONE_Y, ENEMY_TWO_Y, ENEMY_THREE_Y];
var ENEM_SPEED_DIF = 100;
var ENEMY_ONE_Y = 63;
var ENEMY_TWO_Y = 145;
var ENEMY_THREE_Y = 228;
var ENEMY_LVL_SPEEDUP = 30;
var PLAYER_OCEAN_Y_CONNECT = 67;
var NUMBER_ENEMIES = 3;
var PLAYER_BORDER_MAX = 400;
var PLAYER_BORDER_MIN = 0;
var PLAYER_X_INIT = 200;
var PLAYER_Y_INIT = 400;
var PLAYER_X_MOVE = 101;
var PLAYER_Y_MOVE = 83;

/** Enemies Constructor
*   @this.speed      intial speed value for enemy objects
*   @this.x          initial x-value for enemy starting position
*   @this.y          initial y-value for enemy starting position
*   @this.sprite     location for enemy sprite image
*/

var Enemy = function(x, y, speed) {

    this.speed = speed;
    this.x = x;
    this.y = y;
    this.sprite = 'images/enemy-bug.png';

};

// Update the enemy's position
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {

    // Multiply any enemy movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += this.speed * dt;

    if (this.x > 505) {
        this.reset();
    }

};

// Randomize reset location for enemy objects

Enemy.prototype.getRandomY = function(Pos){

    switch (Pos) {
        case 1:
            return ENEMY_ONE_Y;
        case 2:
            return ENEMY_TWO_Y;
        case 3:
            return ENEMY_THREE_Y;
    }

};

// Reset enemy position after reaching right-side border

Enemy.prototype.reset = function() {

    var x = ENEMY_X_INIT - 2;	// Resets enemies a little off-screen after their first journey across the map
    var y = this.getRandomY(this.getRandomNum(1, 3));
    this.x = x;
    this.y = y;

};

// Draw the enemy on the screen

Enemy.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

// A function to get a random number between min and max

Enemy.prototype.getRandomNum = function(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;

}

/** Player Constructor
*   @this.x_move    set distance Player object moves along x-axis
*   @this.y_move    set distance Player object moves along y-axis
*   @this.x         set initial x-coordinate for player
*   @this.y         set initial y-coordinate for player
*   @this.sprite    location on drive for sprite image
*/

var Player = function () { 

    this.x_move = PLAYER_X_MOVE;
    this.y_move = PLAYER_Y_MOVE;
    this.x = PLAYER_X_INIT;
    this.y = PLAYER_Y_INIT;
    this.sprite = 'images/char-princess-girl.png';

};

// Check player collision with enemy objects, reduce score and reset player

Player.prototype.checkCollisions = function(ALL_ENEMIES) {

    //var allEnemiesLength = allEnemies.length;

    for (var i = 0; i < NUMBER_ENEMIES; i++) {
        if ((ALL_ENEMIES[i].x + 50 >= this.x) && (ALL_ENEMIES[i].x <= this.x + 50) && (ALL_ENEMIES[i].y + 50 >= this.y) && (ALL_ENEMIES[i].y <= this.y + 50)) {
            var speedReset = 100;
            for (var x = 0; x < NUMBER_ENEMIES; x++){
            	ALL_ENEMIES[x].speed = speedReset;
            	speedReset += 100; 
            }
            this.drawScore(-999);	// Reset Score from enemy collision
            this.reset();
        }
    }

};

// Reset function for player death and level completion

Player.prototype.reset = function() {

    this.x = PLAYER_X_INIT;
    this.y = PLAYER_Y_INIT;

};

// Check collisions update

Player.prototype.update = function(dt) {

// Run checkCollisions function for player running into enemy objects

    this.checkCollisions(ALL_ENEMIES);

// Reset player when there's collision with ocean border
        
    if (this.y < PLAYER_OCEAN_Y_CONNECT) {
    	this.drawScore(10); // Add 10 points for completing a level

    	for(i = 0; i < NUMBER_ENEMIES; i++){	// Increment enemy speeds for completing a level
    		ALL_ENEMIES[i].speed += ENEMY_LVL_SPEEDUP;
    	}
        this.reset();
    }

};

// Clear and Draw Player score on screen/ track high score



Player.prototype.drawScore = function(points) {

    SCORE += points;
    if(SCORE <= 0){
    	SCORE = 0;
    }
    if(SCORE > HIGH_SCORE){
    	HIGH_SCORE = SCORE;
    }
    ctx.font = "32px serif";
    ctx.clearRect(10, 590, 220, 700);
    ctx.fillText("Score: " + SCORE, 10, 625);
    ctx.fillText("High Score: " + HIGH_SCORE, 10, 675);

};

// Draw Player object and score board on canvas

Player.prototype.render = function () {

	this.drawScore(0);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

// Take input to move Player object

Player.prototype.handleInput = function(key){

  if (key === 'up' && this.y > PLAYER_BORDER_MIN){             // Decrement y coordinate, checks boundary
    this.y -= PLAYER_Y_MOVE;
  } else if (key === 'down' && this.y < PLAYER_BORDER_MAX){  // Increase y coordinate, checks boundary
    this.y += PLAYER_Y_MOVE;
  } else if (key === 'left' && this.x > PLAYER_BORDER_MIN){    // Decrement x coordinate, checks boundary
    this.x -= PLAYER_X_MOVE;
  } else if (key === 'right' && this.x < PLAYER_BORDER_MAX){ // Increase x coordinate, checks boundary
    this.x += PLAYER_X_MOVE; 
  } else {
    console.log("key not recognized");
  }

};

// Create new Player object

var player = new Player();

// Create an array of Enemy instances, setting initial location and speed

//var allEnemies = []; 
//var Y_LOC = [ENEMY_ONE_Y, ENEMY_TWO_Y, ENEMY_THREE_Y];
//var ENEM_SPEED_DIF = 100;
var enemy = new Enemy();

for (var i=0; i<3; i++) {
    enemy = new Enemy();
    ALL_ENEMIES[i] = new Enemy(ENEMY_X_INIT, Y_LOC[i], ENEM_SPEED_DIF);
    ALL_ENEMIES.push(enemy);
    ENEM_SPEED_DIF += 100;
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

document.addEventListener('keyup', function(e) {

    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);

});
