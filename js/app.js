// Enemies our player must avoid

var Enemy = function () {
    this.sprite = 'images/enemy-bug.png';
    this.startCount = 1; // startCount turned on
    this.ypositionArray = [59, 139, 219]; // y-coordinates of positions
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
    
    this.x = this._x;
    this.y = this._y;

    if (this.startCount == 1) { // startcount turned on
        this._x = 200;
        this._y = 380;
        this.startCount = 0; // player reset. startcounter turned off
    }
    
    for (i=0; i<3; i++) {
        this.x_contact = Math.abs(allEnemies[i].x - this._x);
        this.y_contact = Math.abs(allEnemies[i].y - this._y);
        if (this.x_contact < 40 && this.y_contact < 60) {
            this.startCount = 1;
        }
    };


};

// we dont need this function because it is inherited for Enemy class
/*Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};*/

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
        } else if (this._y <= 60){
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


var Gem = function () {
    Enemy.call(this); // Gem is subclass of Enemy
    
    var test = {
        green : 'images/Gem Green',
        blue : 'images/Gem Green',
        green : 'images/Gem Green'
    }
        
/*    this.gem = function() {
        
    }
    this.green= 'images/Gem Green'; // Green Gem 
    this.blue= 'images/Gem Blue'; // Blue Gem 
    this.orange= 'images/Gem Orange'; // Orange Gem */
};





// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [new Enemy, new Enemy, new Enemy];
var player = new Player;
var gem = new Gem;


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