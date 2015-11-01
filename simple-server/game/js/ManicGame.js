(function ( ThreeDeeWorld ){


    var socket;

    /***************************************************************
     * Manic Player
     */


    /***************************************************************
     * ManicGame
     */

    var ManicGame = {

        setup: function ( socketConnection ) {

            socket = socketConnection;

            socket.on('grid', ManicGame.handleGrid );
        },

        handleGrid: function ( gridData ) {
            console.log( 'grid received', gridData );
        },

        start: function () {

            // create the 3D world

            console.log('we can start creating the Manic game!');

            ThreeDeeWorld.createGameWorld();

            ManicGame.render();
        },

        render: function () {

            requestAnimationFrame( ManicGame.render );

            // do ManicGame specific stuff

            ThreeDeeWorld.render();
        }
    };


    window.ManicGame = ManicGame;

})( window.ThreeDeeWorld );