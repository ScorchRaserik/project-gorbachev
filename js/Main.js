WNDR.Main = function(game) {
	PLAYER_SCALE = 1.0;
	PLAYER_SPAWN_X = 226;
	PLAYER_SPAWN_Y = 700;
};

WNDR.Main.prototype = {

	create: function() {
		//Physics setup
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.world.setBounds(0, 0, 2200, 0);

		//Set up environment
		platforms = this.game.add.group();
		platforms.enableBody = true;
		ground = platforms.create(100, this.game.world.height - 45, 'ground');
		ground.body.immovable = true;

		//Set up player
		player = this.add.sprite(226, this.game.world.height - 75, 'player');
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

    	//Controls
		wUp = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		aLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		sDown = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		dRight = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
	},

	update: function() {
		//Collision detection
		this.game.physics.arcade.collide(player, platforms);

		//***************
		//PLAYER MOVEMENT
		//***************

		//Horizontal movement
		if(aLeft.isDown)
		{
	    	//player.animations.play('left');
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
	    }

	    if(wUp.justReleased(100) || (!player.body.touching.down && player.body.velocity.y == 0))
	    {
	    	player.body.gravity.y = 5000 * PLAYER_SCALE;
	    }

	    if(player.body.touching.down && wUp.isUp)
		{
			canJump = true;
		}
		else
		{
			canJump = false;
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
	}
};