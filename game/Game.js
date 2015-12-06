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
        switch ( Game.choice ) {

            case 'innerView':
                new InnerGame();
                break;

            case 'outerView':
                new OuterGame();
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