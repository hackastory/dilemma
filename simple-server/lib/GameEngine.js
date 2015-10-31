
var gridMatrix = [
        
    /* Ground level */    
    [
        /* row */            
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1]
    ],
    [
        [0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0]
    ]
];


var Game = function ( socket ) {

    this.state = {
        manicChosen: false,
        depressedChosen: false,
        grid: gridMatrix,
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

        if ( this.state.depressedChosen && this.state.manicChosen ) {
            this.socket.emit('start');
        }
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