
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


		this.playButton = this.add.button(this.stage.width/2, this.stage.height/2 - 100, 'play-btn', function(){
			this.state.start("FinalGame");
			//this.state.start("Game");
		}, this, 0, 1, 0);
		this.playButton.anchor.setTo(0.5,0.5);

		this.playButton2 = this.add.button(this.stage.width/2, this.stage.height/2 + 100, 'play-btn', function(){
			this.state.start("MountainTest");
		}, this, 0, 1, 0);
		this.playButton2.anchor.setTo(0.5,0.5);

	},
	update: function(){

	}, 
	shutdown: function(){
		this.playButton.destroy();
		this.playButton2.destroy();
	}

};
