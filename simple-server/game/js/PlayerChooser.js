(function ( ThreeDeeWorld ){


    var socket;


    /***************************************************************
     * PlayerChooser
     */

    var PlayerChooser = {

        setup: function ( socketConnection ) {

            socket = socketConnection;

            socket.on('start', PlayerChooser.handleStart );

            ThreeDeeWorld.createChooserWorld();

            PlayerChooser.render();

            PlayerChooser.bindKeyEvents();
        },

        bindKeyEvents : function () {

            var camera = ThreeDeeWorld.getCamera();

            camera.rotation.y = ( Math.PI / 4 ) * 2;

            document.addEventListener('keydown', function ( e ) {
                switch ( e.keyCode ) {
                    case 37:
                        camera.rotation.y += 0.1;
                            break;
                    case 39:
                        camera.rotation.y -= 0.1;
                        break;
                }
            });
        },

        checkChoice: function () {
            // checked through the player's gaze
        },

        handleStart: function () {

            // erase this world

        },

        render: function () {

            requestAnimationFrame( PlayerChooser.render );

            ThreeDeeWorld.render();
        }
    };


    window.PlayerChooser = PlayerChooser;

})( window.ThreeDeeWorld );