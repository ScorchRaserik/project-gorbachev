var WNDR = {
	score: 0
};

WNDR.Preload = function(game) {};

WNDR.Preload.prototype = {

	preload: function() {
		this.load.image('test', 'assets/test.png');
	},

	create: function() {
		this.game.state.start('Intro');
	}
};