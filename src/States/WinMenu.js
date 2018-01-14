Mountaineer.WinMenu = function (game) {
	this.replayButton = null;
	this.util = new Util(game);
	this.text = null;
	this.style = { font: "50px Arial", fill: "#ffffff", align: "center" };
	this.score = null;
};

Mountaineer.WinMenu.prototype = {
	create: function () {
		this.ready = false;
		this.titleScreen = this.add.sprite(0,0,"title_screen");
		this.titleScreen.scale.setTo(1280/1920);
	    // this.text = this.add.text(this.stage.width/2-100, this.stage.height/2 - 200, "Win", this.style);
	},
	update: function () {
			if(this.util.pointerDown()){
			this.state.start("FinalGame");
		}
	},
	destroy: function () {
		this.replayButton.destroy();
	}
};

