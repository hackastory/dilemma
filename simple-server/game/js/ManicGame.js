(function ( ThreeDeeWorld ){


    var socket;

    /***************************************************************
     * Manic world
     */

    var currentPosition = 0;
    var positionInterval = 5;

    var validPositions = [];
    var hypercube = new THREE.Object3D();
    var markerHolder = new THREE.Object3D();
    var marker;

    var worldRotationSpeed = 0.03;
    var worldIsRotating = false;
    var worldRotationCurrent = new THREE.Vector3( 0, 0, 0 );
    var worldRotationTarget = new THREE.Vector3( 0, 0, 0 );

    var cubes = [];
    var light;

    function worldEvents(which) {
        if (!worldIsRotating) {
            console.log(which);

            worldRotationTarget = new THREE.Vector3(worldRotationCurrent.x, worldRotationCurrent.y, worldRotationCurrent.z);

            switch (which) {
                case 72: //H
                    worldRotationTarget.z = worldRotationTarget.z + (Math.PI * .5);
                    socket.emit( 'rotate-h', 'rotate-h' );
                    break;
                case 75: //K
                    worldRotationTarget.z = worldRotationTarget.z - (Math.PI * .5);
                    socket.emit( 'rotate-k', 'rotate-k' );
                    break;
                case 85: //U
                    worldRotationTarget.x = worldRotationTarget.x - (Math.PI * .5);
                    socket.emit( 'rotate-u', 'rotate-u' );
                    break;
                case 74: //J
                    worldRotationTarget.x = worldRotationTarget.x + (Math.PI * .5);
                    socket.emit( 'rotate-j', 'rotate-j' );
                    break;
            }

            worldIsRotating = true;
            updateHitBoxes();
        }
    }

    function rotateWorld() {
        if (worldIsRotating) {
            //console.log("rotation start");

            var delta = new THREE.Vector3();
            delta.subVectors(worldRotationTarget,worldRotationCurrent);

            if (delta.length() < worldRotationSpeed){
                worldRotationCurrent = worldRotationTarget;
                worldIsRotating = false;
                updateHitBoxes();
            } else {
                delta.setLength(worldRotationSpeed);
                worldRotationCurrent.add(delta);
            }

            hypercube.rotation.x = worldRotationCurrent.x;
            hypercube.rotation.y = worldRotationCurrent.y;
            hypercube.rotation.z = worldRotationCurrent.z;

        }

    }

    function updateHitBoxes(){

        for (var i = 0; i < cubes.length; i++) {
            cubes[i].box = new THREE.Box3().setFromObject(cubes[i].mesh);
        }
    }

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
            if ( !worldIsRotating ) {
                for ( var i = 0; i < player.keys.length; i++ ) {
                    if ( player.keys[ i ].isDown ) {
                        player.keys[ i ].action();
                    }
                }
            }

            var world = ThreeDeeWorld.getWorld();

            world.rotation.x = player.rot.x;
            world.rotation.y = player.rot.y;
            world.rotation.z = player.rot.z;

            light.position.set( player.pos.x, player.pos.y, player.pos.z );

            if ( player.rot.y >= 2 * Math.PI || player.rot.y <= -(2 * Math.PI) ) {
                player.rot.y = 0;
            }


            positionInterval++;
            positionInterval %= 15;

            if ( positionInterval == 0 ) {
                currentPosition++;
                if ( currentPosition >= validPositions.length ) {
                    currentPosition = 0;
                }
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

            socket.on('pivot', ManicGame.handlePivot );
            socket.on('world-position', ManicGame.handleWorldPosition );
            
            socket.on('start', ManicGame.handleStart );
            socket.on('won', ManicGame.handleWon );
            socket.on('lost', ManicGame.handleLost );
        },


        bindUserEvents: function () {

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

        createIntro: function () {
	        console.log('Showing Intro');

            // Intro movie? Animated Gif? 3D world?
            createjs.Sound.registerSound("audio/soundscape-outside-man-final.mp3", 'soundMan');

            var introVideo = document.getElementById('introVideo');
            $(introVideo).fadeIn();
            $(introVideo).attr({'src': 'video/intro.mp4'});

			if (introVideo.requestFullscreen) {
				introVideo.requestFullscreen();
			} else if (introVideo.mozRequestFullScreen) {
				introVideo.mozRequestFullScreen();
			} else if (introVideo.webkitRequestFullscreen) {
				introVideo.webkitRequestFullscreen();
			}
            introVideo.play();

            introVideo.addEventListener('ended', function() {
	            $(introVideo).get(0).webkitExitFullScreen();
	        	$(introVideo).addClass('done').fadeOut(2000, function () {

                    console.log('introoo');

                });

                socket.emit('intro-finished');
	        	createjs.Sound.play('soundMan');
	        }, false);
        },

        createWorld: function () {

            var scene = ThreeDeeWorld.getScene();
            var camera = ThreeDeeWorld.getCamera();
            var world = ThreeDeeWorld.getWorld();
            var map = ThreeDeeWorld.getMap();

            document.body.className = 'manic';

            camera.position.z = 55;

            var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
            directionalLight.position.set( 1, 1, 0 );
            scene.add( directionalLight );

            light = new THREE.AmbientLight( 0xfcc22f ); // soft white light
            scene.add( light );

            var geometry = new THREE.CubeGeometry(2.2,2.2,2.2);
            var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
            mesh.position.x = 8;
            mesh.position.y = 7;
            mesh.position.z = 8;
            mesh.name = 'marker';

            marker = {
                mesh: mesh
            };

            var material = new THREE.LineBasicMaterial( { color: 0xFFFFFF, opacity: 0, transparent: true } );
            var materialTunnel = new THREE.MeshPhongMaterial( { color: 0xFCC22F, opacity: 1, transparent: false } );
            var materialFinish = new THREE.MeshPhongMaterial( { color: 0xDD00CC, opacity: 1, transparent: false } );

           for ( var z = 0; z < map.length; z++ ) {
               for ( var x = 0; x < map[ z ].length; x++ ) {
                   for ( var y = 0; y < map[ z ][ x ].length; y++ ) {


                       var isTunnel = map[ z ][ x ][ y ] === 2;
                       var isFinish = map[ z ][ x ][ y ] === 4;
                       var cubeSize = isTunnel ? 2 : 2;
                       var geometry = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );

                       var cubeMaterial = isTunnel ? materialTunnel : material;
                       if ( isFinish ) {
                           cubeMaterial = materialFinish;
                       }

                       var mesh = new THREE.Mesh( geometry, cubeMaterial );
                       mesh.position.x = (x - 5) * 2;
                       mesh.position.y = (z - 4.5) * 2;
                       mesh.position.z = (y - 5) * 2;
                       mesh.name = "cube";


                       var cube = {
                           mesh: mesh, box: new THREE.Box3().setFromObject( mesh ), cubetype: map[ z ][ x ][ y ]
                       };

                       cubes.push( cube );
                       hypercube.add( mesh );

                       if ( isTunnel ) {
                           var validPos = new THREE.Vector3( x * 2, y * 2, z * 2 );
                           validPositions.push( validPos );
                       }
                   }
               }
           }

            markerHolder.add(marker.mesh);
            hypercube.add(marker.mesh);

            world.add(hypercube);
        },

        handleGrid: function ( gridData ) {
            console.log( 'grid received', gridData );
        },

        handleLost: function() {
	        console.log('LOST');
        },

		handleStart: function () {

            ManicGame.createIntro();
        },

        handlePivot: function ( eventData ) {

            var world = ThreeDeeWorld.getWorld();

            eventData = JSON.parse( eventData );

            var x = Math.round( eventData.x ) / 180 * Math.PI, y = Math.round( eventData.y ) / 180 * Math.PI, z = Math.round( eventData.z ) / 180 * Math.PI;

            console.log( 'pivot', eventData, x, y, z );
            world.rotation.set( x, y, z );
        },

        handleWon: function () {
	        console.log('WON!');
			createjs.Sound.stop('soundMan');
			
			
			var winVideo = document.getElementById('winVideo');
            $(winVideo).fadeIn();
            $(winVideo).attr({'src': 'video/explosion_ending.mp4'});
            
			if (winVideo.requestFullscreen) {
				winVideo.requestFullscreen();
			} else if (winVideo.mozRequestFullScreen) {
				winVideo.mozRequestFullScreen();
			} else if (winVideo.webkitRequestFullscreen) {
				winVideo.webkitRequestFullscreen();
			}
            winVideo.play();
            
        },

        handleWorldPosition: function ( eventData ) {

            eventData = JSON.parse( eventData );

            var world = ThreeDeeWorld.getWorld();
            var x = Math.round( eventData.x ), y = Math.round( eventData.y ), z = Math.round( eventData.z );

            console.log( 'worldpos', x, y, z );
            hypercube.position.set( x, y, z );
            marker.mesh.position.set( -x - 8, -y - 7, -z - 8 );
            world.position.set( -x, -y, -z );
        },

        render: function () {

            requestAnimationFrame( ManicGame.render );

            // do ManicGame specific stuff

            player.move();

            rotateWorld();

            ThreeDeeWorld.render();
        },

        start: function () {

            console.log('we can start creating the Manic game!');

            ManicGame.createWorld();

            ManicGame.bindUserEvents();

            ManicGame.render();
        }
    };


    window.ManicGame = ManicGame;

})( window.ThreeDeeWorld );