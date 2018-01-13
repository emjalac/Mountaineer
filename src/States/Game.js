
Mountaineer.Game = function (game) {
	this.util = new Util(game);
	this.dragging = false;
};

Mountaineer.Game.prototype = {
	create: function () {
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

		// mountain_vertices = [	
		// 50,50,
		// 100,50,
		// 100,100,
		// 50,100];


		let mountain_graphics = this.add.graphics(0,0);
		

		var triangles = earcut(mountain_vertices);

		let max = {x:0,y:0};
		for(let i=2;i<mountain_vertices.length;i+=2){
			let x = mountain_vertices[i];
			let y = mountain_vertices[i+1];
			if(x > max.x) max.x = x; 
			if(y > max.y) max.y = y; 

			mountain_graphics.beginFill(0xFF0000);
			mountain_graphics.drawCircle(x,y,10);
			mountain_graphics.endFill();
		}

		for(let i=0;i<triangles.length;i+=3){
			let index1 = triangles[i]*2;
			let index2 = triangles[i+1]*2;
			let index3 = triangles[i+2]*2;
			let p1 = {x: mountain_vertices[index1], y:mountain_vertices[index1+1]};
			let p2 = {x: mountain_vertices[index2], y:mountain_vertices[index2+1]};
			let p3 = {x: mountain_vertices[index3], y:mountain_vertices[index3+1]};
			mountain_graphics.beginFill(0x000000);
			//mountain_graphics.lineStyle(5, 0xffd900, 1);
			mountain_graphics.moveTo(p1.x,p1.y);
			mountain_graphics.lineTo(p2.x,p2.y);
			mountain_graphics.lineTo(p3.x,p3.y);
			mountain_graphics.endFill();


		}

		

		// World should be as big as mountain 
		let padding = 1000;

		this.world.setBounds(-padding, -padding, max.x + padding * 2, max.y+padding * 2);

		//this.world.scale.setTo(0.5,0.5);
		let scope = this;
		this.input.mouse.mouseWheelCallback = function (event) {   
			let delta = scope.input.mouse.wheelDelta;
			let s  = scope.camera.scale.x;
			if(s + 0.1 * delta < 0.5) return;
			if(s + 0.1 * delta > 2) return;
			scope.camera.scale.setTo(s + 0.1 * delta,s + 0.1 * delta)
		};

	},
	update: function(){
		if(!this.dragging && this.util.pointerDown()){
			this.dragging = true;
			this.dragPosition = this.util.pointerPos();
			this.dragPosition.x += this.camera.x;
			this.dragPosition.y += this.camera.y;
		}
		if(this.dragging){
			if(!this.util.pointerDown()) this.dragging = false;
			let p = this.util.pointerPos();
			this.camera.x = this.dragPosition.x - (p.x);
			this.camera.y = this.dragPosition.y - (p.y);
			
		}
		
	}, 
	render: function(){
	
	}, 
	shutdown: function(){
		
	}

};
