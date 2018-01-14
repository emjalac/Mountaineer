Mountaineer.GameOverMenu = function (game) {
	this.replayButton = null;
	this.util = new Util(game);
	this.text = null;
	this.style = { font: "50px Arial", fill: "#ffffff", align: "center" };
	this.score = null;
};

Mountaineer.GameOverMenu.prototype = {
	create: function () {
		this.ready = false;
		this.titleScreen = this.add.sprite(0,0,"title_screen");
		this.titleScreen.scale.setTo(1280/1920);

		let audio_file = "assets/audio/mutedambience.ogg";
		this.load.audio('mutedambience', audio_file);
		this.menu_music = this.add.audio('mutedambience');
		this.menu_music.play();
	},
	update: function () {
			if(this.util.pointerDown()){
			this.state.start("FinalGame");
		}
	},
	destroy: function () {
		this.replayButton.destroy();
		this.menu_music.fadeOut(1);
	}
};

