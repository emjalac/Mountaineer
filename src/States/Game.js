
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

	//Initialize vars
    	var environment;
    	var ground;
    	var torso;
    	var arm_upperfront;
    	var arm_upperback;
    	var arm_lowerfront;
    	var arm_lowerback;
		var leg_upperfront;
    	var leg_upperback;
    	var leg_lowerfront;
    	var leg_lowerback;
		var head;

    	// Add sprites
	
	//Environment
		environment = this.game.add.group();
    	ground = environment.create(0, 500, "loading-bar");
    	ground.width = 2000;
		this.game.physics.box2d.enable(ground);
		ground.body.static = true;

		// Player
		player = this.game.add.group();
		torso = player.create(200, 300, "torso");
		torso.enableBody = true;
		this.game.physics.box2d.enable(torso);
		torso.body.restitution = 0.3;

		arm_upperfront = this.game.add.sprite(250, 245, "arm_upperfront");
		arm_upperback = this.game.add.sprite(250, 245, "arm_upperback");
		arm_lowerfront = this.game.add.sprite(250, 245, "arm_lowerfront");
		arm_lowerback = this.game.add.sprite(250, 245, "arm_lowerback");
		leg_upperfront = this.game.add.sprite(250, 245, "leg_upperfront");
		leg_upperback = this.game.add.sprite(250, 245, "leg_upperback");
		leg_lowerfront = this.game.add.sprite(250, 245, "leg_lowerfront");
		leg_lowerback = this.game.add.sprite(250, 245, "leg_lowerback");
		head = this.game.add.sprite(250, 200, "head");
		this.game.physics.box2d.enable([arm_upperfront, arm_lowerfront, arm_lowerback, arm_upperback, head, leg_lowerback, leg_upperback, leg_upperfront, leg_lowerfront]);
		this.game.physics.box2d.revoluteJoint(torso, arm_upperfront, 30, -115, -5, -60, 5, 10, true, -180, 180, true);
		this.game.physics.box2d.revoluteJoint(arm_upperfront, arm_lowerfront, 0, 60, -5, -70, 5, 10, true, -180, 180, true);
		this.game.physics.box2d.revoluteJoint(torso, head, 0, -130, 0, -50, 5, 10, true, -180, 180, true);
		this.game.physics.box2d.revoluteJoint(torso, arm_upperback, -35, -115, -5, -60, 5, 10, true);
		this.game.physics.box2d.revoluteJoint(arm_upperback, arm_lowerback, 0, 60, 5, -65, 5, 10, true, -180, 180, true);
		this.game.physics.box2d.revoluteJoint(torso, leg_upperback, -35, 100, -5, -60, 5, 10, true);
		this.game.physics.box2d.revoluteJoint(leg_upperback, leg_lowerback, 0, 60, 5, -65, 5, 10, true, -180, 180, true);
		this.game.physics.box2d.revoluteJoint(torso, leg_upperfront, 35, 100, -5, -60, 5, 10, true);
		this.game.physics.box2d.revoluteJoint(leg_upperfront, leg_lowerfront, 0, 60, 5, -65, 5, 10, true, -180, 180, true);
		
		// Set up collision masks
		// Player collides with: env (cat, mask) -> (01, 10) -> (1, 2)
		// Environment collides with: env, player (cat, mask) -> (10, 11) -> (2, 3)

		this.PLAYER_CAT = 1;
		this.PLAYER_MASK = 2;
		this.ENV_CAT = 2;
		this.ENV_MASK = 3;

		torso.body.setCollisionCategory(this.PLAYER_CAT);
		arm_upperfront.body.setCollisionCategory(this.PLAYER_CAT);
		arm_upperback.body.setCollisionCategory(this.PLAYER_CAT);
		arm_lowerfront.body.setCollisionCategory(this.PLAYER_CAT);
		arm_lowerback.body.setCollisionCategory(this.PLAYER_CAT);
		leg_upperfront.body.setCollisionCategory(this.PLAYER_CAT);
		leg_upperback.body.setCollisionCategory(this.PLAYER_CAT);				leg_lowerfront.body.setCollisionCategory(this.PLAYER_CAT);
		leg_lowerback.body.setCollisionCategory(this.PLAYER_CAT);
		head.body.setCollisionCategory(this.PLAYER_CAT);
		ground.body.setCollisionCategory(this.ENV_CAT);

		torso.body.setCollisionMask(this.PLAYER_MASK);
		arm_upperfront.body.setCollisionMask(this.PLAYER_MASK);
		arm_upperback.body.setCollisionMask(this.PLAYER_MASK);
		arm_lowerfront.body.setCollisionMask(this.PLAYER_MASK);
		arm_lowerback.body.setCollisionMask(this.PLAYER_MASK);
		leg_upperfront.body.setCollisionMask(this.PLAYER_MASK);
		leg_upperback.body.setCollisionMask(this.PLAYER_MASK);					leg_lowerfront.body.setCollisionMask(this.PLAYER_MASK);
		leg_lowerback.body.setCollisionMask(this.PLAYER_MASK);
		head.body.setCollisionMask(this.PLAYER_MASK);
		ground.body.setCollisionMask(this.ENV_MASK);

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
	}

};
