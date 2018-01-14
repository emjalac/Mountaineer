Mountaineer.MountainTest = function (game) {
	this.util = new Util(game);

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

};

Mountaineer.MountainTest.prototype = {
	create: function () {
		this.snowFilter = new Phaser.Filter(this.game,null,this.snowShader);
		this.snowFilter.uniforms.health = {type:'1f', value: 0.0};
		this.stage.filters = [this.snowFilter];

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
		this.mountain_graphics = mountain_graphics;

		mountain_graphics.redraw = function(vertices){
			this.clear();

			var triangles = earcut(vertices);

			for(let i=2;i<mountain_vertices.length;i+=2){
				let x = mountain_vertices[i];
				let y = mountain_vertices[i+1];

				this.beginFill(0xFF0000);
				this.drawCircle(x,y,10);
				this.endFill();
			}

			for(let i=0;i<triangles.length;i+=3){
				let index1 = triangles[i]*2;
				let index2 = triangles[i+1]*2;
				let index3 = triangles[i+2]*2;
				let p1 = {x: mountain_vertices[index1], y:mountain_vertices[index1+1]};
				let p2 = {x: mountain_vertices[index2], y:mountain_vertices[index2+1]};
				let p3 = {x: mountain_vertices[index3], y:mountain_vertices[index3+1]};
				this.beginFill(0x000000);
				//mountain_graphics.lineStyle(5, 0xffd900, 1);
				this.moveTo(p1.x,p1.y);
				this.lineTo(p2.x,p2.y);
				this.lineTo(p3.x,p3.y);
				this.endFill();


			}
		}

		mountain_graphics.redraw(mountain_vertices);

		let max = {x:0,y:0};
		for(let i=2;i<mountain_vertices.length;i+=2){
			let x = mountain_vertices[i];
			let y = mountain_vertices[i+1];
			if(x > max.x) max.x = x; 
			if(y > max.y) max.y = y; 
		}

		

		

		// World should be as big as mountain 
		let padding = 1000;

		this.world.setBounds(-padding, -padding, max.x + padding * 2, max.y+padding * 2);

		//this.world.scale.setTo(0.5,0.5);
		let scope = this;

		this.input.mouse.mouseWheelCallback = function (event) {   
			let delta = scope.input.mouse.wheelDelta;
			let s = scope.world.scale.x;

			s += delta * 0.1;
			s = Phaser.Math.clamp(s,0.25,2);

			scope.world.scale.setTo(s,s)
		};

		// Button
		var backButton = this.add.button(100, 100, 'back-btn', this.viewMenu, this, 0, 1, 0);
		backButton.anchor.setTo(0.5,0.5);
		backButton.scale.setTo(0.5,0.5);


		// Init physics system + mountain 
		this.game.physics.startSystem(Phaser.Physics.BOX2D);
    	this.game.physics.box2d.gravity.y = 500;
    	this.game.physics.box2d.friction = 0.5;
    	this.game.physics.box2d.restitution = 0.5;

    	this.mountain_body = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
    	this.mountain_body.static = true; 
    	this.mountain_body.setPolygon(mountain_vertices);

    	this.vertices = mountain_vertices;

	},
	update: function () {

		//this.snowFilter.uniforms.health.value = ((this.util.pointerPos().y * 8) / this.stage.height);
		this.snowFilter.update();

		if(!this.dragging && this.util.pointerDown()){
			this.dragging = true;
			this.dragPosition = this.util.pointerPos();
			let scale = this.world.scale.x;
			this.dragPosition.x += this.world.pivot.x * scale;
			this.dragPosition.y += this.world.pivot.y * scale;
			if(this.oldWorldPivot == null)
				this.oldWorldPivot = {x:0,y:0}
			this.oldWorldPivot.x = this.world.pivot.x;
			this.oldWorldPivot.y = this.world.pivot.y;
		}
		if(this.dragging){
			let p = this.util.pointerPos();
			if(!this.util.pointerDown()) {
				this.dragging = false;
				let dx = this.world.pivot.x - this.oldWorldPivot.x; 
				let dy = this.world.pivot.y - this.oldWorldPivot.y; 
				let dist = Math.sqrt(dx * dx + dy * dy);

				if(dist < 1){
					this.chipMountain(p.x,p.y);
				}
			}
			
			let scale = this.world.scale.x;
			this.world.pivot.x = (this.dragPosition.x - p.x) / scale;
			this.world.pivot.y = (this.dragPosition.y - p.y) / scale;
			
		}

	
	},
	render: function(){
		//this.game.debug.box2dWorld();
	},
	shutdown: function () {
		this.camera.x = 0;
		this.camera.y = 0;
		this.camera.scale.setTo(1,1);
		this.snowFilter.destroy();
		this.stage.filters = null;
	},

	chipMountain: function(x,y){
		let scale = this.world.scale.x;
		let worldX = x / scale + this.world.pivot.x;
		let worldY = y / scale + this.world.pivot.y; 
		
		let vertices = this.vertices;

		// Find the points before and after this in the vertices array 
	    let cPoint = {x:worldX,y:worldY};
	    // 1- Find the closest point
	    let closestIndex = 0;
	    let closestDist = -1; 
	    for(let i=0;i<vertices.length;i+=2){
	        let p = {x:vertices[i],y:vertices[i+1]};
	        let dist = Math.sqrt(Math.pow(p.x-cPoint.x,2) + Math.pow(p.y-cPoint.y,2))
	        if(closestDist == -1){
	            closestDist = dist;
	            closestIndex = i;
	        }
	        if(closestDist > dist){
	            closestDist = dist; 
	            closestIndex = i;
	        }
	    }

	    // 2- To find the next point, it has to be one of these 
	    let p = {x:vertices[closestIndex],y:vertices[closestIndex+1]};
	    let p1 = {x:vertices[closestIndex+2],y:vertices[closestIndex+3]};
	    let p2 = {x:vertices[closestIndex-2],y:vertices[closestIndex-1]};

	    let angle_closest_to_mouse = Math.atan2(cPoint.y - p.y,cPoint.x - p.x);
	    let angle_next_to_closest = Math.atan2(p1.y - p.y,p1.x - p.x);
	    let final_angle = this.util.aDiff(0,this.util.aDiff(angle_closest_to_mouse,angle_next_to_closest))

	    let nextIndex;
	    let dir = 1;

	    if(Math.abs(this.util.radToDeg(final_angle)) < 90){
	        // It's the next 
	        nextIndex = closestIndex + 2;   
	    } else {
	        // It's the prev 
	        nextIndex = closestIndex - 2;
	        dir = -1;
	    }

		// If thse two points are new, do NOT add anything new

	   // 3 - Now add an extra vertix between these two 
	   let newP = {x:0,y:0};
	   let nextP = {x:vertices[nextIndex],y:vertices[nextIndex+1]};

	   let dx = (p.x - worldX);
	   let dy = (p.y - worldY);
	   let dist = Math.sqrt(dx * dx + dy * dy);
	   let total_dx = (p.x - nextP.x);
	   let total_dy = (p.y - nextP.y);
	   let total_dist = Math.sqrt(total_dx * total_dx + total_dy * total_dy);
	   let finalFactor = 1 - (dist / total_dist);

	   newP.x = nextP.x + (p.x-nextP.x) * finalFactor;
	   newP.y = nextP.y + (p.y-nextP.y) * finalFactor;
	   newP.x = Math.round(newP.x);
	   newP.y = Math.round(newP.y);
	   
	   let angle = Math.atan2(nextP.y-p.y,nextP.x  - p.x);

	   let pushAngle  = angle + Math.PI/2 * dir;

	   let depth = 40;
	   newP.x += Math.cos(pushAngle) * -depth;
	   newP.y += Math.sin(pushAngle) * -depth;

	   // Add two more 
	   let newP1 = {x:0,y:0};
	   newP1.x = nextP.x + (p.x-nextP.x) * (finalFactor + 0.1 * dir);
	   newP1.y = nextP.y + (p.y-nextP.y) * (finalFactor + 0.1 * dir);
	   newP1.x = Math.round(newP1.x);
	   newP1.y = Math.round(newP1.y);

	   let newP2 = {x:0,y:0};
	   newP2.x = nextP.x + (p.x-nextP.x) * (finalFactor - 0.1 * dir);
	   newP2.y = nextP.y + (p.y-nextP.y) * (finalFactor - 0.1 * dir);
	   newP2.x = Math.round(newP2.x);
	   newP2.y = Math.round(newP2.y);

	   let smallerIndex = closestIndex;
	   if(nextIndex < smallerIndex) smallerIndex = nextIndex;
	   vertices.splice(smallerIndex+2,0,newP1.x,newP1.y,newP.x,newP.y,newP2.x,newP2.y);


	   this.mountain_body.setPolygon(vertices);

	   // Update graphics
	   this.mountain_graphics.redraw(vertices);

	},
	viewMenu: function() {
		this.state.start('MainMenu');
	}
};

