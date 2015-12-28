var InnerGame = function( timer ) {

    this.world = new InnerWorld();
    this.view = new InnerView();
    this.gaze = new GazeControls(this.world.scene);
    this.input = new DesktopControls();
    this.socket = io(document.location.origin);

    this.lastMessage = {pivot: "", pos: ""};

    this.active = true;

    if ( timer ) {
        this.timer = timer;
    } else {
        // You are probably playing this game standalone
        this.timer = new Timer( 180000 );
        this.timer.on('end', function () {
            console.log('timer ended');
            this.socket.emit('lost');
        }.bind( this ));

        this.timer.on('progress', function ( milliSecondsPassed ) {
            //console.log( Math.floor( milliSecondsPassed / 1000 ), ' seconds past.' );
        });

        this.timer.start();
    }

    this.socketEvents();
    this.socketUpdate();
    this.update();

    this.playSoundTrack();

    window.addEventListener('touchend', function () {
        console.log('touchend');
        if (screenfull.enabled) {
            screenfull.request();
        }
    });
};

InnerGame.prototype.update = function() {

    if ( ! this.active ) {
        return;
    }

    requestAnimationFrame( this.update.bind(this));

    if(!this.world.isBusy()) {

        var target = this.gaze.getGaze(this.view.camera, this.world.navNodesObject.children, this.world.worldObject.position);
        if (target != null) this.world.setMoveTo(target);

        this.world.setJumpBy(this.input.getMovement(),this.view.getRotation());
    }

    if (this.world.update()) {
        this.socketUpdate();
        this.checkTriggers();
    }

    this.view.rotateCamera(this.input.getMouse());

    this.view.render(this.world.scene);

};

InnerGame.prototype.destroy = function () {

    // clean up the InnerGame World.
    this.active = false;
    this.view.destroy();
};

InnerGame.prototype.playSoundTrack = function () {

    var socket = this.socket;

    createjs.Sound.on('fileload', function () {
        createjs.Sound.play('soundWoman');
    });

    createjs.Sound.registerSound('/global/assets/audio/soundscape-inside-vrouw-final.mp3', 'soundWoman');
};

InnerGame.prototype.stopSoundTrack = function () {

    createjs.Sound.stop('soundWoman');
};

InnerGame.prototype.socketEvents = function () {
    this.socket.on('rotate-h', this.world.setRotateTo.bind(this.world, 72));
    this.socket.on('rotate-k', this.world.setRotateTo.bind(this.world, 75));
    this.socket.on('rotate-u', this.world.setRotateTo.bind(this.world, 85));
    this.socket.on('rotate-j', this.world.setRotateTo.bind(this.world, 74));
};

InnerGame.prototype.socketUpdate = function () {
    var newWorldPos = JSON.stringify({
        x: this.world.worldObject.position.x,
        y: this.world.worldObject.position.y,
        z: this.world.worldObject.position.z
    });

    if (newWorldPos !== this.lastMessage.pos) {
        this.socket.emit('world-position', newWorldPos);
        this.lastMessage.pos = newWorldPos;
        console.log('mainGame -> worldpos', newWorldPos);
    }
};

InnerGame.prototype.checkTriggers = function () {
    this.world.triggerObjects.forEach(function (trigger) {
        trigger.checkHit(this.world.worldObject.position, function (triggerObject) {
            switch (triggerObject) {
                case 'Trigger_Finish' :
                    console.log('mainGame -> won');
                    this.stopSoundTrack();

                    this.socket.emit('won', true);
                    break;
            }
        }.bind(this));
    }, this);
};