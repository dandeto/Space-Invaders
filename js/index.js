var row1 = 11; //number of aliens in row one
var row2 = 33; //number of aliens in row 2 and 3
var row3 = 55; //number of aliens in row 4 and 5
var c, ctx, ship, bullet;
var left = right = false;
var modifier = 35;
var yMod = 75;
var xMod = 50;
var shift = 0;
var block = [];
var aliens = [];
var lasers = [];
var delay = [500, 250, 1000, 1500, 2000, 3000, 4000];
var gameOver = false;
var score = 0;
var level = 1;
var lives = 3;
var time, longTime, num, points;
var ufoMove = false;
var ufoShot = false;
var intro = true;
var l;
var objects_loaded = 0,
    objects_total = 2; //images and audio
var c = document.getElementById("canvas"),
    ctx = c.getContext("2d");

function textureConstruct(url,parent) {
    let img = new Image();
    img.src = url;
    img.addEventListener("load", manage(parent));
    return img;
}

function audioConstruct(url,parent) {
    let aud = new Audio(url);
    aud.addEventListener("load", manage(parent));
    return aud;
}

function manage(parent) {
    parent.loaded++;
    if (parent.loaded == parent.total) {
        objects_loaded++;
    }
    if (objects_loaded == objects_total) {
        setup();
    }
}

function imageConstruct() {
    this.complete = false;
    this.counted = false;
    this.loaded = 0;
    this.total = 12;
    this.alien1= new textureConstruct("img/alien1.png",this);
    this.alien2 = new textureConstruct("img/alien2.png",this);
    this.alien3 = new textureConstruct("img/alien3.png",this);
    this.alien12 = new textureConstruct("img/alien1-2.png",this);
    this.alien22 = new textureConstruct("img/alien2-2.png",this);
    this.alien32 = new textureConstruct("img/alien3-2.png",this);
    this.ship = new textureConstruct("img/ship.png",this);
    this.ufo = new textureConstruct("img/ufo.png",this);
    this.block = new textureConstruct("img/block.png",this);
    this.block1 = new textureConstruct("img/block1.png",this);
    this.block2 = new textureConstruct("img/block2.png",this);
    this.block3 = new textureConstruct("img/block3.png",this);
    this.death = new textureConstruct("img/death.png",this);
}
var images = new imageConstruct();

function audioContainerConstructor() {
    this.complete = false;
    this.counted = false;
    this.loaded = 0;
    this.total = 9;
    this.beat = {
        a: new audioConstruct("audio/beat1.wav",this),
        b: new audioConstruct("audio/beat2.wav",this),
        c: new audioConstruct("audio/beat3.wav",this),
        d: new audioConstruct("audio/beat4.wav",this)
    },
    this.sfx = {
        ship_explode: new audioConstruct("audio/ship_explode.wav",this),
        invader_die: new audioConstruct("audio/invader_die.wav",this),
        shoot: new audioConstruct("audio/shoot.wav",this),
        ufo_intro: new audioConstruct("audio/ufoIntro.wav",this),
        ufo_loop: new audioConstruct("audio/ufoLoop.wav",this)

    }
};
var audio = new audioContainerConstructor();

document.body.addEventListener("keydown", keyDown);
document.body.addEventListener("keyup", keyUp);

function setup() {
    ship = {
        image: images.ship,
        x: c.width / 2 - 25,
        y: c.height - 30, //static
        width: 52,
        height: 32,
        velocity: 0,
        ammo: true,
        shoot: false
    }
    bullet = {
        speed: -400,
        width: 2,
        height: 10,
        x: ship.x,
        y: ship.y
    }
    for (var i = 0; i < 40; i++) {
        if (i == 3 || i == 5 || i == 7 || i == 13 || i == 15 || i == 17 || i == 23 || i == 25 || i == 27 || i == 33 || i == 35 || i == 37) {
            xMod += 12.5;
        }
        if (i == 3 || i == 5 || i == 13 || i == 15 || i == 23 || i == 25 || i == 33 || i == 35) {
            yMod = 91.7;
        }
        if (i == 10 || i == 20 || i == 30) {
            xMod += 75;
            yMod = 75;
        }
        if (i == 7 || i == 17 || i == 27 || i == 37) {
            yMod = 75;
        }
        block.push({
            image: images.block,
            x: xMod,
            y: c.height - yMod,
            width: 50 / 4,
            height: 50 / 3,
            hits: 0
        });
        yMod += 16.7;
    }
    for (var i = 0; i < 55; i++) {
        if (i == 0 || i == 11 || i == 22 || i == 33 || i == 44) {
            modifier = 10;
            shift += 35;
        }

        aliens.push({
            image: images.alien1,
            imgState: 1,
            speed: 10,
            x: modifier,
            y: shift,
            width: 24,
            height: 24,
            hits: 0,
            speedModifier: 1
        });
        modifier += 40;
    }
    ufo = {
        image: images.ufo,
        speed: 100,
        time: 6000,
        x: 500,
        y: 30, //static
        width: 32,
        height: 14
    }
    changeTime();
    playMusic();
    makelasers();
    requestAnimationFrame(update); //change to RAF
}

function laserConstruct(x, y, width, height, speed) { //alien laser constructor.
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.color = "white";
    this.draw = function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height, this.speed);
    }
}

function keyDown(e) {
    switch (e.keyCode) {
        case 32:
            ship.shoot = true;
            if (ship.ammo && gameOver == false) {
                audio.sfx.shoot.currentTime = 0;
                audio.sfx.shoot.play();
            }
            break;
        case 37:
            left = true;
            break;
        case 39:
            right = true;
            break;
    }
}

function keyUp(e) {
    switch (e.keyCode) {
        case 37:
            left = false;
            break;
        case 39:
            right = false;
            break;
    }
}


let dt = 0;
let last = 0;
let currentTime = 0;

function update(ms) {
    requestAnimationFrame(update);

    const t = ms / 1000; //loop crap
    dt = t - last;
    last = t;

    if (gameOver == false) {
        if (left) { //movement
            ship.velocity = -200*dt;
        }
        if (right) {
            ship.velocity = 200*dt;
        }

        ship.x += ship.velocity; //move the ship

        if (left == false) {
            ship.velocity = 0;
        }
        if (right == false) {
            ship.velocity = 0;
        }

        if (ship.x >= c.width - ship.width) { //collisions
            ship.x = c.width - ship.width;
        }
        if (ship.x <= 0) {
            ship.x = 0;
        }

        if (bullet.y <= 20) { //reset bullet
            reset();
        }

        for (var i = 0; i < block.length; i++) { //score hits on blocks
            if (ship.shoot == true && bullet.x + bullet.width >= block[i].x &&
                bullet.x <= block[i].x + block[i].width &&
                bullet.y < block[i].y + block[i].height) {
                block[i].hits++;
                reset();
            }
            if (block[i].hits == 1) {
                block[i].image = images.block1;
            }
            if (block[i].hits == 2) {
                block[i].image = images.block2;
            }
            if (block[i].hits == 3) {
                block[i].image = images.block3;
            }
            if (block[i].hits >= 4) {
                block.splice(i, 1);
            }
        }

        if (ufoMove == true) {
            ufo.x += -ufo.speed*dt; //move the ufo
            if (intro) {
                audio.sfx.ufo_intro.currentTime = 0;
                audio.sfx.ufo_intro.play();
            }
            if (ufo.x + ufo.width <= 0) {
                ufo.x = 500;
                ufoMove = false;
                intro = true;
            }
            if (audio.sfx.ufo_intro.currentTime = 1) {
                intro = false;
                audio.sfx.ufo_loop.play();
            }
        }

        if (ship.shoot == true && bullet.x + bullet.width >= ufo.x &&
            bullet.x <= ufo.x + ufo.width &&
            bullet.y < ufo.y + ufo.height && bullet.y > ufo.y) {
            audio.sfx.ufo_loop.currentTime = 0;
            reset();
            ufoMove = false;
            ufoShot = true;
            var min = 0;
            var max = 3;
            points = [50, 100, 150, 300];
            num = Math.floor(Math.random() * (max - min + 1)) + min;
            score += points[num];
            setTimeout(function() {
                ufo.x = 500;
                ufoShot = false;
            }, 100);
        }

        for (var i = 0; i < lasers.length; i++) {
            lasers[i].y += lasers[i].speed;
            if ((lasers[i].y + lasers[i].height) > canvas.height) {
                lasers.splice(i, 1);
            }
            else if (lasers[i].x > ship.x && (lasers[i].x + lasers[i].width) < (ship.x + ship.width) &&
                (lasers[i].y + lasers[i].height) > ship.y && (lasers[i].y + lasers[i].height) < ship.y + ship.height) {
                lasers.splice(i, 1);
                lives--;
                audio.sfx.ship_explode.play();
            } else {
                for (var j = 0; j < block.length; j++) {
                    if (lasers[i].x + lasers[i].width >= block[j].x &&
                        lasers[i].x <= block[j].x + block[j].width &&
                        lasers[i].y + lasers[i].height > block[j].y + block[j].height) {
                        block[j].hits++;
                        lasers.splice(i, 1);
                    }
                }
            }
        }

        //select aliens
        for (var i = 0; i < aliens.length; i++) {
            aliens[i].x += aliens[i].speed*dt; // move aliens
            if (aliens[i].x <= 9) { //touching left wall? bounce.
                for (var j = 0; j < aliens.length; j++) {
                    aliens[j].x += 1;
                    aliens[j].speed = -aliens[j].speed; //reverse movement
                    aliens[j].y += 25;
                }
            }
            if (aliens[i].x >= canvas.width - aliens[i].width - 10) { //touching right wall? bounce
                for (var j = 0; j < aliens.length; j++) {
                    aliens[j].x += -1;
                    aliens[j].speed = -aliens[j].speed;
                    aliens[j].y += 25;
                }
            }

            if (aliens[i].y >= canvas.height - 75) { //check if an alien gets to the bottom
                gameOver = true;
            }

            if (ship.shoot == true && bullet.x + bullet.width >= aliens[i].x &&
                bullet.x <= aliens[i].x + aliens[i].width &&
                bullet.y < aliens[i].y + aliens[i].height && bullet.y > aliens[i].y) { // did an alien get hit?
                aliens[i].hits++;
                audio.sfx.invader_die.play();
                reset();
                (function(i) {
                    setTimeout(function() {
                        aliens.splice(i, 1);
                        if (i < row1) { //decrease # of nodes accounted for when node # decreases as splicing the array occurs
                            row1--;
                            row2--;
                            row3 = aliens.length;
                            score += 30;
                        } else if (i < row2 && i > row1 - 1) { //using else if so that the if statement will break when one is true
                            row2--;
                            row3 = aliens.length;
                            score += 20;
                        } else if (i < row3 && i > row2 - 1) {
                            row3 = aliens.length;
                            score += 10;
                        }

                        if (aliens[i].speed < 0) { //if (-) speed, then increase (-) speed
                            for (var j = 0; j < aliens.length; j++) {
                                aliens[j].speed += -.02 * aliens[j].speedModifier;
                            }
                        } else { //if (+) speed, then increase (+) speed
                            for (var j = 0; j < aliens.length; j++) {
                                aliens[j].speed += .02 * aliens[j].speedModifier;
                            }
                        }
                    }, 100);
                })(i);
            }
        }

        if (aliens.length == 0) {
            level++;
            lives++;
            modifier = 75;
            shift = 0;
            row1 = 11;
            row2 = 33;
            row3 = 55;
            for (var j = 0; j < 55; j++) {
                if (j == 0 || j == 11 || j == 22 || j == 33 || j == 44) {
                    modifier = 10;
                    shift += 35;
                }

                aliens.push({
                    image: images.alien1,
                    imgState: 1,
                    speed: 10,
                    x: modifier,
                    xPos: modifier,
                    y: shift,
                    width: 24,
                    height: 24,
                    hits: 0,
                    speedModifier: 1
                });
                modifier += 35;
                aliens[j].speedModifier = 1 + level / 5;
                aliens[j].speed *= aliens[j].speedModifier;
            }
        }

        if (ship.shoot == true) { //can we shoot?
            if (ship.ammo == true) { //where bullet spawns
                bullet.x = ship.x + ship.width / 2;
                bullet.y = ship.y;
                ship.ammo = false;
            }
            bullet.y += bullet.speed*dt; //shoot bullet
        }
        render();
    }
}

function reset() { //reset ship.ammo and shoot state
    ship.shoot = false;
    ship.ammo = true;
    bullet.y = ship.y;
}

function makelasers() {
    var highX = 0;
    var highY = 0;
    if (gameOver == false) {
        var min = 0;
        var max = 6;
        var number = Math.floor(Math.random() * (max - min + 1)) + min;
        for (var i = 0; i < aliens.length; i++) {
            if (aliens[i].x + aliens[i].width > highX) {
                highX = aliens[i].x + aliens[i].width;
            }
            if (aliens[i].y > highY) {
                highY = aliens[i].y;
            }
        }
        setTimeout(function() {
            if (lasers.length < 4) { //make lasers
                l = aliens.length - 1;
                var x = Math.floor(Math.random() * ((highX) - aliens[0].x + 1)) + aliens[0].x;
                var y = Math.floor(Math.random() * (aliens[0].y - highY + 1)) + highY;
                var laser = new laserConstruct(x, y, 4, 20, 3); // speed is 5
                lasers.push(laser);
            }
            makelasers();
        }, delay[number]);
    }
}

function changeTime() {
    longTime = (120000 * Math.random());
    setTimeout(function() {
        ufoMove = true;
        changeTime();
    }, longTime);
}

function playMusic() {
    if (gameOver == false) {
        var speed;
        if (aliens[0].speed < 0) {
            speed = -aliens[0].speed;
        } else {
            speed = aliens[0].speed;
        }
        time = (1000 - (speed * 5));
        setTimeout(function() {
            audio.beat.a.play();
            animate();
        }, time);
        setTimeout(function() {
            audio.beat.b.play();
            animate();
        }, time*2);
        setTimeout(function() {
            audio.beat.c.play();
            animate();
        }, time*3);
        setTimeout(function() {
            audio.beat.d.play();
            animate();
            playMusic();
        }, time*4);
    }
}

function animate() {
    for (var i = 0; i < aliens.length; i++) {
        switch (aliens[i].imgState) {
            case 1:
                aliens[i].imgState = 2;
                break;
            case 2:
                aliens[i].imgState = 1;
                break;
        }
    }
}

function death(i) {
    aliens[i].image = images.death;
    aliens[i].width = 26;
    aliens[i].height = 16;
}

function render() {
    if (lives <= 0) {
        gameOver = true;
    }
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(ship.image, ship.x, ship.y, ship.width, ship.height);
    if (ufoShot == false) {
        ctx.drawImage(ufo.image, ufo.x, ufo.y, ufo.width, ufo.height);
    } else {
        ctx.fillStyle = "white";
        ctx.font = "15px Verdana";
        ctx.fillText(points[num], ufo.x, ufo.y);
    }

    ctx.fillStyle = "lime";
    for (var i = 0; i < block.length; i++) {
        ctx.drawImage(block[i].image, block[i].x, block[i].y, block[i].width, block[i].height);
    }
    if (ship.shoot) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }

    ctx.fillStyle = "white";
    ctx.font = "15px Verdana";
    ctx.fillText("SCORE: " + score, c.width - 200, 20);
    ctx.font = "15px Verdana";
    ctx.fillText("LIVES: " + lives, 50, 20);
    if (gameOver == false) {
        for (var i = 0; i < aliens.length; i++) {
            if (i < row1) {
                if (aliens[i].hits >= 1) {
                    death(i);
                } else if (aliens[i].imgState == 1) {
                    aliens[i].image = images.alien1;
                } else if (aliens[i].imgState == 2) {
                    aliens[i].image = images.alien12;
                }
                ctx.drawImage(aliens[i].image, aliens[i].x, aliens[i].y, aliens[i].width, aliens[i].height);
            }
            if (i < row2 && i > row1 - 1) {
                if (aliens[i].hits >= 1) {
                    death(i);
                } else if (aliens[i].imgState == 1) {
                    aliens[i].image = images.alien2;
                } else if (aliens[i].imgState == 2) {
                    aliens[i].image = images.alien22;
                }
                aliens[i].width = 24;
                aliens[i].height = 17;
                ctx.drawImage(aliens[i].image, aliens[i].x, aliens[i].y, aliens[i].width, aliens[i].height);
            }
            if (i < row3 && i > row2 - 1) {
                if (aliens[i].hits >= 1) {
                    death(i);
                } else if (aliens[i].imgState == 1) {
                    aliens[i].image = images.alien3;
                } else if (aliens[i].imgState == 2) {
                    aliens[i].image = images.alien32;
                }
                aliens[i].width = 24;
                aliens[i].height = 16;
                ctx.drawImage(aliens[i].image, aliens[i].x, aliens[i].y, aliens[i].width, aliens[i].height);
            }
        }
        for (var i = 0; i < lasers.length; i++) {
            lasers[i].draw();
        }
    } else {
        ctx.font = "30px Verdana";
        ctx.fillText("GAME OVER", c.width / 3, c.height / 2);
    }
}
