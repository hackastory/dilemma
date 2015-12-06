var PlayerChoice = function () {
    this.world = new ChoiceWorld();
    this.view = new ChoiceView();
    this.gaze = new PlayerChoiceGazeControls();
    this.input = new DesktopControls();

    this.active = true;

    this.socket = io( document.location.origin );

    this.socketEvents();
    this.update();

        // Check whether a player is already chosen and remove that option
    this.socket.emit('player-chosen-state');

    window.addEventListener( 'touchend', function () {
        console.log( 'touchend' );
        if ( screenfull.enabled ) {
            screenfull.request();
        }
    } );
};

PlayerChoice.prototype.destroy = function () {

    // clean up the PlayerChoice World.
    this.active = false;
    this.view.destroy();
};

PlayerChoice.prototype.getChoice = function () {
    return this.choice;
};

PlayerChoice.prototype.handlePlayerChosenState = function ( state ) {

    if ( state.innerViewChosen ) {
        this.handlePlayerTaken( 'innerView' );
    }
    if ( state.outerViewChosen ) {
        this.handlePlayerTaken( 'outerView' );
    }
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

PlayerChoice.prototype.showWaitingRoom = function () {
    //
};

PlayerChoice.prototype.update = function () {

    if ( ! this.active ) {
        return;
    }
    requestAnimationFrame( this.update.bind( this ) );

    if ( ! this.world.isBusy() && ! this.getChoice() ) {

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

    this.socket.on('player-chosen-state', this.handlePlayerChosenState.bind(this) );
    this.socket.on('player-taken', this.handlePlayerTaken.bind(this) );
    this.socket.on('start', this.destroy.bind(this) );
};