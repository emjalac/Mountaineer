Mountaineer.FinalGame = function (game) {
	this.util = new Util(game);
	this.player;
	this.mountain;

	this.snowShader = 
	`
	precision mediump float; 

	#define LAYERS 5

	varying vec2 vTextureCoord; 
	uniform sampler2D uSampler; 
	uniform float     time;
	uniform float 	  health; 

	float snowing(vec2 uv){
	 const mat3 p = mat3(13.323122,23.5112,21.71123,21.1212,28.7312,11.9312,21.8112,14.7212,61.3934);

	 float depth = 0.1;
	 float width = 0.5;
	 float speed = 4.0;
	   
	   
	 float acc = 0.0;
	 float dof = 5.0 * sin(time * 0.1);
	 for (int i=0; i < LAYERS; i++)
	 {
	   float fi = float(i*15);
	   vec2 q = uv * (1.0 + fi*depth); // Controls size and number 
	   float w = width * mod(fi*7.238917,1.0)-width*0.1*sin(time*2.+fi);
	   q += vec2(q.y*w, speed*time / (1.0+fi*depth*0.03));
	   vec3 n = vec3(floor(q),31.189+fi);
	   vec3 m = floor(n)*0.00001 + fract(n);
	   vec3 mp = (31415.9+m) / fract(p*m);
	   vec3 r = fract(mp);
	   vec2 s = abs(mod(q,1.0) -0.5 +0.9*r.xy -0.45);
	   s += 0.01*abs(2.0*fract(10.*q.yx)-1.); // Controls the size
	   float d = 0.6*max(s.x-s.y,s.x+s.y)+max(s.x,s.y)-.01;
	   float edge = 0.05 +0.05*min(.5*abs(fi-5.-dof),1.);
	   acc += smoothstep(edge,-edge,d)*(r.x/(1.+.02*fi*depth));
	 }
	 return acc;
	}

	void main(void){
		vec2 pos = vTextureCoord;
		vec4 color = texture2D(uSampler, pos);
		float snowFactor = snowing(pos);

		color.r += snowFactor * 0.9;
		color.g += snowFactor;
		color.b += snowFactor * 1.1;

		color.rgb += health;
	
		gl_FragColor = color;
	}
	`

	this.CreateMountain = function(){
		this.mountain = {};

		// Initialize the mountain
		let mountain_vertices = [
			0,5376,
			3540, 5394,
			3459, 5124,
			2940, 5049,
			2574, 4518,
			2427, 3609,
			2283, 3465,
			2076, 2637,
			2100, 2253,
			1926, 1983,
			1734, 1449,
			1707, 1200,
			1596,1302,
			1434, 1008,
			1401, 510,
			651, 234,
			0, 1647
			]
			
		let mountain_graphics = this.add.graphics(0,0);
		this.mountain.graphics = mountain_graphics;
		this.mountain.vertices = mountain_vertices;
		this.mountain.position_x = 0;
		this.mountain.position_y = 0; //NOTE TO EMMA: CHECK THESE LATER

		mountain_graphics.redraw = function(vertices){
			this.clear();

			var triangles = earcut(vertices);

			for(let i=2;i<vertices.length;i+=2){
				let x = vertices[i];
				let y = vertices[i+1];

				this.beginFill(0xFF0000);
				this.drawCircle(x,y,10);
				this.endFill();
			}

			for(let i=0;i<triangles.length;i+=3){
				let index1 = triangles[i]*2;
				let index2 = triangles[i+1]*2;
				let index3 = triangles[i+2]*2;
				let p1 = {x: vertices[index1], y:vertices[index1+1]};
				let p2 = {x: vertices[index2], y:vertices[index2+1]};
				let p3 = {x: vertices[index3], y:vertices[index3+1]};
				this.beginFill(0x000000);
				//mountain_graphics.lineStyle(5, 0xffd900, 1);
				this.moveTo(p1.x,p1.y);
				this.lineTo(p2.x,p2.y);
				this.lineTo(p3.x,p3.y);
				this.endFill();


			}
		}

		mountain_graphics.redraw(mountain_vertices);

		this.mountain.body = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
    	this.mountain.body.static = true; 
    	this.mountain.body.setPolygon(mountain_vertices);

	}
};

Mountaineer.FinalGame.prototype = {
	create: function () {
		// Initialize the snow filter 
		this.snowFilter = new Phaser.Filter(this.game,null,this.snowShader);
		this.snowFilter.uniforms.health = {type:'1f', value: 0.0};
		this.stage.filters = [this.snowFilter];

		this.init_offset_x = 2500; //offsets from mountain origin (slightly up and left of top of mountain)
		this.init_offset_y = 4400;
		this.init_counter = 0;
		//this.world.scale.setTo(0.5,0.5);

		// Enable physics system
	    this.game.physics.startSystem(Phaser.Physics.BOX2D);
    	this.game.physics.box2d.gravity.y = 500;
    	this.game.physics.box2d.friction = 0.5;
    	this.game.physics.box2d.restitution = 0.5;

    	// Create the player
    	this.player = {};
    	
    	    	
    	/// These must be created in the order you want them to be rendererd
		let arm_upperback = this.game.add.sprite(250 + this.init_offset_x, 245 + this.init_offset_y, "arm_upperback");
		let arm_lowerback = this.game.add.sprite(250 + this.init_offset_x, 245 + this.init_offset_y, "arm_lowerback");
		
		let leg_upperback = this.game.add.sprite(250 + this.init_offset_x, 245 + this.init_offset_y, "leg_upperback");
		let leg_lowerback = this.game.add.sprite(250 + this.init_offset_x, 245 + this.init_offset_y, "leg_lowerback");

		let head = this.game.add.sprite(250 + this.init_offset_x, 200 + this.init_offset_y, "head");
		let torso = this.game.add.sprite(500 + this.init_offset_x, 300 + this.init_offset_y, "torso");

		let leg_upperfront = this.game.add.sprite(250 + this.init_offset_x, 245 + this.init_offset_y, "leg_upperfront");
		let leg_lowerfront = this.game.add.sprite(250 + this.init_offset_x, 245 + this.init_offset_y, "leg_lowerfront");

		let arm_upperfront = this.game.add.sprite(250 + this.init_offset_x, 245 + this.init_offset_y, "arm_upperfront");
		let arm_lowerfront = this.game.add.sprite(250 + this.init_offset_x, 245 + this.init_offset_y, "arm_lowerfront");

		

		this.player.arm_upperfront = arm_upperfront;
		this.player.arm_upperback = arm_upperback;
		this.player.arm_lowerfront = arm_lowerfront;
		this.player.arm_lowerback = arm_lowerback;
		this.player.leg_upperfront = leg_upperfront;
		this.player.leg_upperback = leg_upperback;
		this.player.leg_lowerfront = leg_lowerfront;
		this.player.leg_lowerback = leg_lowerback;
		this.player.head = head;
		this.player.torso = torso;

		//torso.body.static = true;


		// Create the pickaxes 
		let pickaxe_front = this.game.add.sprite(500 + this.init_offset_x, 200 + this.init_offset_y, "pickaxe");
		let pickaxe_back = this.game.add.sprite(250 + this.init_offset_x, 200 + this.init_offset_y, "pickaxe");

		this.game.physics.box2d.enable([torso,arm_upperfront, arm_lowerfront, arm_lowerback, arm_upperback, head, leg_lowerback, leg_upperback, leg_upperfront, leg_lowerfront]);
		this.game.physics.box2d.enable([pickaxe_back, pickaxe_front]);
		torso.body.restitution = 0.3;

		// Create custom collision for pickaxes 
		pickaxe_back.body.angle = 10;
		pickaxe_front.body.angle = 90;
		pickaxe_back.body.clearFixtures();
		pickaxe_front.body.clearFixtures();
		pickaxe_back.body.setPolygon([27-130,4-110 , 61-130,3-110 , 51-130,77-110 , 71-130,87-110 , 73-130,107-110 , 56-130,119-110 , 67-130,217-110 , 28-130,117-110 , 3-130,99-110 , 31-130,80-110]);
		pickaxe_front.body.setPolygon([27-130,4-110 , 61-130,3-110 , 51-130,77-110 , 71-130,87-110 , 73-130,107-110 , 56-130,119-110 , 67-130,217-110 , 28-130,117-110 , 3-130,99-110 , 31-130,80-110]);

		this.player.active_axe = pickaxe_front;
		this.player.inactive_axe = pickaxe_back;
		this.player.active_axe.x = 500 + this.init_offset_x;
		this.player.active_axe.y = 200 + this.init_offset_y;
		this.player.inactive_axe.x = 250 + this.init_offset_x;
		this.player.inactive_axe.y = 200 + this.init_offset_y;

		// Create all the joints 
		let limits = true;

		let arm_limits = {min:0,max:90}

		this.game.physics.box2d.revoluteJoint(torso, head, -50, -120, 0, 70, 0, 0, false, 20, 20, limits);
		this.game.physics.box2d.revoluteJoint(torso, arm_upperfront, -40, -100, -5, -60, 0, 5, true, -60, 180, limits);
		this.game.physics.box2d.revoluteJoint(torso, arm_upperback, -20, -100, -5, -60, 5, 10, true, -60, 180, limits);
		this.game.physics.box2d.revoluteJoint(arm_upperback, arm_lowerback, 0, 60, 5, -70, 0, 5, true, arm_lowerback.min,arm_limits.max, limits);
		this.game.physics.box2d.revoluteJoint(arm_upperfront, arm_lowerfront, 0, 60, -5, -70, 0, 5, true, -20, 160, limits);
		this.game.physics.box2d.revoluteJoint(arm_upperfront, arm_lowerfront, 0, 60, -5, -70, 0, 5, true, arm_lowerback.min,arm_limits.max, limits);
		
		this.game.physics.box2d.revoluteJoint(arm_lowerfront, pickaxe_front, 0, 70, 50, 0, 0, 0, false, -80, -80, limits);
		this.game.physics.box2d.revoluteJoint(arm_lowerback, pickaxe_back, 0, 70, 50, 0, 0, 0, false, -80, -80, limits);
		
		this.game.physics.box2d.revoluteJoint(torso, leg_upperback, -30, 110, -5, -60, 0, 2, true, -45, 120, limits);
		this.game.physics.box2d.revoluteJoint(torso, leg_upperfront, -60, 110, -5, -60, 0, 2, true, -45, 120, limits);
		this.game.physics.box2d.revoluteJoint(leg_upperfront, leg_lowerfront, 0, 80, 5, -75, 5, 10, true, -140, 10, limits);
		this.game.physics.box2d.revoluteJoint(leg_upperback, leg_lowerback, 0, 80, 5, -75, 5, 10, true, -140, 10, limits);

		torso.body.static = true; // Start as static 

		//  Create our holy mountain 
		this.CreateMountain();

		// Define initial axe position
		//this.player.axe_joint = this.game.physics.box2d.weldJoint(this.player.inactive_axe, this.mountain, 0, 0, this.init_offset_x, this.init_offset_y);

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
		leg_upperback.body.setCollisionCategory(this.PLAYER_CAT);		
		leg_lowerfront.body.setCollisionCategory(this.PLAYER_CAT);
		leg_lowerback.body.setCollisionCategory(this.PLAYER_CAT);
		head.body.setCollisionCategory(this.PLAYER_CAT);
		pickaxe_front.body.setCollisionCategory(this.PLAYER_CAT);
		pickaxe_back.body.setCollisionCategory(this.PLAYER_CAT);
		this.mountain.body.setCollisionCategory(this.ENV_CAT);
		

		torso.body.setCollisionMask(this.PLAYER_MASK);
		arm_upperfront.body.setCollisionMask(this.PLAYER_MASK);
		arm_upperback.body.setCollisionMask(this.PLAYER_MASK);
		arm_lowerfront.body.setCollisionMask(this.PLAYER_MASK);
		arm_lowerback.body.setCollisionMask(this.PLAYER_MASK);
		leg_upperfront.body.setCollisionMask(this.PLAYER_MASK);
		leg_upperback.body.setCollisionMask(this.PLAYER_MASK);					
		leg_lowerfront.body.setCollisionMask(this.PLAYER_MASK);
		leg_lowerback.body.setCollisionMask(this.PLAYER_MASK);
		head.body.setCollisionMask(this.PLAYER_MASK);
		pickaxe_front.body.setCollisionMask(this.PLAYER_MASK);
		pickaxe_back.body.setCollisionMask(this.PLAYER_MASK);
		this.mountain.body.setCollisionCategory(this.ENV_CAT);

		// Set up call back function for pickaxe colliding with mountain
		pickaxe_front.body.setBodyContactCallback(this.mountain.body, this.checkCollision, this);
		pickaxe_back.body.setBodyContactCallback(this.mountain.body, this.checkCollision, this);

		// Arm switching & welding 
		this.game.input.onDown.add(this.switchArms, this);

		

		// Define some functions 
		this.UpdateArms = function(){
			// Move arm towards mouse 
			let mouse = this.util.pointerPos();

			let axe = {x:this.player.active_axe.x - this.world.pivot.x,y:this.player.active_axe.y - this.world.pivot.y}; 
			let dx = mouse.x - axe.x; 
			let dy = mouse.y - axe.y; 
			let dist = Math.sqrt(dx * dx + dy * dy);
			dx /= dist; 
			dy /= dist;
			 
			// Apply angular velocity to get angle to 0 
			// What's the shortest angle between 0 and this angle?
			// let angle = Math.atan2(dy,dx) + Math.PI/2;
			// let shortestAngle = this.util.aDiff(angle,0);
			// this.player.active_axe.body.angularVelocity = shortestAngle * 5;

			this.player.active_axe.body.applyForce(dx * 1000,dy * 1000);

		}

		this.CameraUpdate = function(){
			let targetX = this.player.active_axe.x - 800;
			let targetY = this.player.active_axe.y - 400;
			this.world.pivot.x += (targetX - this.world.pivot.x) * 0.16;
			this.world.pivot.y += (targetY - this.world.pivot.y) * 0.16;
		}

		this.HealthUpdate = function(){
			//this.snowFilter.uniforms.health.value = ((this.util.pointerPos().y * 8) / this.stage.height);
			this.snowFilter.update();
		}

	},
	switchArms: function() {
		this.player.active_axe.body.velocity.x = 0;
		this.player.active_axe.body.velocity.y = 0;

		let temp = this.player.active_axe;
		this.player.active_axe = this.player.inactive_axe;
		this.player.inactive_axe = temp;
		
		//this.game.physics.box2d.world.DestroyJoint(this.player.axe_joint);
		//this.player.axe_joint = this.game.physics.box2d.weldJoint(this.player.inactive_axe, this.mountain, 0, 0, this.init_offset_x, this.init_offset_y);

		//this.collideWithNearestVertex();

	},
	collideWithNearestVertex: function() {
		let d = 100000000000;
		let index = null;
		for(let i=0;i<this.mountain.vertices.length;i+=2){
			let x = this.mountain.vertices[i];
			let y = this.mountain.vertices[i+1];
			let temp_d = this.game.math.distanceSq(x, y, this.player.active_axe.x, this.player.active_axe.y); //distance to active axe squared
			console.log(temp_d);
			if (temp_d < d){
				d = temp_d;
				index = i;
			}
		}
		console.log("Nearest vertex is"+index);
		this.player.axe_joint = this.game.physics.box2d.weldJoint(this.player.inactive_axe, this.mountain, 0, 0, this.mountain.vertices[index], this.mountain.vertices[index+1]);

	},
	checkCollision: function(){
		console.log("You hit the mountain");

		//chip away at terrain

		//animated rocks/ice falling from chipping at terrain




	},
	update: function () {
		this.UpdateArms();
		this.CameraUpdate();
		this.HealthUpdate();

		if(this.player.torso.body.static == true){
			this.init_counter ++;
			if(this.init_counter > 60 * 3){
				this.player.torso.body.static = false;
			}
		}
		
	},
	render: function () {
		// this.game.debug.box2dWorld();
  //   	this.game.physics.box2d.debugDraw.joints = true;
	},
	destroy: function () {

	}
};

