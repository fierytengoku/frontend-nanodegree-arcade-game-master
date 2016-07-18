/** Enemies Constructor
*   @this.speed      intial speed value for enemy objects
*   @this.x          initial x-value for enemy starting position
*   @this.y          initial y-value for enemy starting position
*   @this.sprite     location for enemy sprite image
*/

//var currentScore = 0;

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
            return 63;
        case 2:
            return 145;
        case 3:
            return 228;
    }

};

// Reset enemy position after reaching right-side border

Enemy.prototype.reset = function() {

    var x = -2;
    var y = this.getRandomY(getRandomNum(1, 3));
    this.x = x;
    this.y = y;

};

// Draw the enemy on the screen

Enemy.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

// A function to get a random number between min and max

function getRandomNum(min, max) {

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

    this.x_move = 101;
    this.y_move = 83;
    this.x = 200;
    this.y = 400;
    this.sprite = 'images/char-princess-girl.png';

};

// Check player collision with enemy objects, reduce score and reset player

Player.prototype.checkCollisions = function(allEnemies) {

    var allEnemiesLength = allEnemies.length;

    for (var i = 0; i < allEnemiesLength; i++) {
        if ((allEnemies[i].x + 50 >= this.x) && (allEnemies[i].x <= this.x + 50) && (allEnemies[i].y + 50 >= this.y) && (allEnemies[i].y <= this.y + 50)) {
            var speedReset = 100;
            for (var x = 0; x < 3; x++){
            	allEnemies[x].speed = speedReset;
            	speedReset += 100; 
            }
            drawScore(-999);	// Reset Score from enemy collision
            this.reset();
        }
    }

};

// Reset function for player death and level completion

Player.prototype.reset = function() {

    this.x = 200;
    this.y = 400;

};

// Check collisions update

Player.prototype.update = function(dt) {

// Run checkCollisions function for player running into enemy objects

    this.checkCollisions(allEnemies);

// Reset player when there's collision with ocean border
        
    if (this.y < 67) {
    	drawScore(10); // Add 10 points for completing a level

    	for(i = 0; i < 3; i++){	// Increment enemy speeds for completing a level
    		allEnemies[i].speed += 30;
    	}
        this.reset();
    }

};

// Clear and Draw Player score on screen/ track high score

var SCORE = 0;
var HIGH_SCORE = 0;

function drawScore(points) {
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
}

// Draw Player object and score board on canvas

Player.prototype.render = function () {

	drawScore(0);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

// Take input to move Player object

Player.prototype.handleInput = function(key){

  if (key === 'up' && this.y > 0){             // Decrement y coordinate, checks boundary
    this.y -= 83;
  } else if (key === 'down' && this.y < 400){  // Increase y coordinate, checks boundary
    this.y += 83;
  } else if (key === 'left' && this.x > 0){    // Decrement x coordinate, checks boundary
    this.x -= 101;
  } else if (key === 'right' && this.x < 400){ // Increase x coordinate, checks boundary
    this.x += 101; 
  } else {
    console.log("key not recognized");
  }

};

// Create new Player object

var player = new Player();

// Create an array of Enemy instances, setting initial location and speed

var allEnemies = []; 
var x_loc = 0;
var y_loc = [63, 145, 228];
var enem_speed = 100;
var enemy = new Enemy();

for (i=0; i<3; i++) {
    enemy = new Enemy();
    allEnemies[i] = new Enemy(0, y_loc[i], enem_speed);
    allEnemies.push(enemy);
    enem_speed += 100;
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
