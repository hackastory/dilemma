var OuterGame = function( timer ) {
    this.world = new OuterWorld( this.onInitWorld.bind( this, timer ) );
};

OuterGame.prototype.onInitWorld = function ( timer ) {

    var maze = this.world.pivotObject;
    this.view = new OuterView(maze);

    this.gaze = new OuterGazeControls(this.world.scene);
    this.input = new DesktopControls();

    this.rotation = new GazeButtonControls(this.world.gazeButtonHolder);
    //this.rotation = new RotationControls(this.world.pivotObject);
    this.socket = io(document.location.origin);

    console.log('OuterGame -> OuterGame', this.rotation.controls.children);

    this.centerPosition = new THREE.Vector3(0,0,100);
    this.lastMessage = {pivot: "", pos: ""};

    this.active = false;

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
    this.addKeyboardListeners();

    window.addEventListener('touchend', function () {
        console.log("touchend");
        if (screenfull.enabled) {
            screenfull.request();
        }
    });

    this.playSoundTrack();

    this.onAssetsLoaded();
};

OuterGame.prototype.destroy = function () {

    // clean up the OuterGame World.
    this.active = false;
    this.view.destroy();

    document.body.removeChild( this.view.renderer.domElement );
};

OuterGame.prototype.update = function() {
    if ( ! this.active ) {
        return;
    }
    requestAnimationFrame( this.update.bind( this ) );

    if( ! this.world.isBusy() ) {

        var gazeTargetPos = new THREE.Vector3();

        gazeTargetPos.setFromMatrixPosition( this.view.gazeTarget.matrixWorld );

        this.world.gazeTargetHelper.position.x = gazeTargetPos.x;
        this.world.gazeTargetHelper.position.y = gazeTargetPos.y;
        this.world.gazeTargetHelper.position.z = gazeTargetPos.z;

        var buttonId = this.gaze.getGaze( this.rotation.controls.children, this.world.gazeTargetHelper );
        if (buttonId != null) {
            //send signal via socket
            this.socketEmitById(buttonId);
        }

        //this.world.setJumpBy(this.input.getMovement(),this.view.getRotation());
    }

    if (this.world.update()) {
        this.checkTriggers();
    }

    this.view.rotateCamera(this.input.getLastMouseEvent());

    this.view.render(this.world.scene);

};

OuterGame.prototype.socketEmitById = function(buttonId) {
    var character;
    switch (buttonId) {
        case 'nav-topleft':
            character = 'h';
            break;
        case 'nav-topright':
            character = 'k';
            break;
        case 'nav-bottomleft':
            character = 'u';
            break;
        case 'nav-bottomright':
            character = 'j';
            break;
    }
    if (character) {
        this.socket.emit('rotate-' + character, 'rotate-' + character );
    }
}

OuterGame.prototype.addKeyboardListeners = function() {
    var scope = this;

    window.onkeyup = function(e) {
        var key = e.keyCode ? e.keyCode : e.which,
            character;

        scope.world.setRotateTo(key);

        switch (key) {
            case 72: //H
                character = 'h';
                break;
            case 75: //K
                character = 'k';
                break;
            case 85: //U
                character = 'u';
                break;
            case 74: //J
                character = 'j';
                break;
        }
        if (character) {
            scope.socket.emit('rotate-' + character, 'rotate-' + character);
        }
    }
};

OuterGame.prototype.onAssetsLoaded = function () {
    var body = document.querySelector('body');
    body.className = body.className.replace('loading', '');

    this.active = true;
    this.update();
};

OuterGame.prototype.playSoundTrack = function () {

    createjs.Sound.on('fileload', function () {

        createjs.Sound.play('soundMan');

        // #1 in DEBUG mode assets loaded was triggered directly, which correctly
        // created the outer world
        //this.onAssetsLoaded();

    }.bind(this));

    createjs.Sound.registerSound('/global/assets/audio/soundscape-outside-man-final.mp3', 'soundMan');
};

OuterGame.prototype.stopSoundTrack = function () {

    createjs.Sound.stop('soundMan');
};

OuterGame.prototype.socketEvents = function() {
    var scope = this;
    this.socket.on('world-position', function(eventData) {
        eventData = JSON.parse(eventData);
        var x = Math.round(eventData.x),
            y = Math.round(eventData.y),
            z = Math.round(eventData.z);

        console.log('worldpos', x, y, z);
        scope.world.setPlayerIndicator(x,y,z);
    });
};


OuterGame.prototype.checkTriggers = function () {
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