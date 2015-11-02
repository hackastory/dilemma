(function ( ManicGame, DepressedGame, ThreeDeeWorld ){


    var socket;

    var rayCaster = new THREE.Raycaster();
    var rayVector = new THREE.Vector3();
    var camera;

    var manicGameChoice;
    var depressedGameChoice;
    var gameChoiceLabel;

    var chosen;

    /***************************************************************
     * PlayerChooser
     */

    var chooseTimeout;

    var PlayerChooser = {

        setup: function ( socketConnection ) {

            socket = socketConnection;

            socket.on('playertaken', PlayerChooser.handlePlayerTaken );
            socket.on('intro-finished', PlayerChooser.handleIntroFinished );

            camera = ThreeDeeWorld.getCamera();

            ThreeDeeWorld.getLight().intensity = 1;

            PlayerChooser.createWorld();

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

            rayVector.x = .125;
            rayVector.y = .25;
            rayCaster.setFromCamera( rayVector, camera );

            var intersects = rayCaster.intersectObjects( [
                depressedGameChoice, manicGameChoice
            ] );

            if (  intersects.length > 0 ) {

                switch ( intersects[0].object.name ) {

                    case 'manic':

                        manicGameChoice.material.emissive = new THREE.Color( 0xFFFFFF );

                        if ( ! chooseTimeout ) {
                            chooseTimeout = setTimeout( function () {

                                chosen = 'manic';
                                PlayerChooser.renderWaitingScreen();
                                ManicGame.setup( socket );
                                socket.emit( 'login', 'manic' );

                            }, 1200 );
                        }

                        break;

                    case 'depressed':

                        depressedGameChoice.material.emissive = new THREE.Color( 0xFFFFFF );

                        if ( ! chooseTimeout ) {
                            chooseTimeout = setTimeout( function () {

                                chosen = 'depressed';
                                DepressedGame.setup( socket );
                                PlayerChooser.renderWaitingScreen();
                                socket.emit( 'login', 'depressed' );

                            }, 1200 );
                        }

                        break;
                }
            } else {

                manicGameChoice.material.emissive = new THREE.Color( 0x000000 );
                depressedGameChoice.material.emissive = new THREE.Color( 0x000000 );

                if ( chooseTimeout ) {
                    clearTimeout( chooseTimeout );
                    chooseTimeout = null;
                }
            }
        },

        clearChooser: function () {

            // erase this world's objects
            var scene = ThreeDeeWorld.getScene();

            scene.remove( depressedGameChoice );
            scene.remove( manicGameChoice );
        },

        createWorld: function () {
            var scene = ThreeDeeWorld.getScene();
            var geometry = new THREE.BoxGeometry(1, 1, 1);

            manicGameChoice = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x123fe5 } ) );
            manicGameChoice.position.set( 3, 1, -10 );
            manicGameChoice.name = 'manic';

            depressedGameChoice = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xf630a5 } ) );
            depressedGameChoice.position.set( -3, 1, -10 );
            depressedGameChoice.name = 'depressed';

            scene.add( manicGameChoice );
            scene.add( depressedGameChoice );
        },

        handleIntroFinished: function () {

            console.log('PlayerChooser intro finished!');

            ThreeDeeWorld.getLight().intensity = 0.6;

            if (chosen === 'manic' ) {

                ManicGame.start();
            } else {
                DepressedGame.start();
            }
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
        },

        renderWaitingScreen : function () {
            // show the player that he has to wait for the other person to choose
            // his / her role

            PlayerChooser.clearChooser();

            console.log('waiting for other player');
        }
    };


    window.PlayerChooser = PlayerChooser;

})( window.ManicGame, window.DepressedGame, window.ThreeDeeWorld );