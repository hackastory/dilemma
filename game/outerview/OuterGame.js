var OuterGame = function( timer ) {
    this.world = new OuterWorld();
    this.view = new OuterView();
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
    this.addKeyboardListeners();

    window.addEventListener('touchend', function () {
        console.log("touchend");
        if (screenfull.enabled) {
            screenfull.request();
        }
    });
    
    this.playSoundTrack();
};

OuterGame.prototype.destroy = function () {

    // clean up the OuterGame World.
    this.active = false;
    this.view.destroy();
};

OuterGame.prototype.update = function() {
    if ( ! this.active ) {
        return;
    }
    requestAnimationFrame( this.update.bind( this ) );

    if(!this.world.isBusy()) {

        var target = this.gaze.getGaze(this.view.camera, this.world.navNodesObject.children, this.world.worldObject.position);
        if (target != null) this.world.setMoveTo(target);

        //this.world.setJumpBy(this.input.getMovement(),this.view.getRotation());
    }

    if (this.world.update()) {
        this.socketUpdate();
        this.checkTriggers();
    }

    this.view.rotateCamera(this.input.getMouse());

    this.view.render(this.world.scene);

};

OuterGame.prototype.addKeyboardListeners = function() {
    var scope = this;
    window.onkeyup = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;

        console.log('OuterGame -> onkeyup', key);
        //this.movementKeys = [{keyCode: 37, isDown: false, movement: new THREE.Vector3(1, 0, 0)}, //leftkey
        //    {keyCode: 38, isDown: false, movement: new THREE.Vector3(0, 0, 1)}, //upkey
        //    {keyCode: 39, isDown: false, movement: new THREE.Vector3(-1, 0, 0)}, //rightkey
        //    {keyCode: 40, isDown: false, movement: new THREE.Vector3(0, 0, -1)}, //downkey
        //    {keyCode: 33, isDown: false, movement: new THREE.Vector3(0, -1, 0)}, //pageup
        //    {keyCode: 34, isDown: false, movement: new THREE.Vector3(0, 1, 0)} //pagedown
        //];

        scope.world.setRotateTo(key);

        var character;
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

OuterGame.prototype.playSoundTrack = function () {

    createjs.Sound.on('fileload', function () {
        createjs.Sound.play('soundMan');
    });

    createjs.Sound.registerSound('/global/assets/audio/soundscape-outside-man-final.mp3', 'soundMan');
};

OuterGame.prototype.stopSoundTrack = function () {

    createjs.Sound.stop('soundMan');
};

OuterGame.prototype.socketEvents = function() {
    var scope = this;
    this.socket.on('pivot', function(eventData) {
        eventData = JSON.parse(eventData);
        var x = Math.round(eventData.x) / 180 * Math.PI,
            y = Math.round(eventData.y) / 180 * Math.PI,
            z = Math.round(eventData.z) / 180 * Math.PI;

        //console.log('pivot', eventData, x, y, z);
        //world.rotation.set(x, y, z);
    });
    this.socket.on('world-position', function(eventData) {
        eventData = JSON.parse(eventData);
        var x = Math.round(eventData.x),
            y = Math.round(eventData.y),
            z = Math.round(eventData.z);

        console.log('worldpos', x, y, z);
        scope.world.setPlayerIndicator(x,y,z);
        ////hypercube.position.set(x+16,y+14,z+16);
        //hypercube.position.set(x, y, z);
        //marker.mesh.position.set(-x - 8, -y - 7, -z - 8);
        //world.position.set(-x, -y, -z);
    });
    //this.socket.on('rotate-h', this.world.setRotateTo.bind(this.world, 72));
    //this.socket.on('rotate-k', this.world.setRotateTo.bind(this.world, 75));
    //this.socket.on('rotate-u', this.world.setRotateTo.bind(this.world, 85));
    //this.socket.on('rotate-j', this.world.setRotateTo.bind(this.world, 74));
};

OuterGame.prototype.socketUpdate = function () {
    var newPivot = JSON.stringify({
        x: this.world.pivotObject.rotation.x,
        y: this.world.pivotObject.rotation.y,
        z: this.world.pivotObject.rotation.z
    });
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
    if (newPivot !== this.lastMessage.pivot) {
        this.socket.emit('pivot', newPivot);
        this.lastMessage.pivot = newPivot;
        console.log('mainGame -> pivot', newPivot);
    }
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