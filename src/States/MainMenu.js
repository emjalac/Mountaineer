
Mountaineer.MainMenu = function (game) {
	this.playButton = null;
	this.ready = null;
	this.util = new Util(game);
	this.menuText = null;

	this.logo = null;
};

Mountaineer.MainMenu.prototype = {
	create: function () {
		this.ready = false;


		this.playButton = this.add.button(this.world.centerX, this.world.centerY + 20, 'play-btn', function(){
			this.state.start("Game");
		}, this, 0, 1, 0);
		this.playButton.anchor.setTo(0.5,0.5);

	

		

	},
	update: function(){

	}, 
	destroy: function(){
		this.playText.destroy();
	}

};
