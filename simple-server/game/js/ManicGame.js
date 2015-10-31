(function ( ThreeDeeWorld ){

    /***************************************************************
     * ManicGame
     */

    var socket;

    var ManicGame = {

        setup: function ( socketConnection ) {

            socket = socketConnection;

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

    window.ManicGame = ManicGame;

})( window.ThreeDeeWorld );