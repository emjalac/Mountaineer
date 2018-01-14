var Mountaineer = {};
// For initializing game dimensions, misc settings, and loading preloader assets
Mountaineer.Boot = function (game) {
    
};

Mountaineer.Boot.prototype = {
    init: function () {
        this.stage.backgroundColor = "#8992a1";

        this.input.maxPointers = 1;
        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;
        if(this.game.device.desktop){
            // Any desktop or mobile specific changes
        }

        var self = this;

        var ScaleGame = function(s){
            // Make the game maintain 16:9 aspect ratio
            // limiting my width, or height if the height is too small
            s.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            s.game.scale.pageAlignHorizontally = true;
            s.game.scale.pageAlignVertically = true;
            
            var w = window.innerWidth;
            var h = window.innerHeight;
            var desiredHeight = w * (9/16);
            var factor = 1;
            if(desiredHeight > h){
                // If desired exceeds what we have, then limit by height 
                var newWidth = h * (16/9);
               factor = h/s.game.height;
            } else {
                var newHeight = w * (9/16);
                factor = w/s.game.width;
            }
            s.scale.setUserScale(factor,factor);

            console.log(w,h);
        }        

        ScaleGame(this);

        window.addEventListener('resize', function () { 
            ScaleGame(self);
        })
    },

    preload: function () {
       this.load.image("loadingscreen","assets/images/loadingscreen.png");
       this.load.image("loadingbar","assets/images/loadingbar.png");
       this.load.onLoadComplete.add(this.loadComplete, this);
    },
    loadComplete: function(){
         this.state.start('Preloader');
    }

};
