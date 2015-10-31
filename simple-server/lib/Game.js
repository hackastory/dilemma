
var Game = function ( socket ) {

    this.state = {
        started: false
    };
    this.socket = socket;

    this.bindSocketEvents();
};

Game.prototype = {

    bindSocketEvents: function () {

        this.socket.on('connection', function ( client ) {

            console.log('connected!');

            client.on('login', this.handleLogin.bind( this, client ) );

            client.on('start', this.handleStart.bind( this ) );
            client.on('reset', this.handleReset.bind( this ) );
            client.on('won', this.handleWon.bind( this ) );
            client.on('lost', this.handleLost.bind( this ) );

        }.bind( this ) );
    },

    handleLogin: function ( client, loginData ) {

        console.log( loginData );

        // send client an intro event
        client.emit('intro');
    },

    handleLost : function () {

        this.state.started = false;

        console.log('lost');
        this.socket.emit('lost');
    },

    handleReset : function () {

        this.state.started = false;

        console.log('reset');
        this.socket.emit( 'reset' );
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
    },
};

module.exports = Game;