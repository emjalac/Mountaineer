// For loading all assets and displaying loading info 

Mountaineer.Preloader = function (game) {
	this.loadingScreen = null;
	this.loadingBar = null;

	this.loadingBarWidth = 0;
};

Mountaineer.Preloader.prototype = {
	preload: function () {
		// Climber's body
		var character_images = [
			"torso",
			"arm_upperfront",
			"arm_lowerfront",
			"arm_upperback",
			"arm_lowerback",
			"leg_upperfront",
			"leg_lowerfront",
			"leg_upperback",
			"leg_lowerback",
			"head",
			"pickaxe"
		];
		var physics = ["pickaxe_body"];
		
		//var wall;
		this.load.image("wall","assets/images/body.png");

		var i;
		// for(i=0;i<images.length;i++) {
		// 	this.load.image(images[i],"assets/images/"+images[i]+".png");
		// }
		for(i=0;i<character_images.length;i++) {
			this.load.image(character_images[i],"assets/images/character/"+character_images[i]+".png");
		}
		for(i=0;i<physics.length;i++){
			this.load.physics(physics[i],"assets/physics/"+physics[i]+".json");
		}
			
		var spritesheets = [
			{name:"play-btn",w:422,h:134,f:2},
			{name:"back-btn",w:215,h:95,f:2},
			{name:"play-again-btn",w:422,h:134,f:2}
			]
		for(i=0;i<spritesheets.length;i++){
			var sheetName = spritesheets[i].name;
			var sheetWidth = spritesheets[i].w;
			var sheetHeight = spritesheets[i].h;
			var frames = spritesheets[i].f;
			this.load.spritesheet(sheetName,"assets/sheets/"+sheetName+".png",sheetWidth,sheetHeight,frames);
		}

		this.load.onFileComplete.add(this.fileComplete, this);
		this.load.onLoadComplete.add(this.loadComplete, this);

		this.loadingScreen = this.add.sprite(0,0,"loading-screen");
		this.loadingBar = this.add.sprite(295,403,"loading-bar");
		this.loadingBarWidth = this.loadingBar.width;

	},
	create: function () {
		this.state.start("MainMenu");
	},
	fileComplete: function(progress, cacheKey, success, totalLoaded, totalFiles) {
        var fullBarWidth = 705;
        var fullScale  = fullBarWidth / this.loadingBarWidth;
        this.loadingBar.scale.x = fullScale * (progress/100);
	},
	loadComplete: function(){
		
	},
	destroy: function(){
		this.loadingBar.destroy();
		this.loadingScreen.destroy();
	}
};
