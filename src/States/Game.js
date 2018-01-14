
Mountaineer.Game = function (game) {
	this.util = new Util(game);
	this.dragging = false;
	this.player = {};
	this.mountain = {};
	this.collision = {};

};

Mountaineer.Game.prototype = {
	create: function () {

		

		// Button
		var backButton = this.add.button(100, 100, 'back-btn', this.viewMenu, this, 0, 1, 0);
		backButton.anchor.setTo(0.5,0.5);
		backButton.scale.setTo(0.5,0.5);

		// Enable physics system
	    this.game.physics.startSystem(Phaser.Physics.BOX2D);
    	this.game.physics.box2d.gravity.y = 500;
    	this.game.physics.box2d.friction = 0.5;
    	this.game.physics.box2d.restitution = 0.5;

    	this.world.pivot.x = -500;

    	// Glow filter
    	this.glowFilter = new Phaser.Filter.Glow(game);

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
		var pickaxe_back;
		var pickaxe_front;
	
		// Environment
		environment = this.game.add.group();
    	ground = environment.create(0, 1000, "loading-bar");
    	ground.width = 2000;
		this.game.physics.box2d.enable(ground);
		ground.body.static = true;

		this.mountain.joint = environment.create(0, 400, "wall");
		this.game.physics.box2d.enable(this.mountain.joint);
		this.mountain.joint.body.static = true;

		// Player
		player = this.game.add.group();
		torso = player.create(200, 300, "torso");
		torso.enableBody = true;
		this.game.physics.box2d.enable(torso);
		torso.body.restitution = 0.3;
		//torso.body.static = true;
		this.player.torso = torso;

		arm_upperfront = this.game.add.sprite(250, 245, "arm_upperfront");
		arm_upperback = this.game.add.sprite(250, 245, "arm_upperback");
		arm_lowerfront = this.game.add.sprite(250, 245, "arm_lowerfront");
		arm_lowerback = this.game.add.sprite(250, 245, "arm_lowerback");
		leg_upperfront = this.game.add.sprite(250, 245, "leg_upperfront");
		leg_upperback = this.game.add.sprite(250, 245, "leg_upperback");
		leg_lowerfront = this.game.add.sprite(250, 245, "leg_lowerfront");
		leg_lowerback = this.game.add.sprite(250, 245, "leg_lowerback");
		head = this.game.add.sprite(250, 200, "head");

		pickaxe_front = this.game.add.sprite(500, 200, "pickaxe");
		pickaxe_back = this.game.add.sprite(250, 200, "pickaxe");
		this.game.physics.box2d.enable([arm_upperfront, arm_lowerfront, arm_lowerback, arm_upperback, head, leg_lowerback, leg_upperback, leg_upperfront, leg_lowerfront]);
		this.game.physics.box2d.enable([pickaxe_back, pickaxe_front]);
		pickaxe_back.body.clearFixtures();
		pickaxe_front.body.clearFixtures();
		pickaxe_back.body.setPolygon([27-130,4-110 , 61-130,3-110 , 51-130,77-110 , 71-130,87-110 , 73-130,107-110 , 56-130,119-110 , 67-130,217-110 , 28-130,117-110 , 3-130,99-110 , 31-130,80-110]);
		pickaxe_front.body.setPolygon([27-130,4-110 , 61-130,3-110 , 51-130,77-110 , 71-130,87-110 , 73-130,107-110 , 56-130,119-110 , 67-130,217-110 , 28-130,117-110 , 3-130,99-110 , 31-130,80-110]);


		this.player.active_axe = pickaxe_front;
		this.player.inactive_axe = pickaxe_back;
		this.player.active_axe.x = 250;
		this.player.active_axe.y = 200;
		this.player.inactive_axe.x = 250;
		this.player.inactive_axe.y = 200;

		//this.player.torso_move_speed_min = 10;

		//Define initial axe position
		this.player.axe_joint = this.game.physics.box2d.weldJoint(this.player.inactive_axe, this.mountain.joint);

		var limits = true;

		this.game.physics.box2d.revoluteJoint(torso, head, -30, -120, 0, 70, 0, 0, false, -30, 30, limits);
		this.game.physics.box2d.revoluteJoint(torso, arm_upperfront, -40, -100, -5, -60, 0, 2, true, -60, 180, limits);
		this.game.physics.box2d.revoluteJoint(torso, arm_upperback, -20, -100, -5, -60, 0, 2, true, -60, 180, limits);
		this.game.physics.box2d.revoluteJoint(arm_upperback, arm_lowerback, 0, 60, 0, -70, 0, 2, true, -5, 160, limits);
		this.game.physics.box2d.revoluteJoint(arm_upperfront, arm_lowerfront, 0, 60, 5, -70, 0, 2, true, -5, 160, limits);
		
		this.game.physics.box2d.weldJoint(arm_lowerfront, pickaxe_front, 0, 70, 50, 0);
		this.game.physics.box2d.weldJoint(arm_lowerback, pickaxe_back, 0, 70, 50, 0);
		pickaxe_back.body.angle = 30;
		pickaxe_front.body.angle = 90;

		this.game.physics.box2d.revoluteJoint(torso, leg_upperback, -30, 110, -5, -60, 0, 2, true, -45, 120, limits);
		this.game.physics.box2d.revoluteJoint(torso, leg_upperfront, -60, 110, -5, -60, 0, 2, true, -45, 120, limits);
		this.game.physics.box2d.revoluteJoint(leg_upperfront, leg_lowerfront, 0, 80, 5, -75, 5, 10, true, -140, 10, limits);
		this.game.physics.box2d.revoluteJoint(leg_upperback, leg_lowerback, 0, 80, 5, -75, 5, 10, true, -140, 10, limits);

		// Set up collision masks
		// Player collides with: nothing (cat, mask) -> (001, 000) -> (1, 0)
		// Environment collides with: env, axe (cat, mask) -> (010, 110) -> (2, 6)
		// Axe collides with: env (cat, mask) -> (100, 010) -> (4, 2)

		this.PLAYER_CAT = 1;
		this.PLAYER_MASK = 0;
		this.ENV_CAT = 2;
		this.ENV_MASK = 6;
		this.AXE_CAT = 4;
		this.AXE_MASK = 2;

		torso.body.setCollisionCategory(this.PLAYER_CAT);
		arm_upperfront.body.setCollisionCategory(this.PLAYER_CAT);
		arm_upperback.body.setCollisionCategory(this.PLAYER_CAT);
		arm_lowerfront.body.setCollisionCategory(this.PLAYER_CAT);
		arm_lowerback.body.setCollisionCategory(this.PLAYER_CAT);
		leg_upperfront.body.setCollisionCategory(this.AXE_CAT);
		leg_upperback.body.setCollisionCategory(this.AXE_CAT);		
		leg_lowerfront.body.setCollisionCategory(this.AXE_CAT);
		leg_lowerback.body.setCollisionCategory(this.AXE_CAT);
		head.body.setCollisionCategory(this.PLAYER_CAT);
		pickaxe_front.body.setCollisionCategory(this.AXE_CAT);
		pickaxe_back.body.setCollisionCategory(this.AXE_CAT);
		ground.body.setCollisionCategory(this.ENV_CAT);
		this.mountain.joint.body.setCollisionCategory(this.ENV_CAT);
		

		torso.body.setCollisionMask(this.PLAYER_MASK);
		arm_upperfront.body.setCollisionMask(this.PLAYER_MASK);
		arm_upperback.body.setCollisionMask(this.PLAYER_MASK);
		arm_lowerfront.body.setCollisionMask(this.PLAYER_MASK);
		arm_lowerback.body.setCollisionMask(this.PLAYER_MASK);
		leg_upperfront.body.setCollisionMask(this.AXE_MASK);
		leg_upperback.body.setCollisionMask(this.AXE_MASK);					
		leg_lowerfront.body.setCollisionMask(this.AXE_MASK);
		leg_lowerback.body.setCollisionMask(this.AXE_MASK);
		head.body.setCollisionMask(this.PLAYER_MASK);
		pickaxe_front.body.setCollisionMask(this.AXE_MASK);
		pickaxe_back.body.setCollisionMask(this.AXE_MASK);
		ground.body.setCollisionMask(this.ENV_MASK);
		this.mountain.joint.body.setCollisionMask(this.ENV_MASK);

		// Set up call back function for pickaxe colliding with mountain
		// pickaxe_front.body.setBodyContactCallback(mountain.body, checkCollision, this);
		// pickaxe_back.body.setBodyContactCallback(mountain.body, checkCollision, this);

		// Set up handlers for mouse events
	    this.game.input.onDown.add(this.onClick, this);


	},
	update: function(){
		var mouse_x;
		var mouse_y;
		var axe_x;
		var axe_y;
		var axe_to_mouse_dst_x;
		var axe_to_mouse_dst_y;

		var cur_mouse_x =

		mouse_x = this.util.pointerPos().x;
		mouse_y = this.util.pointerPos().y;

		axe_x = this.player.active_axe.x - this.world.pivot.x;
		axe_y = this.player.active_axe.y - this.world.pivot.y;

		axe_to_mouse_dst_x = mouse_x - axe_x;
		axe_to_mouse_dst_y = mouse_y - axe_y;

		this.player.active_axe.body.velocity.x = 10*axe_to_mouse_dst_x;
		this.player.active_axe.body.velocity.y = 10*axe_to_mouse_dst_y;
		// if (Math.abs(this.player.active_axe.body.velocity.x) > this.player.torso_move_speed_min){
		// 	this.player.torso.body.velocity.x = axe_to_mouse_dst_x;
		// }

		// if (Math.abs(this.player.active_axe.body.velocity.y) > this.player.torso_move_speed_min){
		// 	this.player.torso.body.velocity.y = axe_to_mouse_dst_y;
		// }
	}, 
	render: function(){
    	//this.game.debug.box2dWorld();
    	//this.game.physics.box2d.debugDraw.joints = true;
	
	}, 
	shutdown: function(){
	},

	onClick: function(){
		this.switchArms();
		this.weldAxeToMountain();
	},
	switchArms: function() {
		this.player.active_axe.body.velocity.x = 0;
		this.player.active_axe.body.velocity.y = 0;
		var temp = this.player.active_axe;
		this.player.active_axe = this.player.inactive_axe;
		this.player.inactive_axe = temp;
	},
	weldAxeToMountain: function() {
		this.game.physics.box2d.world.DestroyJoint(this.player.axe_joint);
		//console.log(this.player.axe_joint);
		this.player.axe_joint = this.game.physics.box2d.weldJoint(this.player.inactive_axe, this.mountain.joint);
	},
	checkCollision: function(){
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
		this.state.start('MainMenu');
	}

};

