// Some common utility functions
var Util = function(game){
	this.game = game;
};

Util.prototype.radToDeg = function(rad){
    return Math.round(rad * (180/Math.PI));
}

Util.prototype.aDiff = function(a,b){
    let diff = a - b; 
    diff = (diff + Math.PI) % (Math.PI * 2) - Math.PI;
    return diff;
}

Util.prototype.pointerDown = function(){
    var mousePointer = this.game.input.mousePointer;
    var pointer1 = this.game.input.pointer1;
    return (mousePointer.active && mousePointer.isDown) || (pointer1.active)
}
Util.prototype.pointerPos = function(){
    var mousePointer = this.game.input.mousePointer;
    var pointer1 = this.game.input.pointer1;
    if(pointer1.active){
        return {x:pointer1.x,y:pointer1.y}
    }
    else {
        return {x:mousePointer.x,y:mousePointer.y}
    }   
}

Util.prototype.makeRange = function(start,end){
    var arr = [];
    for(var i = start;i<=end;i++) arr.push(i);
    return arr;
}