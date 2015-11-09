/**
 * Server-side game engine implementation
 * @param socket
 * @constructor
 */

var GameEngine = function ( socket ) {

    this.state = {
        innerWorldChosen: false,
        outerWorldChosen: false
    };

    this.socket = socket;

    this.bindSocketEvents();
};

GameEngine.prototype = {

    bindSocketEvents: function () {

        this.socket.on('connection', function ( client ) {

            console.log('connected!');


            client.on('player-choice', this.handlePlayerChoice.bind( this, client ) );

            client.on('player-coordinates', this.handlePlayerCoordinates.bind( this, client ) );
            client.on('pivot', this.handlePivot.bind( this, client ) );
            client.on('world-position', this.handleWorldPosition.bind( this, client ) );

            client.on('rotate-u', this.handleRotation.bind( this ) );
            client.on('rotate-h', this.handleRotation.bind( this ) );
            client.on('rotate-j', this.handleRotation.bind( this ) );
            client.on('rotate-k', this.handleRotation.bind( this ) );

            client.on('intro-finished', this.handleIntroFinished.bind( this, client ) );
            client.on('reset', this.handleReset.bind( this ) );
            client.on('won', this.handleWon.bind( this ) );
            client.on('lost', this.handleLost.bind( this ) );

        }.bind( this ) );
    },

    handleIntroFinished : function () {

        console.log('intro finished!');
        this.socket.emit('intro-finished');
    },

    handleLost : function () {

        console.log('lost');
        this.socket.emit('lost');
    },

    handlePivot: function ( client, pivotXYZ ) {
       // console.log('player-coordinates', coordData );

        this.socket.emit( 'pivot', pivotXYZ );
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

        this.socket.emit('playertaken', loginData );

        //if ( this.state.innerViewChosen && this.state.outerViewChosen ) {
        //    this.socket.emit('start');
        //}

        // but for now, just emit start to the client that pressed a login button
        client.emit('start');
    },

    handlePlayerCoordinates: function ( client, coordData ) {
       // console.log('player-coordinates', coordData );

        this.socket.emit( 'player-coordinates', coordData );
    },

    handleReset : function () {

        this.state.innerViewChosen = false;
        this.state.outerViewChosen = false;

        console.log('reset');
        this.socket.emit( 'reset' );
    },

    handleRotation : function ( rotation ) {
        console.log('rotate ', rotation);
        this.socket.emit( rotation, rotation );
    },

    handleWon : function () {

        console.log('won');
        this.socket.emit('won');
    },


    handleWorldPosition: function ( client, posXYZ ) {
        console.log('world-pos', posXYZ );

        this.socket.emit( 'world-position', posXYZ );
    }
};

module.exports = GameEngine;