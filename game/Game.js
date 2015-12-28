var socket = io( document.location.origin );

var Game = {

    bindSocketEvents: function () {

        socket.on( 'start', Game.handleStart );
        socket.on( 'intro-finished', Game.handleIntroFinished );
        socket.on( 'outro-finished', Game.handleOutroFinished );
        socket.on( 'reset', Game.handleReset );
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
                $('.hud' ).show();
                var hudTimers = $('.hud-timer');
                timer.on('progress', function ( milliSecondsPassed ) {
                    var durationLeft = new FormatDuration( 180000 - milliSecondsPassed );
                    hudTimers.html( durationLeft.getMinutesSeconds() );
                });

                new OuterGame( timer );
                break;
        }
    },

    handleLost: function () {
        $('.hud' ).hide();
        new Outro( false );
    },

    handleOutroFinished: function () {

        socket.emit('reset');
    },

    handleReset: function () {
        delete Game.choice;
        Game.playerChoice = new PlayerChoice();
    },

    handleStart: function () {

        var body = document.querySelector('body');
        body.className = body.className +' loading';

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
        $('.hud' ).hide();
        new Outro( true );
    },

    setup: function () {

        Game.bindSocketEvents();

        Game.playerChoice = new PlayerChoice();
    }
};