/**
 * Server-side game engine implementation
 * @param socket
 * @constructor
 */

var GameEngine = function ( socket ) {

    this.state = {};
    this.reset(); // set's the initial state of the game

    this.socket = socket;

    this.bindSocketEvents();
};

GameEngine.prototype = {

    bindSocketEvents: function () {

        this.socket.on('connection', function ( client ) {

            console.log('connected!');

            client.on('player-choice', this.handlePlayerChoice.bind( this, client ) );
            client.on('player-chosen-state', this.handlePlayerChosenState.bind( this, client ) );

            client.on('player-coordinates', this.handlePlayerCoordinates.bind( this, client ) );
            client.on('pivot', this.handlePivot.bind( this, client ) );
            client.on('world-position', this.handleWorldPosition.bind( this, client ) );

            client.on('rotate-u', this.handleRotation.bind( this ) );
            client.on('rotate-h', this.handleRotation.bind( this ) );
            client.on('rotate-j', this.handleRotation.bind( this ) );
            client.on('rotate-k', this.handleRotation.bind( this ) );

            client.on('intro-finished', this.handleIntroFinished.bind( this, client ) );
            client.on('outro-finished', this.handleOutroFinished.bind( this, client ) );
            client.on('reset', this.handleReset.bind( this ) );
            client.on('won', this.handleWon.bind( this ) );
            client.on('lost', this.handleLost.bind( this ) );

        }.bind( this ) );
    },

    handleIntroFinished : function () {

        if ( ! this.state.introFinished ) {
            this.state.introFinished = true;
            console.log( 'intro finished!' );
            this.socket.emit( 'intro-finished' );
        }
    },

    handleLost : function () {
        if ( ! this.state.lost ) {
            this.state.lost = true;
            console.log( 'lost' );
            this.socket.emit( 'lost' );
        }
    },

    handleOutroFinished: function () {

        if ( ! this.state.outroFinished ) {
            this.state.outroFinished = true;
            console.log( 'outro-finished' );
            this.socket.emit( 'outro-finished' );
        }
    },

    handlePivot: function ( client, pivotXYZ ) {
       // console.log('player-coordinates', coordData );

        this.socket.emit( 'pivot', pivotXYZ );
    },

    handlePlayerChosenState: function ( client ) {

        client.emit( 'player-chosen-state', this.state );
    },

    handlePlayerChoice: function ( client, loginData ) {

        console.log( loginData );

        switch ( loginData ) {

            case 'innerView':
                this.state.innerViewChosen = true;
                break;

            case 'outerView':
                this.state.outerViewChosen = true;
                break;
        }

        this.socket.emit('player-taken', loginData );

        if ( this.state.innerViewChosen && this.state.outerViewChosen ) {
            this.state.reset = false;
            this.socket.emit('start');
        }

        // but for now, just emit start to the client that pressed a login button
        //client.emit('start');
    },

    handlePlayerCoordinates: function ( client, coordData ) {
       // console.log('player-coordinates', coordData );

        this.socket.emit( 'player-coordinates', coordData );
    },

    handleReset : function () {

        if ( ! this.state.reset ) {
            this.state.reset = true;
            this.reset();

            console.log( 'reset' );
            this.socket.emit( 'reset' );
        }
    },

    handleRotation : function ( rotation ) {
        console.log('rotate ', rotation);
        this.socket.emit( rotation, rotation );
    },

    handleWon : function () {

        if ( ! this.state.won ) {
            this.state.won = true;
            console.log( 'won' );
            this.socket.emit( 'won' );
        }
    },


    handleWorldPosition: function ( client, posXYZ ) {
        console.log('world-pos', posXYZ );

        this.socket.emit( 'world-position', posXYZ );
    },

    reset: function () {

        this.state.lost = false;
        this.state.won = false;
        this.state.introFinished = false;
        this.state.outroFinished = false;
        this.state.innerWorldChosen = false;
        this.state.outerWorldChosen = false;
    }
};

module.exports = GameEngine;