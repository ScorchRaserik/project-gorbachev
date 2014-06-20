WNDR.Main = function(game) {
	PLAYER_SCALE = 1.0;
	PLAYER_SPAWN_X = 226;
	PLAYER_SPAWN_Y = 700;
	nextFire = 0;
	fireRate = 100;
	shotDirection = 'right';
	reverseShot = false;
	isIndoors = false;
	isOnLedge = false;
	currentPlatHeight = null;
};

WNDR.Main.prototype = {

	create: function() {
		//Physics setup
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.world.setBounds(0, 0, 5300, 1200);

		house1 = this.add.sprite(100, 700, 'house', 0);

		//Set up environment
		platforms = this.game.add.group();
		platforms.enableBody = true;
		p1 = platforms.create(0, 1100, 'ground');
		p1.scale.setTo(8, 1);
		p2 = platforms.create(400, 1050, 'ground');
		p2.scale.setTo(4, 2);
		p3 = platforms.create(600, 950, 'ground');
		p3.scale.setTo(4, 4);
		p4 = platforms.create(800, 800, 'ground');
		p4.scale.setTo(4, 7);
		p5 = platforms.create(1000, 1000, 'ground');
		p5.scale.setTo(8, 3);
		p6 = platforms.create(1400, 800, 'ground');
		p6.scale.setTo(6, 7);
		platforms.setAll('body.immovable', true);

		//The Doors
		doors = this.game.add.group();
		doors.enableBody = true;
		door1 = doors.create(150, p1.y - 75, 'door');
		door2 = doors.create(300, p1.y - 75, 'door');
		doors.setAll('body.immovable', true);

		//Set up player
		player = this.add.sprite(150, this.game.world.height - 150, 'player');
		player.anchor.setTo(0.5, 0.5);
		this.game.physics.arcade.enable(player);
		this.game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
		this.game.camera.deadzone = new Phaser.Rectangle(200, 200, 400, 200);
   		this.game.camera.focusOnXY(0, 0);
		player.body.gravity.y = 5000 * PLAYER_SCALE;
		player.body.collideWorldBounds = true;
		player.body.drag.set((3500 * PLAYER_SCALE), (2000 * PLAYER_SCALE));
		player.body.maxVelocity.setTo((450 * PLAYER_SCALE), (2000 * PLAYER_SCALE));
		player.body.collideWorldBounds = false;
		player.health = 100;
		//player.animations.add('left', [0, 1, 2, 3], 10, true);
    	//player.animations.add('turn', [4], 20, true);
    	//player.animations.add('right', [5, 6, 7, 8], 10, true);

    	//Set up player bullets
	    bullets = this.game.add.group();
	    bullets.enableBody = true;
	    bullets.physicsBodyType = Phaser.Physics.ARCADE;
	    bullets.createMultiple(30, 'rifleShot', 0, false);
	    bullets.setAll('anchor.x', 0.5);
	    bullets.setAll('anchor.y', 0.5);
	    bullets.setAll('outOfBoundsKill', true);
	    bullets.setAll('checkWorldBounds', true);

    	//Controls
    	arrow = this.game.input.keyboard.createCursorKeys();
		wUp = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		aLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		sDown = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		dRight = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
		space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},

	update: function() {
		//Collision detection
		this.game.physics.arcade.collide(player, platforms, this.checkPlatform, null, this);
		this.game.physics.arcade.overlap(player, doors, this.enterDoor, null, this);
		this.game.physics.arcade.overlap(platforms, bullets, this.killBullet, null, this);


		//***************
		//PLAYER MOVEMENT
		//***************

		//Horizontal movement
		if(aLeft.isDown)
		{
	    	//player.animations.play('left');
	    	if(reverseShot == true)
	    	{
	    		shotDirection = 'right';
	    	}
	    	else
	    	{
	    		shotDirection = 'left';
	    	}
	    	//Move to the left
	    	if(player.body.velocity <= 0)
	        {
	    		player.body.acceleration.x = -600 * PLAYER_SCALE;
	    	}
	    	else
	    	{
	    		player.body.acceleration.x = -2700 * PLAYER_SCALE;
	    	}
	    }
	    else if(dRight.isDown)
	    {
	    	//player.animations.play('right');
	    	if(reverseShot == true)
	    	{
	    		shotDirection = 'left';
	    	}
	    	else
	    	{
	    		shotDirection = 'right';
	    	}
	        //Move to the right
	        if(player.body.velocity >= 0)
	        {
	    		player.body.acceleration.x = 600 * PLAYER_SCALE;
	    	}
	    	else
	    	{
	    		player.body.acceleration.x = 2700 * PLAYER_SCALE;
	    	}
	    }
	    else
	    {
	        //Stop
	    	player.body.acceleration.x = 0;
	    	//player.frame = 4;
	    }

	    //Vertical movement
	    if((wUp.justPressed(250)) && canJump == true)
	    {
	    	player.body.velocity.y = -1000 * PLAYER_SCALE;
	    	player.body.gravity.y = 500 * PLAYER_SCALE;
	    	canJump = false;
	    	isOnLedge = false;
	    }

	    if(wUp.justReleased(100) || (!player.body.touching.down && player.body.velocity.y == 0))
	    {
	    	player.body.gravity.y = 5000 * PLAYER_SCALE;
	    }

	    if((player.body.touching.down || isOnLedge == true) && wUp.isUp)
		{
			canJump = true;
		}
		else
		{
			canJump = false;
		}

		//Ledge Grab
		if(player.body.velocity.y >= 0)
		{
			if(((player.body.y + 5) >= currentPlatHeight && (player.body.y - 5) <= currentPlatHeight) && (player.body.touching.left || player.body.touching.right))
			{
				isOnLedge = true;
			}
			else
			{
				//isOnLedge = false;
			}
		}

		if(isOnLedge)
		{
			player.body.velocity.y = 0;
			player.body.gravity.y = 0;
			reverseShot = true;
			if(aLeft.isDown || sDown.isDown || dRight.isDown)
			{
				isOnLedge = false;
			}
		}
		else
		{
			reverseShot = false;
		}

		//Airborn sideways movement affected
		if(!player.body.touching.down)
		{
			player.body.drag.x = 600 * PLAYER_SCALE;
		}
		else
		{
			player.body.drag.x = 2100 * PLAYER_SCALE;
		}


		//***************
		//PLAYER WEAPONRY
		//***************

		//basic shoot
		space.onDown.add(this.fire, this);



		//***************
		//PLAYER ABILITES
		//***************
		if(arrow.down.isUp)
		{
			canUseDoor = true;
		}
	},

	checkPlatform: function(player, platform){
		currentPlatHeight = platform.body.y;
	},

	fire: function() {
		if (this.game.time.now > nextFire && bullets.countDead() > 0)
	    {
	        nextFire = this.game.time.now + fireRate;
	        bullet = bullets.getFirstExists(false);
	        bullet.reset(player.x, player.y);
	        if(shotDirection == 'left')
	        {
	        	if(arrow.up.isDown)
	        	{
	        		bullet.rotation = this.game.physics.arcade.moveToXY(bullet, player.x - 10, player.y - 10, 600);
	        	}
	        	else
	        	{
	        		bullet.angle = 0;
		        	bullet.body.velocity.x = -600;
		        }
	        }
	        else if(shotDirection == 'right')
		    {
		    	if(arrow.up.isDown)
	        	{
	        		bullet.rotation = this.game.physics.arcade.moveToXY(bullet, player.x + 10, player.y - 10, 600);
	        	}
	        	else
	        	{
	        		bullet.angle = 0;
		        	bullet.body.velocity.x = 600;
		        }
		    }
	    }
	},

	killBullet: function(platform, bullet) {
		bullet.kill();
	},

	enterDoor: function(player, door){
		if(arrow.down.isDown && canUseDoor == true)
		{
			canUseDoor = false;

			//House 1
			if((door.x == door1.x && door.y == door1.y) || (door.x == door2.x && door.y == door2.y))
			{
				if(isIndoors == false)
				{
					isIndoors = true;
					leftWall = platforms.create(house1.x, house1.y, 'housewall');
					rightWall = platforms.create(house1.x + 375, house1.y, 'housewall');
					ceiling = platforms.create(house1.x, house1.y, 'houseroof');
					ledge1 = platforms.create(house1.x + 50, house1.y + 175, 'indoorledge');
					ledge2 = platforms.create(house1.x + 175, house1.y + 300, 'indoorledge');
					platforms.setAll('body.immovable', true);
					house1.frame = 1;
					isIndoors = true;
				}
				else
				{
					leftWall.destroy();
					rightWall.destroy();
					ceiling.destroy();
					ledge1.destroy();
					ledge2.destroy();
					house1.frame = 0;
					isIndoors = false;
				}
			}
		}
	},

	render: function() { 
		this.game.debug.text('Collide: ' + currentPlatHeight + ' Player: ' + player.body.y + ' Trigger: ' + isOnLedge, 100,550);
	}
};