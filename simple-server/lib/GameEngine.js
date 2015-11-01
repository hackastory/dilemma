
    // TODO: obsolete? Not dynamically needed anymore?
var gridMatrix = [];


var GameEngine = function ( socket ) {

    this.state = {
        manicChosen: false,
        depressedChosen: false,
        grid: gridMatrix,
        started: false
    };
    this.socket = socket;

    this.bindSocketEvents();
};

GameEngine.prototype = {

    bindSocketEvents: function () {

        this.socket.on('connection', function ( client ) {

            console.log('connected!');

            // login here means choosing to play either the Depressive or Manic game
            client.on('login', this.handleLogin.bind( this, client ) );

            client.on('player-coordinates', this.handlePlayerCoordinates.bind( this, client ) );

            client.on('rotate-u', this.handleRotation.bind( this ) );
            client.on('rotate-h', this.handleRotation.bind( this ) );
            client.on('rotate-j', this.handleRotation.bind( this ) );
            client.on('rotate-k', this.handleRotation.bind( this ) );

            client.on('start', this.handleStart.bind( this ) );
            client.on('reset', this.handleReset.bind( this ) );
            client.on('won', this.handleWon.bind( this ) );
            client.on('lost', this.handleLost.bind( this ) );

        }.bind( this ) );
    },

    handleLogin: function ( client, loginData ) {

        console.log( loginData );

        switch ( loginData ) {

            case 'manic':
                this.state.manicChosen = true;
                break;

            case 'depressed':
                this.state.depressedChosen = true;
                break;
        }

        this.socket.emit('playertaken', loginData );

        client.emit('grid', gridMatrix);

        //if ( this.state.depressedChosen && this.state.manicChosen ) {
        //    this.socket.emit('start');
        //}

        // but for now, just emit start to the client that pressed a login button
        client.emit('start');
    },

    handleLost : function () {

        this.state.started = false;

        console.log('lost');
        this.socket.emit('lost');
    },

    handlePlayerCoordinates: function ( client, coordData ) {
       // console.log('player-coordinates', coordData );

        this.socket.emit( 'player-coordinates', coordData );
    },

    handleReset : function () {

        this.state.started = false;
        this.state.manicChosen = false;
        this.state.depressedChosen = false;

        console.log('reset');
        this.socket.emit( 'reset' );
    },

    handleRotation : function ( rotation ) {
        console.log('rotate ', rotation);
        this.socket.emit( rotation, rotation );
    },

    handleStart : function () {

        if ( ! this.state.started ) {

            this.state.started = true;

            console.log('starting');
            this.socket.emit( 'start' );
        }
    },

    handleWon : function () {

        this.state.started = false;

        console.log('won');
        this.socket.emit('won');
    }
};

module.exports = GameEngine;