
Mountaineer.Game = function (game) {
	this.util = new Util(game);
	
};

Mountaineer.Game.prototype = {
	create: function () {
		var style = {font:"20px;",fill:"grey",align:"center"};
		this.creditText = this.add.text(0,400,"Game!",style);
		this.creditText.font = "cocogoose";
		this.creditText.x = this.world.centerX - this.creditText.width/2;

		// Button
		var backButton = this.add.button(100, 100, 'back-btn', this.viewMenu, this, 0, 1, 0);
		backButton.anchor.setTo(0.5,0.5);
		backButton.scale.setTo(0.5,0.5);

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

		var arm_upperfront = this.game.add.sprite(250, 245, "arm_upperfront");
		var arm_upperback = this.game.add.sprite(250, 245, "arm_upperback");
		var arm_lowerfront = this.game.add.sprite(250, 245, "arm_lowerfront");
		var arm_lowerback = this.game.add.sprite(250, 245, "arm_lowerback");
		var leg_upperfront = this.game.add.sprite(250, 245, "leg_upperfront");
		var leg_upperback = this.game.add.sprite(250, 245, "leg_upperback");
		var leg_lowerfront = this.game.add.sprite(250, 245, "leg_lowerfront");
		var leg_lowerback = this.game.add.sprite(250, 245, "leg_lowerback");
		var head = this.game.add.sprite(250, 200, "head");
		this.game.physics.box2d.enable([arm_upperfront, arm_lowerfront, arm_lowerback, arm_upperback, head, leg_lowerback, leg_upperback, leg_upperfront, leg_lowerfront]);
		this.game.physics.box2d.revoluteJoint(torso, arm_upperfront, 50, -115, -5, -60, 5, 10, true, -180, 180, true);
		this.game.physics.box2d.revoluteJoint(arm_upperfront, arm_lowerfront, 0, 60, -5, -70, 5, 10, true, -180, 180, true);
		this.game.physics.box2d.revoluteJoint(torso, head, -30, -120, 0, 70, 5, 10, true, -45, 45, true);
		this.game.physics.box2d.revoluteJoint(torso, arm_upperback, -50, -115, -5, -60, 5, 10, true);
		this.game.physics.box2d.revoluteJoint(arm_upperback, arm_lowerback, 0, 60, 5, -65, 0, 0, false, -180, 180, true);
		this.game.physics.box2d.revoluteJoint(torso, leg_upperback, -35, 100, -5, -60, 5, 10, true);
		this.game.physics.box2d.revoluteJoint(leg_upperback, leg_lowerback, 0, 60, 5, -65, 5, 10, true, -180, 180, true);
		this.game.physics.box2d.revoluteJoint(torso, leg_upperfront, 35, 100, -5, -60, 5, 10, true);
		this.game.physics.box2d.revoluteJoint(leg_upperfront, leg_lowerfront, 0, 60, 5, -65, 5, 10, true, -180, 180, true);
		
		// Set up handlers for mouse events
	    this.game.input.onDown.add(this.mouseDragStart, this);
	    this.game.input.addMoveCallback(this.mouseDragMove, this);
	    this.game.input.onUp.add(this.mouseDragEnd, this);
	},
	update: function(){
		
		
	}, 
	render: function(){
    	this.game.debug.box2dWorld();
    	this.game.physics.box2d.debugDraw.joints = true;
	
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
	},
	viewMenu: function() {
		this.state.start('GameOverMenu');
	}

};
