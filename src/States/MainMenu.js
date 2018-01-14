
Mountaineer.MainMenu = function (game) {
	this.util = new Util(game);

};

Mountaineer.MainMenu.prototype = {
	create: function () {
		this.ready = false;

		this.titleScreen = this.add.sprite(0,0,"title_screen");
		this.titleScreen.scale.setTo(1280/1920);
		
		let audio_file = "assets/audio/mutedambience.ogg";
		this.load.audio('mutedambience', audio_file);
		this.menu_music = this.add.audio('mutedambience');
		this.menu_music.play();

	},
	update: function(){
		if(this.util.pointerDown()){
			this.state.start("FinalGame");
		}
	}, 
	shutdown: function(){
		this.titleScreen.destroy();
		this.menu_music.fadeOut(1);
	}

};
