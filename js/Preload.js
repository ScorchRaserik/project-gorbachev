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
		this.load.spritesheet('button', 'assets/button.png', 200, 50);
	},

	create: function() {
		this.game.state.start('Intro');
	}
};