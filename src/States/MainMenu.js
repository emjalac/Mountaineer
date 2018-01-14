
Mountaineer.MainMenu = function (game) {
	this.util = new Util(game);

};

Mountaineer.MainMenu.prototype = {
	create: function () {
		this.ready = false;


		this.titleScreen = this.add.sprite(0,0,"title_screen");
		this.titleScreen.scale.setTo(1280/1920);

	},
	update: function(){
		if(this.util.pointerDown()){
			this.state.start("FinalGame");
		}
	}, 
	shutdown: function(){
		this.titleScreen.destroy();
	}

};
