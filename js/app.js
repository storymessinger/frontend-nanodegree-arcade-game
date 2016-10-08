/*
    Randomize array element order in-place.
    Using Durstenfeld shuffle algorithm.
 */

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

// Arrays used for random placing
var xArray = [0, 100, 200, 300, 400];
var yArray = [60, 140, 220, 300, 380];

// Enemies our player must avoid
var Enemy = function () {
    this.sprite = 'images/enemy-bug.png';
    this.startCount = 1; // startCount turned on
    this.ypositionArray = yArray.slice(0, 3);
    //    this.ypositionArray = [59, 139, 219]; // y-coordinates of positions
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {

    if (this.startCount == 1) {
        this._x = -300; // move the enemy back to original x-position
        this.y = this.ypositionArray[Math.floor(Math.random() * 3)]; // move the enemy in one of six y-position 
        this.vx = Math.floor(Math.random() * 300) + 100; // the x-velocity is randomly selected within the range of 100 to 300
        this.startCount = 0; // startCount is turned off
    } else if (this.x > ctx.canvas.width) {
        this.startCount = 1; // startCount is turned on
    }
    this._x += this.vx * dt;
    this.x = this._x; // upating the x-position
};

Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function () {
    Enemy.call(this); // Player is subclass of Enemy
    this.sprite = 'images/char-boy.png'; // Starting character
};

Player.prototype = Object.create(Enemy.prototype);

Player.prototype.update = function () {

    if (this.startCount == 1) { // startcount turned on
        this._x = 200;
        this._y = 380;
        this.startCount = 0; // player reset. startcounter turned off
    }

    for (i = 0; i < 3; i++) {
        this.x_contact = Math.abs(allEnemies[i].x - this._x);
        this.y_contact = Math.abs(allEnemies[i].y - this._y);
        if (this.x_contact < 40 && this.y_contact < 60) {
            this.startCount = 1;
        }
    };
    this.x = this._x;
    this.y = this._y;

};

Player.prototype.handleInput = function (keyInput) {
    switch (keyInput) {
    case 'left':
        if (this._x > 0) {
            this._x -= 100;
        }
        break;
    case 'up':
        if (this._y > 60) {
            this._y -= 80;
        } else if (this._y <= 60) {
            this._y -= 80;
            this.startCount = 1;
        }
        break;
    case 'right':
        if (this._x < 400) {
            this._x += 100;
        }
        break;
    case 'down':
        if (this._y < 380) {
            this._y += 80;
        }
        break;
    }
};

var Gem = function (color_num) {
    Enemy.call(this); // Gem is subclass of Enemy
    this.color_num = color_num;
    this.gems = [
         'images/Gem Green.png',
         'images/Gem Blue.png',
         'images/Gem Orange.png'
    ];
    this.sprite = this.gems[color_num];
    this.reappearCount = 0;
};


Gem.prototype = Object.create(Enemy.prototype);


Gem.prototype.update = function () {
    if (this.startCount == 1) {
        this._x = shuffleArray(xArray)[0];
        switch (this.color_num) {
        case 0:
            this._y = shuffleArray(yArray.slice(3))[0];
            break;
        case 1:
            this._y = shuffleArray(yArray.slice(0, 1))[0];
            break;
        case 2:
            this._y = shuffleArray(yArray.slice(1, 3))[0];
            break;
        }
        this.startCount = 0; // player reset. startcounter turned off
    }

    this.x = this._x;
    this.y = this._y;
    
    this.x_contact = Math.abs(player.x - this._x);
    this.y_contact = Math.abs(player.y - this._y);
//    if (this.x_contact < 40 && this.y_contact < 60 && this._x > 0 ){
    if ((this.x_contact < 40 && this.y_contact < 60) && this.reappearCount==0){
        this._x = 900; // Sending the gem temporarilry to outside canvas
        this._y = 900;
        this.reappearCount = 1; // reappearCount is now on
    }
    
    this.reappear = function() {
        this.startCount = 1; // startCount is now on
    }; 
    
    if (this.reappearCount == 1) {
        this.reappearCount = 0;
        var $this= this; // setTimeout has different this, so we use global variable $this to send it in
        setTimeout(function() {
            $this.startCount = 1; // startCount of specific gem is now on
        }, Math.floor(Math.random() * 3000)+ 1000); // startCount is turned on after randomly selected time, within the range of 1000 to 3000;)
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [new Enemy, new Enemy, new Enemy];
var player = new Player;
var allGems = [new Gem(0), new Gem(1), new Gem(2)];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});