var PlayerChoice = function () {
    this.world = new ChoiceWorld();
    this.view = new ChoiceView();
    this.gaze = new GazeControls();
    this.input = new DesktopControls();
    this.socket = io( document.location.origin );

    this.lastMessage = { pivot: "", pos: "" };

    this.socketEvents();
    this.update();

    window.addEventListener( "touchend", function () {
        console.log( "touchend" );
        if ( screenfull.enabled ) {
            screenfull.request();
        }
    } );
};

PlayerChoice.prototype.update = function () {
    requestAnimationFrame( this.update.bind( this ) );

    if ( !this.world.isBusy() ) {

        var target = this.gaze.getGaze( this.view.camera, this.world.worldObject.children );
        if ( target != null ) {

            // KimJongUnlookingatthings.tumblr.com
            console.log( 'looking at', target );


        }
    }

    if ( this.world.update() ) {
        this.checkTriggers();
    }

    this.view.rotateCamera( this.input.getMouse() );

    this.view.render( this.world.scene );

};

PlayerChoice.prototype.socketEvents = function () {
    //this.socket.on('rotate-h', this.world.setRotateTo.bind(this.world, 72));
    //this.socket.on('rotate-k', this.world.setRotateTo.bind(this.world, 75));
    //this.socket.on('rotate-u', this.world.setRotateTo.bind(this.world, 85));
    //this.socket.on('rotate-j', this.world.setRotateTo.bind(this.world, 74));
};


PlayerChoice.prototype.checkTriggers = function () {

    //this.world.triggerObjects.forEach(function (trigger) {
    //    trigger.checkHit(this.world.worldObject.position, function (triggerObject) {
    //        switch (triggerObject) {
    //            case 'Trigger_Finish' :
    //                console.log('mainGame -> won');
    //                this.socket.emit('won', true);
    //                break;
    //        }
    //    }.bind(this));
    //}, this);
};