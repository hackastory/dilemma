(function ( ThreeDeeWorld ){

    /***************************************************************
     * DepressedGame
     */

    var socket;

    var DepressedGame = {

        setup: function ( socketConnection ) {

            socket = socketConnection;

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

    window.DepressedGame = DepressedGame;

})( window.ThreeDeeWorld );