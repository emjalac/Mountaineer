Mountaineer.GameOverMenu = function (game) {
	this.replayButton = null;
	this.util = new Util(game);
	this.menuText = null;
	this.logo = null;
	this.score = null;
};

Mountaineer.GameOverMenu.prototype = {
	create: function () {
		this.ready = false;
		this.replayButton = this.add.button(this.world.centerX, this.world.centerY + 20, 'play-again-btn', function(){
			this.state.start("Game");
		}, this, 0, 1, 0);
		this.replayButton.anchor.setTo(0.5,0.5);
	},
	update: function () {

	},
	destroy: function () {
		this.playText.destroy();
	}
};

