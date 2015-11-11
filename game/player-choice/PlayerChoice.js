var PlayerChoice = function () {
    this.world = new ChoiceWorld();
    this.view = new ChoiceView();
    this.gaze = new GazeControls();
    this.input = new DesktopControls();

    this.socket = io( document.location.origin );

    this.socketEvents();
    this.update();

    window.addEventListener( "touchend", function () {
        console.log( "touchend" );
        if ( screenfull.enabled ) {
            screenfull.request();
        }
    } );
};

PlayerChoice.prototype.handlePlayerTaken = function ( chosenPlayer ) {
console.log( 'handlePlayerTaken', chosenPlayer );
    switch ( chosenPlayer ) {

        case 'innerView':
            this.world.worldObject.remove( this.world.innerChoice );
            break;

        case 'outerView':
            this.world.worldObject.remove( this.world.outerChoice );
            break;
    }
};

PlayerChoice.prototype.handleStart = function () {


};

PlayerChoice.prototype.showWaitingRoom = function () {

};

PlayerChoice.prototype.update = function () {

    requestAnimationFrame( this.update.bind( this ) );

    if ( ! this.world.isBusy() && ! this.choice ) {

        var target = this.gaze.getGaze( this.view.camera, this.world.worldObject.children );
        if ( target != null && ! this.choice ) {

            this.choice = target +'View';

            console.log( 'Kim Jong Un looking at', target );

            this.socket.emit( 'player-choice', this.choice );

            this.showWaitingRoom();
        }
    }

    this.view.rotateCamera( this.input.getMouse() );

    this.view.render( this.world.scene );

};

PlayerChoice.prototype.socketEvents = function () {

    this.socket.on('player-taken', this.handlePlayerTaken.bind(this) );
    this.socket.on('rotate-start', this.handleStart.bind(this));
};