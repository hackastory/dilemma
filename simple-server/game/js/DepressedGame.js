(function ( ThreeDeeWorld ){

    var socket;

    var worldRotationSpeed = 0.03;
    var worldIsRotating = false;
    var worldRotationCurrent = new THREE.Vector3( 0, 0, 0 );
    var worldRotationTarget = new THREE.Vector3( 0, 0, 0 );

    /***************************************************************
     * Depressed player
     */

    var lastPlayerPosition = { x: 0, y: 0, z:0 };

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

                   // console.log( 'collision on box ', i, player.pos );
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
            var newPosition;

            if ( ! worldIsRotating ) {
                for ( var i = 0; i < player.keys.length; i++ ) {
                    if ( player.keys[ i ].isDown ) {
                        player.keys[ i ].action();
                    }
                }
            }

            camera.position.x = player.pos.x;
            camera.position.y = player.pos.y;
            camera.position.z = player.pos.z;

            if ( ! ThreeDeeWorld.getControls() ) {
                // we're dealing with desktop here, no mobile
                camera.rotation.x = player.rot.x;
                camera.rotation.y = player.rot.y;
                camera.rotation.z = player.rot.z;
            }

            light.position.set( player.pos.x, player.pos.y, player.pos.z );

            if ( player.rot.y >= 2 * Math.PI || player.rot.y <= -(2 * Math.PI) ) {
                player.rot.y = 0
            }

            newPosition = {
                x: player.pos.x, y: player.pos.y, z: player.pos.z
            };

            if ( JSON.stringify( newPosition ) !== JSON.stringify( lastPlayerPosition ) ) {

                lastPlayerPosition.x = newPosition.x;
                lastPlayerPosition.y = newPosition.y;
                lastPlayerPosition.z = newPosition.z;

                socket.emit( 'player-coordinates', lastPlayerPosition );
            }
        }
    };


    /***************************************************************
     * Depressed world
     */

    function worldEvents ( which ) {

        var world = ThreeDeeWorld.getWorld();

        if ( ! worldIsRotating ) {
            worldRotationTarget = new THREE.Vector3( worldRotationCurrent.x, worldRotationCurrent.y, worldRotationCurrent.z );

            switch ( which ) {
                case 72: //H
                    worldRotationTarget.z = worldRotationTarget.z + (Math.PI * .5);
                    break;
                case 75: //K
                    worldRotationTarget.z = worldRotationTarget.z - (Math.PI * .5);
                    break;
                case 85: //U
                    worldRotationTarget.x = worldRotationTarget.x - (Math.PI * .5);
                    break;
                case 74: //J
                    worldRotationTarget.x = worldRotationTarget.x + (Math.PI * .5);
                    break;
            }

            var offset = new THREE.Vector3();
            offset.subVectors( new THREE.Vector3( 0, 0, 0 ), player.pos );
            for ( var i = 0; i < world.children.length; i++ ) {
                world.children[ i ].position.add( offset );
            }
            player.pos = new THREE.Vector3( 0, 0, 0 );
            worldIsRotating = true;
            updateHitBoxes();
        }
    }

    function rotateWorld () {

        var world = ThreeDeeWorld.getWorld();

        if ( worldIsRotating ) {
            //console.log("rotation start");
            var delta = new THREE.Vector3();
            delta.subVectors( worldRotationTarget, worldRotationCurrent );

            if ( delta.length() < worldRotationSpeed ) {
                worldRotationCurrent = worldRotationTarget;
                worldIsRotating = false;
                updateHitBoxes();
            } else {
                delta.setLength( worldRotationSpeed );
                worldRotationCurrent.add( delta );
            }

            world.rotation.x = worldRotationCurrent.x;
            world.rotation.y = worldRotationCurrent.y;
            world.rotation.z = worldRotationCurrent.z;

        }

    }

    function updateHitBoxes () {

        var cubes = ThreeDeeWorld.getCubes();

        for ( var i = 0; i < cubes.length; i++ ) {
            cubes[ i ].box = new THREE.Box3().setFromObject( cubes[ i ].mesh );
        }
    }


    /***************************************************************
     * DepressedGame
     */

    var DepressedGame = {

        setup: function ( socketConnection ) {

            socket = socketConnection;

            socket.on('grid', DepressedGame.handleGrid );
            socket.on('start', DepressedGame.handleStart );
        },

        bindKeyEvents: function () {

            document.addEventListener('keydown', function ( e ) {
                switch ( e.keyCode ) {
                    case 37:
                    case 38:
                    case 39:
                    case 40:
                        player.updateVel( { key: e.keyCode, isPressed: true } );
                        break;
                    default:
                        worldEvents( e.keyCode );
                        break;
                }
            });

            document.addEventListener('keyup', function ( e ) {
                player.updateVel( { key: e.keyCode, isPressed: false } );
            });
        },

        handleGrid: function ( gridData ) {
            console.log( 'grid received', gridData );
        },

        handleStart: function () {

            // create the 3D world

            console.log('we can start creating the Depressed game!');

            ThreeDeeWorld.createGameWorld();

            DepressedGame.bindKeyEvents();

            DepressedGame.render();
        },


        render: function () {

            requestAnimationFrame( DepressedGame.render );

            player.move();

            rotateWorld();

            ThreeDeeWorld.render();
        }
    };

    window.DepressedGame = DepressedGame;

})( window.ThreeDeeWorld );