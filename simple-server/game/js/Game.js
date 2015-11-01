(function ( ManicGame, DepressedGame, PlayerChooser, ThreeDeeWorld ) {

    var dl = document.location;
    var socketServer = dl.origin;

    var socket = io( socketServer );

    var $gameContainer = $('#app');

    var Game = {

        setup: function () {
        
            socket.on('reset', Game.handleReset );
            socket.on('playertaken', Game.handlePlayerTaken );

            ThreeDeeWorld.create();

            Game.createChooser();
        },

        createChooser: function () {

            // Use the 3D Chooser
            PlayerChooser.setup( socket );

            // Or choose one straight away
            //    DepressedGame.setup( socket );
            //    socket.emit('login', 'depressed');

        },

        createOutro: function () {

        },

        handlePlayerTaken: function ( playerName ) {
            $('#'+ playerName ).hide(); // hide the button option
        },

        handleReset: function () {

        }

        
    };


    /****************************/
    Game.setup();

})( window.ManicGame, window.DepressedGame, window.PlayerChooser, window.ThreeDeeWorld );