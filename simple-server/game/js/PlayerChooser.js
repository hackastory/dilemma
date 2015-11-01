(function ( ManicGame, DepressedGame, ThreeDeeWorld ){


    var socket;

    var rayCaster = new THREE.Raycaster();
    var rayVector = new THREE.Vector3();
    var camera;

    var chosen = false;

    /***************************************************************
     * PlayerChooser
     */

    var chooseTimeout;

    var PlayerChooser = {

        setup: function ( socketConnection ) {

            socket = socketConnection;

            socket.on('playertaken', PlayerChooser.handlePlayerTaken );

            ThreeDeeWorld.createChooserWorld();

            ThreeDeeWorld.getLight().intensity = 1;

            camera = ThreeDeeWorld.getCamera();

            PlayerChooser.bindKeyEvents();

            PlayerChooser.render();
        },

        bindKeyEvents : function () {

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

            var manicChoice = ThreeDeeWorld.getGameChoiceManic();
            var depressedChoice = ThreeDeeWorld.getGameChoiceDepressed();

            rayVector.x = .125;
            rayVector.y = .25;
            rayCaster.setFromCamera( rayVector, camera );

            var intersects = rayCaster.intersectObjects( [
                depressedChoice, manicChoice
            ] );

            if (  intersects.length > 0 ) {

                switch ( intersects[0].object.name ) {

                    case 'manic':

                        manicChoice.material.emissive = new THREE.Color( 0xFFFFFF );

                        if ( ! chooseTimeout ) {
                            chooseTimeout = setTimeout( function () {

                                chosen = true;
                                PlayerChooser.clearChooser();
                                ManicGame.setup( socket );
                                socket.emit( 'login', 'manic' );

                            }, 1200 );
                        }

                        break;

                    case 'depressed':

                        depressedChoice.material.emissive = new THREE.Color( 0xFFFFFF );

                        if ( ! chooseTimeout ) {
                            chooseTimeout = setTimeout( function () {

                                chosen = true;
                                PlayerChooser.clearChooser();
                                DepressedGame.setup( socket );
                                socket.emit( 'login', 'depressed' );

                            }, 1200 );
                        }

                        break;
                }
            } else {

                manicChoice.material.emissive = new THREE.Color( 0x000000 );
                depressedChoice.material.emissive = new THREE.Color( 0x000000 );

                if ( chooseTimeout ) {
                    clearTimeout( chooseTimeout );
                    chooseTimeout = null;
                }
            }
        },

        clearChooser: function () {

            // erase this world's objects
            var scene = ThreeDeeWorld.getScene();

            scene.remove( scene.getObjectByName( 'manic' ) );
            scene.remove( scene.getObjectByName( 'depressed' ) );
        },

        handlePlayerTaken: function ( playerName ) {
            var scene = ThreeDeeWorld.getScene();

            scene.remove( scene.getObjectByName( playerName ) );
        },

        render: function () {

            if ( ! chosen ) {
                requestAnimationFrame( PlayerChooser.render );

                PlayerChooser.checkChoice();

                ThreeDeeWorld.render();
            }
        }
    };


    window.PlayerChooser = PlayerChooser;

})( window.ManicGame, window.DepressedGame, window.ThreeDeeWorld );