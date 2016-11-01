
var PlayerChoice = function ( noSleep ) {
    this.active = true;
    this.noSleep = noSleep;
    this.socket = io( document.location.origin );

    this.create();

    this.socketEvents();
    this.bindChoiceButtonEvents();

    // Check whether a player is already chosen and remove that option
    this.socket.emit('player-chosen-state');
};

PlayerChoice.prototype.bindChoiceButtonEvents = function () {

    this.$view.find('a').bind('click', function ( e ) {

        var $target = $( e.currentTarget );

        e.preventDefault();
        e.stopPropagation();

        if ( $target != null && ! $target.is('.disabled') && ! this.choice ) {

            this.noSleep.enable();

            this.choice = $target.attr('href').slice( 1 );

            this.socket.emit( 'player-choice', this.choice );

            this.showWaitingRoom();
        }

    }.bind( this ));
};

PlayerChoice.prototype.create = function () {

    this.$view = $(''.concat(
        '<div class="player-choice">',
            '<h1 class="player-choice-title">Dilemma</h1>',
            '<h2 class="player-choice-subtitle">choose yours below and put on your VR headset</h2>',
            '<a href="#innerView" class="player-choice-inner"><h3 class="player-choice-label">female</h3></a>',
            '<a href="#outerView" class="player-choice-outer"><h3 class="player-choice-label">male</h3></a>',
        '</div>'
    ));

    $('body').append( this.$view );
};

PlayerChoice.prototype.destroy = function () {

    // clean up the PlayerChoice World.
    this.active = false;

    this.$view.find('a').unbind();
    this.$view.remove();
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

    $('[href="#'+ chosenPlayer +'"]' ).addClass('disabled');
};

PlayerChoice.prototype.showWaitingRoom = function () {
    // dim the buttons and show:"waiting for other player..." ?

    $('.player-choice a' ).remove();
    $('.player-choice-subtitle' ).html('Waiting for other player...');
};


PlayerChoice.prototype.socketEvents = function () {

    this.socket.on('player-chosen-state', this.handlePlayerChosenState.bind(this) );
    this.socket.on('player-taken', this.handlePlayerTaken.bind(this) );
    this.socket.on('start', this.destroy.bind(this) );
};