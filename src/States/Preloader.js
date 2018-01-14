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
		this.load.image("title_screen","assets/images/title_screen.png");
		this.load.image("background","assets/images/background.png");
		this.load.image("backgroundmountain","assets/images/backgroundmountain.png");
		this.load.image("background_flat", "assets/images/background_new.png");

		//flag;
		this.load.image("flag", "assets/images/flag.png");

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

		// Load audio 
		let audio = [
			'ambience',
			'crumblingrockparticles',
			'endgamemusic',
			'mutedambience',
			'pickaxesecurefeedback',
			'pickaxestrike',
			'pickaxetap'
		];
		for(i=0;i<audio.length;i++){
			let audio_file = "assets/audio/" + audio[i] + ".ogg";
			this.load.audio(audio[i] ,audio_file);
		}

		this.load.onFileComplete.add(this.fileComplete, this);
		this.load.onLoadComplete.add(this.loadComplete, this);

		this.loadingScreen = this.add.sprite(0,0,"loadingscreen");
		this.loadingBar = this.add.sprite(430,600,"loadingbar");
		this.loadingBarWidth = this.loadingBar.width;

		this.loadingScreen.scale.setTo(1280/1920);

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
