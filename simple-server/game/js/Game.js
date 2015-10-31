$(function () {

    var dl = document.location;
    var socketServer = dl.origin;

    var socket = io( socketServer );

    var $gameContainer = $('#app');

    var Game = {

        setup: function () {


            // bind socket events
            socket.on('reset', Game.handleReset );
            socket.on('playertaken', Game.handlePlayerTaken );


            // create the intro
            Game.createIntro();
        },

        createIntro: function () {

            // TODO: hide irrelevante knopjes wanneer iemand later de pagina bezoekt

            $gameContainer.append( ''.concat(
                '<h1>Choose your player</h1>',
                '<button id="manic">Light</button>',
                '<button id="depressed">Dark</button>'
            ) );

            $('#manic' ).on('click', function () {

                $gameContainer.hide();

                ManicGame.setup();
                socket.emit('login', 'manic');
            });

            $('#depressed' ).on('click', function () {

                $gameContainer.hide();

                DepressedGame.setup();
                socket.emit('login', 'depressed');
            });
        },

        handlePlayerTaken: function ( playerName ) {
            $('#'+ playerName ).hide(); // hide the button option
        },

        handleReset: function () {

        }
    };

    /***************************************************************
     * ManicGame
     */

    var ManicGame = {

        setup: function () {
            socket.on('grid', ManicGame.handleGrid );
            socket.on('start', ManicGame.handleStart );
        },

        handleGrid: function ( gridData ) {
            console.log( 'grid received', gridData );
        },

        handleStart: function () {

            // create the 3D world

            console.log('we can start creating the Manic game!');
        }
    };

    /***************************************************************
     * DepressedGame
     */

    var DepressedGame = {

        setup: function () {
            socket.on('grid', DepressedGame.handleGrid );
            socket.on('start', DepressedGame.handleStart );
        },

        handleGrid: function ( gridData ) {
            console.log( 'grid received', gridData );
        },

        handleStart: function () {

            // create the 3D world

            console.log('we can start creating the Depressed game!');
        }
    };

    /****************************/
    Game.setup();
});