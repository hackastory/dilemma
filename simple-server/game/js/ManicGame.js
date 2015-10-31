(function ( ThreeDeeWorld ){


    var socket;

    /***************************************************************
     * Manic Player
     */

    var player = {
        pos: new THREE.Vector3( 2, 2, 2 ),
        rot: new THREE.Vector3( 0, 0, 0 ),
        rotTarget: new THREE.Vector3( 0, 0, 0 ),
        keys: [ {
            keyCode: 37, isDown: false, action: function () {
                player.rot.y += 0.1
            }
        }, {
            keyCode: 38, isDown: false, action: function () {
                player.tryMovement( 'sub' )
            }
        }, {
            keyCode: 39, isDown: false, action: function () {
                player.rot.y -= 0.1
            }
        }, {
            keyCode: 40, isDown: false, action: function () {
                player.tryMovement( 'add' )
            }
        } ],
        tryMovement: function ( which ) {

            var cubes = ThreeDeeWorld.getCubes();

            var v = new THREE.Vector3( 1, 0, 1 );
            v.applyQuaternion( new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), player.rot.y - (Math.PI * .25) ) );
            v.setLength( 0.5 );

            var tryPos = new THREE.Vector3();
            if ( which == 'sub' ) {
                tryPos.subVectors( player.pos, v );
            } else {
                if ( which == 'add' ) {
                    tryPos.addVectors( player.pos, v );
                }
            }
            for ( var i = 1; i < cubes.length; i++ ) {

                if ( cubes[ i ].box.containsPoint( tryPos ) ) {

                    console.log( 'collision on box ', i, player.pos );
                    return;
                }
            }

            v.setLength( 0.1 );

            if ( which == 'sub' ) {
                player.pos.sub( v );
            } else {
                if ( which == 'add' ) {
                    player.pos.add( v );
                }
            }

            //return v;
        },
        updateVel: function ( input ) {
            for ( var i = 0; i < player.keys.length; i++ ) {
                if ( player.keys[ i ].keyCode == input.key ) {
                    player.keys[ i ].isDown = input.isPressed;
                }
            }
        },
        move: function () {

            var camera = ThreeDeeWorld.getCamera();
            var light = ThreeDeeWorld.getLight();

            //if ( ! worldIsRotating ) {
                for ( var i = 0; i < player.keys.length; i++ ) {
                    if ( player.keys[ i ].isDown ) {
                        player.keys[ i ].action();
                    }
                }
            //}

            camera.position.x = player.pos.x;
            camera.position.y = player.pos.y;
            camera.position.z = player.pos.z;

            camera.rotation.x = player.rot.x;
            camera.rotation.y = player.rot.y;
            camera.rotation.z = player.rot.z;

            light.position.set( player.pos.x, player.pos.y, player.pos.z );

            if ( player.rot.y >= 2 * Math.PI || player.rot.y <= -(2 * Math.PI) ) {
                player.rot.y = 0
            }
        }
    };

    /***************************************************************
     * ManicGame
     */

    var ManicGame = {

        setup: function ( socketConnection ) {

            socket = socketConnection;

            socket.on('grid', ManicGame.handleGrid );
            socket.on('start', ManicGame.handleStart );
        },

        bindKeyEvents: function () {

            document.onkeydown = function ( e ) {
                switch ( e.keyCode ) {
                    case 37:
                    case 38:
                    case 39:
                    case 40:
                        player.updateVel( { key: e.keyCode, isPressed: true } );
                        break;
                    default:
              //          worldEvents( e.keyCode );
                        break;
                }
            };

            document.onkeyup = function ( e ) {
                player.updateVel( { key: e.keyCode, isPressed: false } );
            };
        },

        handleGrid: function ( gridData ) {
            console.log( 'grid received', gridData );
        },

        handleStart: function () {

            // create the 3D world

            console.log('we can start creating the Manic game!');

            ThreeDeeWorld.create();

            ManicGame.bindKeyEvents();

            ManicGame.render();
        },

        render: function () {

            requestAnimationFrame( ManicGame.render );

            player.move();

          //  rotateWorld();

            ThreeDeeWorld.render();
        }
    };


    window.ManicGame = ManicGame;

})( window.ThreeDeeWorld );