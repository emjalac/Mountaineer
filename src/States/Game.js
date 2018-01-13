
Mountaineer.Game = function (game) {
	this.util = new Util(game);
	
};

Mountaineer.Game.prototype = {
	create: function () {
		var style = {font:"20px;",fill:"grey",align:"center"};
		this.creditText = this.add.text(0,400,"Game!",style);
		this.creditText.font = "cocogoose";
		this.creditText.x = this.world.centerX - this.creditText.width/2;

		// Enable physics system
	    this.game.physics.startSystem(Phaser.Physics.BOX2D);
    	this.game.physics.box2d.gravity.y = 500;
    	this.game.physics.box2d.friction = 0.5;
    	this.game.physics.box2d.restitution = 0.5;

    	// Add sprites
		var ground = this.game.add.sprite(300, 670, "loading-bar");
		this.game.physics.box2d.enable(ground);
		ground.body.immovable = true;
		ground.width = 1280;

		var torso = this.game.add.sprite(200, 300, "torso");
		this.game.physics.box2d.enable(torso);
		torso.body.static = true;
		torso.body.restitution = 0.3;
		// torso.body.gravity.y = 500;

		var arm_upperfront = this.game.add.sprite(250, 240, "arm_upperfront");
		var arm_upperback = this.game.add.sprite(100, 150, "arm_upperback");
		var arm_lowerfront = this.game.add.sprite(100, 150, "arm_lowerfront");
		var arm_lowerback = this.game.add.sprite(100, 150, "arm_lowerback");
		this.game.physics.box2d.enable(arm_upperfront);
		arm_upperfront.body.static = true;
		// this.game.physics.box2d.revoluteJoint(torso, arm_upperfront, 30, 10, 0, -80);

		// Set up handlers for mouse events
	    this.game.input.onDown.add(this.mouseDragStart, this);
	    this.game.input.addMoveCallback(this.mouseDragMove, this);
	    this.game.input.onUp.add(this.mouseDragEnd, this);
	},
	update: function(){
		
		
	}, 
	render: function(){
	
	}, 
	shutdown: function(){
		
	},

	mouseDragStart: function() {
	    this.game.physics.box2d.mouseDragStart(this.game.input.mousePointer);  
	},

	mouseDragMove: function() {
	    this.game.physics.box2d.mouseDragMove(this.game.input.mousePointer);
	},

	mouseDragEnd: function() {
	    this.game.physics.box2d.mouseDragEnd();
	}

};
