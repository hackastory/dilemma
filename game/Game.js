var socket = io( document.location.origin );

var Game = {

    bindSocketEvents: function () {

        socket.on( 'start', Game.handleStart );
        socket.on( 'intro-finished', Game.handleIntroFinished );
        socket.on( 'outro-finished', Game.handleOutroFinished );
        socket.on( 'lost', Game.handleLost );
        socket.on( 'won', Game.handleWon );
    },

    handleIntroFinished: function () {

        // Timer
        var timer = new Timer( 180000 );
        timer.on('end', function () {
            console.log('timer ended');
            socket.emit('lost');
        });

        timer.start();

        switch ( Game.choice ) {

            case 'innerView':
                new InnerGame( timer );
                break;

            case 'outerView':
                new OuterGame( timer );
                break;
        }
    },

    handleLost: function () {
        new Outro( false );
    },

    handleOutroFinished: function () {

        // now what? :)
    },

    handleStart: function () {

        Game.choice = Game.playerChoice.getChoice();

        switch ( Game.choice ) {

            case 'innerView':
                new InnerIntro();
                break;

            case 'outerView':
                new OuterIntro();
                break;
        }
    },

    handleWon: function () {
        new Outro( true );
    },

    setup: function () {

        Game.bindSocketEvents();

        Game.playerChoice = new PlayerChoice();
    }
};