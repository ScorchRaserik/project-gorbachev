WNDR.Intro = function(game) {};

WNDR.Intro.prototype = {

	create: function() {
		this.add.sprite(0, 0, 'test');
		playButton = this.game.add.button(500,  500, 'button', this.clickButton, this, 0, 1);
	},

	clickButton: function() {
		this.game.state.start('Main');
	}
};