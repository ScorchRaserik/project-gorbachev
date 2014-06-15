var WNDR = {
	score: 0
};

WNDR.Preload = function(game) {};

WNDR.Preload.prototype = {

	preload: function() {
		this.load.image('test', 'assets/test.png');
		this.load.image('ground', 'assets/ground.png');
		this.load.image('player', 'assets/player.png');
		this.load.image('rifleShot', 'assets/rifleShot.png');
		this.load.image('door', 'assets/door.png');
		this.load.image('indoorledge', 'assets/indoorledge.png');
		this.load.image('housewall', 'assets/housewall.png');
		this.load.image('houseroof', 'assets/houseroof.png');
		this.load.spritesheet('house', 'assets/house.png', 400, 400);
		this.load.spritesheet('button', 'assets/button.png', 200, 50);
	},

	create: function() {
		this.game.state.start('Intro');
	}
};