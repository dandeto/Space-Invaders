var sfx, music;
var alien1, alien2, alien3, alien12, alien22, alien32, ufo, block, block1, block2, block3;
var row1 = 11;//number of aliens in row one
var row2 = 33;//number of aliens in row 2 and 3
var row3 = 55;//number of aliens in row 4 and 5
var velocity = 0;
var c, ctx, ship, bullet;
var left = right = false;
var ammo = true;
var shoot = false;
var modifier = 35;
var yMod = 75;
var xMod = 50;
var shift = 0;
var block = [];
var aliens = [];
var lazers = [];
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
	window.onload = function() {
		c = document.getElementById("canvas");
		ctx = c.getContext("2d");
		alien1 = document.getElementById("alien1");
		alien2 = document.getElementById("alien2");
		alien3 = document.getElementById("alien3");
		alien12 = document.getElementById("alien1-2");
		alien22 = document.getElementById("alien2-2");
		alien32 = document.getElementById("alien3-2");
		music = document.querySelectorAll(".music");
		sfx = document.querySelectorAll(".sfx");
		document.body.addEventListener("keydown", keyDown);
		document.body.addEventListener("keyup", keyUp);
		setInterval(update, 1000/60);
		ship = {
			image: document.getElementById("shipImage"),
			x: c.width/2 -25,
			y: c.height - 30,//static
			width: 52,
			height: 32
		}
		bullet = {
			speed: -6,
			width: 2,
			height: 10,
			x: ship.x,
			y: ship.y
		}
		for (var i = 0; i < 40; i++) {
			if (i == 3 || i == 5 || i == 7 || i == 13 || i == 15 || i == 17 || i == 23 || i == 25 || i == 27 || i == 33 || i == 35 || i == 37) {
				xMod += 12.5;
			}
			if (i == 3 || i == 5 || i == 13 || i == 15 || i==23 || i == 25 || i==33 || i == 35) {
				yMod = 91.7;
			}
			if (i == 10 || i == 20 || i == 30) {
				xMod += 75;
				yMod = 75;
			}
			if (i == 7 || i == 17 || i == 27 || i == 37) {
				yMod = 75;
			}
			block.push(
			{
				image: document.getElementById("block"),
				x: xMod,
				y: c.height - yMod,
				width: 50/4,
				height: 50/3,
				hits: 0
				});
			yMod += 16.7;
		}
		for (var i = 0; i < 55; i++) {
			if (i == 0 || i == 11 || i == 22 || i == 33 || i == 44) {
				modifier = 10;
				shift += 35;
			}

			aliens.push(
			{
				image: document.getElementById("alien1"),
				imgState: 1,
				speed: .08,
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
			image: document.getElementById("ufo"),
			speed: 1,
			time: 6000,
			x: 500,
			y: 30,//static
			width: 32,
			height: 14
		}
		changeTime();
		playMusic();
		makeLazers();
	}

	function Lazer(x, y, width, height, speed, color) {	//alien lazer constructor.
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = speed;
		this.color = color;
	}

	function keyDown(e) {
		switch(e.keyCode) {
			case 32:
				shoot = true;
				if(ammo && gameOver == false) {
					sfx[2].currentTime = 0;
					sfx[2].play();
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
		switch(e.keyCode) {
			case 37:
				left = false;
				break;
			case 39:
				right = false;
				break;
		}
	}

	function update() {
		if (gameOver == false) {
			if (left) { //movement
				velocity = -4;
			}
			if (right) {
				velocity = 4;
			}

			ship.x += velocity; //move the ship

			if (left == false) {
				velocity = 0;
			}
			if (right == false) {
				velocity = 0;
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
				if(shoot == true && bullet.x + bullet.width >= block[i].x &&
				 bullet.x <= block[i].x + block[i].width &&
				 bullet.y < block[i].y + block[i].height) {
				 	block[i].hits++;
					reset();
				}
				if (block[i].hits == 1) {
					block[i].image = document.getElementById("block1");
				}
				if (block[i].hits == 2) {
					block[i].image = document.getElementById("block2");
				}
				if (block[i].hits == 3) {
					block[i].image = document.getElementById("block3");
				}
				if (block[i].hits >= 4) {
					block.splice(i, 1);
				}
			}

			if (ufoMove == true) {
				ufo.x += -ufo.speed; //move the ship
				if (intro) {
					sfx[3].currentTime = 0;
					sfx[3].play();
				}
				if (ufo.x + ufo.width <= 0) {
					ufo.x = 500;
					ufoMove = false;
					intro = true;
				}
				if (sfx[3].currentTime = 1) {
					intro = false;
					sfx[4].play();
				}
			}

			if(shoot == true && bullet.x + bullet.width >= ufo.x &&
				 bullet.x <= ufo.x + ufo.width &&
				 bullet.y < ufo.y + ufo.height && bullet.y > ufo.y) {
				sfx[4].currentTime = 0;
				reset();
				ufoMove = false;
				ufoShot = true;
				var min = 0;
				var max = 3;
				points = [50, 100, 150, 300];
				num = Math.floor(Math.random() * (max - min +1)) + min;
				score += points[num];
				setTimeout(function() {   
					ufo.x = 500;
					ufoShot = false;
				}, 100);
			}

			for (var i = 0; i < lazers.length; i++) {
			    if ((lazers[i].y + lazers[i].height) > canvas.height) {
			    	lazers.splice(i,1);
			    }
			   	if (lazers[i].x > ship.x && (lazers[i].x + lazers[i].width) < (ship.x + ship.width) &&
			   		(lazers[i].y + lazers[i].height) > ship.y && (lazers[i].y + lazers[i].height) < ship.y + ship.height) {
			    	lazers.splice(i,1);
			    	lives --;
			    	sfx[0].play();
			    }
			    for (var j = 0; j < block.length; j++) {
				    if (lazers[i].x + lazers[i].width >= block[j].x &&
				 		lazers[i].x <= block[j].x + block[j].width &&
				 		lazers[i].y + lazers[i].height > block[j].y + block[j].height) {
				    	block[j].hits ++;
				    	lazers.splice(i,1);
				    }
				}
			}

			//select aliens
			for (var i = 0; i < aliens.length; i++) {
				aliens[i].x += aliens[i].speed; // move aliens
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

				if(shoot == true && bullet.x + bullet.width >= aliens[i].x &&
				 bullet.x <= aliens[i].x + aliens[i].width &&
				 bullet.y < aliens[i].y + aliens[i].height && bullet.y > aliens[i].y) { // did an alien get hit?
				 	aliens[i].hits++;
				 	sfx[1].play();
				 	reset();
					(function(i) {
	            		setTimeout(function() {             
	                		aliens.splice(i, 1);
							if (i < row1) {//decrease # of nodes accounted for when node # decreases as splicing the array occurs
								row1--;
								row2--;
								row3 = aliens.length;
								score += 30;
							}
							else if (i < row2 && i > row1 - 1) { //using else if so that the if statement will break when one is true
								row2--;
								row3 = aliens.length;
								score += 20;
							}
							else if (i < row3 && i > row2 - 1) {
								row3 = aliens.length;
								score += 10;
							}

							if (aliens[i].speed < 0) { //if (-) speed, then increase (-) speed
								for (var j = 0; j < aliens.length; j++) {
									aliens[j].speed += -.005*aliens[j].speedModifier;
								}
							} else { //if (+) speed, then increase (+) speed
							 	for (var j = 0; j < aliens.length; j++) {
									aliens[j].speed += .005*aliens[j].speedModifier;
								}
							}
						}, 100);
					})(i);
				}
			}

			if(aliens.length == 0) {
				level ++;
				lives ++;
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

					aliens.push(
					{
						image: document.getElementById("alien1"),
						imgState: 1,
						speed: .08,
						x: modifier,
						xPos: modifier,
						y: shift,
						width: 24,
						height: 24,
						hits: 0,
						speedModifier: 1
						});
					modifier += 35;
					aliens[j].speedModifier = 1 + level/5;
					aliens[j].speed *= aliens[j].speedModifier;
				}
			}

			if (shoot == true) { //can we shoot?
				if (ammo == true) { //where bullet spawns
					bullet.x = ship.x+ship.width/2;
					bullet.y = ship.y;
					ammo = false;
				}
				bullet.y += bullet.speed; //shoot bullet
			}
			render();
		}
	}

	function reset() { //reset ammo and shoot state
		shoot = false;
		ammo = true;
		bullet.y = ship.y;
	}

	function makeLazers() {
		var highX = 0;
		var highY = 0;
		if (gameOver == false) {
			var min = 0;
			var max = 6;
			var number = Math.floor(Math.random() * (max - min +1)) + min;
			for (var i = 0; i < aliens.length; i++) {
				if(aliens[i].x + aliens[i].width > highX) {
					highX = aliens[i].x + aliens[i].width;
				}
				if(aliens[i].y > highY) {
					highY = aliens[i].y;
				}
			}
			setTimeout(function(){
				if (lazers.length < 4) {	//make lazers
					l = aliens.length - 1;
					var x = Math.floor(Math.random() * ((highX) - aliens[0].x +1)) + aliens[0].x;
					var y = Math.floor(Math.random() * (aliens[0].y - highY +1)) + highY;
			    	var lazer = new Lazer(x, y, 4, 20, 3, 'white'); // speed is 5
			    	lazers.push(lazer);
			  	}
			    makeLazers();
			}, delay[number]);
		}
		
	}

	function changeTime() {
		longTime = (120000 * Math.random());
		setTimeout(function(){ ufoMove = true; changeTime();}, longTime);
	}

	function playMusic() {
		if (gameOver == false) {
			var speed;
			if (aliens[0].speed < 0) {
				speed = -aliens[0].speed;
			} else {
				speed = aliens[0].speed;
			}
			time = (1000 - (speed * 500));
			setTimeout(function(){ music[0].play(); animate();}, time);
			setTimeout(function(){ music[1].play(); animate();}, time + time);
			setTimeout(function(){ music[2].play(); animate();}, time + time + time);
			setTimeout(function(){ music[3].play(); animate(); playMusic();}, time + time + time + time);
		}
	}

	function animate() {
		for (var i = 0; i < aliens.length; i++) {
			switch(aliens[i].imgState) {
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
		aliens[i].image = document.getElementById("death");
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
			ctx.font="15px Verdana";
			ctx.fillText(points[num], ufo.x, ufo.y);
		}
		
		ctx.fillStyle = "lime";
		for (var i = 0; i < block.length; i++) {
			ctx.drawImage(block[i].image, block[i].x, block[i].y, block[i].width, block[i].height);
		}
		if (shoot) {
			ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
		}

		ctx.fillStyle = "white";
		ctx.font="15px Verdana";
		ctx.fillText("SCORE: " + score, c.width-200, 20);
		ctx.font="15px Verdana";
		ctx.fillText("LIVES: " + lives, 50, 20);
		if (gameOver == false) {
			for (var i = 0; i < aliens.length; i++) {
				if (i < row1) {
					if (aliens[i].hits >= 1) {
						death(i);
					}
					else if (aliens[i].imgState == 1) {
						aliens[i].image = document.getElementById("alien1");
					}
					else if (aliens[i].imgState == 2) {
						aliens[i].image = document.getElementById("alien1-2");
					}
					ctx.drawImage(aliens[i].image, aliens[i].x, aliens[i].y, aliens[i].width, aliens[i].height);
				}
				if (i < row2 && i > row1 - 1) {
					if (aliens[i].hits >= 1) {
						death(i);
					}
					else if (aliens[i].imgState == 1) {
						aliens[i].image = document.getElementById("alien2");
					}
					else if (aliens[i].imgState == 2) {
						aliens[i].image = document.getElementById("alien2-2");
					}
					aliens[i].width = 24;
					aliens[i].height = 17;
					ctx.drawImage(aliens[i].image, aliens[i].x, aliens[i].y, aliens[i].width, aliens[i].height);
				}
				if (i < row3 && i > row2 - 1) {
					if (aliens[i].hits >= 1) {
						death(i);
					}
					else if (aliens[i].imgState == 1) {
						aliens[i].image = document.getElementById("alien3");
					}
					else if (aliens[i].imgState == 2) {
						aliens[i].image = document.getElementById("alien3-2");
					}
					aliens[i].width = 24;
					aliens[i].height = 16;
					ctx.drawImage(aliens[i].image, aliens[i].x, aliens[i].y, aliens[i].width, aliens[i].height);
				}
			}
			for (var i = 0; i < lazers.length; i++) {
			    	lazers[i].draw();
			   		lazers[i].y += lazers[i].speed;
			   	}
		} else {
			ctx.font="30px Verdana";
			ctx.fillText("GAME OVER", c.width/3, c.height/2);
		}
	}

	Lazer.prototype.draw = function() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height, this.speed, this.color);
	}
