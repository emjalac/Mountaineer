
Mountaineer.Game = function (game) {
	this.util = new Util(game);
	
};

Mountaineer.Game.prototype = {
	create: function () {
		var style = {font:"20px;",fill:"grey",align:"center"};
		this.creditText = this.add.text(0,400,"Game!",style);
		this.creditText.font = "cocogoose";
		this.creditText.x = this.world.centerX - this.creditText.width/2;
	},
	update: function(){
		
		
	}, 
	render: function(){
	
	}, 
	shutdown: function(){
		
	}

};
