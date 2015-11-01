/**
 * ThreeDeeWorld only creates the basic game world that both players need.
 * Add game specific effects and gameplay in the respective ...Game.js classes
 */

(function ( $ ) {

    var map = [];

    map[0] =[[1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1]];

    map[1] =[[1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,1,1,1,1,1,0,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1]];

    map[2] =[[1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,0,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1]];

    map[3] =[[1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,1,1,1,1,1,0,1],
            [1,1,1,1,0,1,1,1,1,1,1,1],
            [1,1,1,1,0,1,1,1,1,1,1,1],
            [1,1,1,1,0,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1]];

    map[4] =[[1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,0,1,0,0,0,1,1,1],
            [1,1,1,1,0,1,1,1,0,1,1,1],
            [1,1,1,1,0,1,1,1,0,1,1,1],
            [1,1,1,1,0,1,1,1,0,1,1,1],
            [1,1,1,1,0,0,0,0,0,0,0,1],
            [1,1,1,1,0,1,1,1,1,1,0,1],
            [1,0,0,0,0,1,1,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1]];

    map[5] =[[1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,0,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,0,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1]];

    map[6]=[[1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,0,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,0,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1]];

    map[7]=[[1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,0,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,0,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1]];

    map[8]=[[1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,0,1,1,1,0,1],
            [1,0,1,1,1,1,0,1,1,1,0,1],
            [1,0,1,1,1,1,0,1,1,1,0,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,1,1,1,1,1,0,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1]];

    map[9]=[[1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1]];

    var camera;
    var controls;
    var effect;
    var light;
    var renderer;
    var scene;
    var world;

    var clock;

    // Intro / Chooser objects
    var manicGameChoice;
    var depressedGameChoice;

    // Gameplay objects
    var cubes = [];

    var ThreeDeeWorld = {

        create: function () {

            camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 100000 );
            clock  = new THREE.Clock();

            light = new THREE.HemisphereLight( 0xffffff, 0, 0.6 );
            renderer = new THREE.WebGLRenderer();

            effect = new THREE.StereoEffect(renderer);
            
            scene = new THREE.Scene();
            world = new THREE.Object3D();

            renderer.setSize( window.innerWidth, window.innerHeight );
			effect.setSize( window.innerWidth, window.innerHeight );
            effect.separation = 0;

            scene.add(world);
            scene.add(light);

            document.body.appendChild( renderer.domElement );

            window.addEventListener( 'deviceorientation', setOrientationControls, true );

            $( window ).on('resize', ThreeDeeWorld.handleResize );
            
           
        },
        
        playAudio: function() {
	        var soundPlaying = false;
	        createjs.Sound.registerSound("audio/threebirds.mp3", 'sound');
	        $('canvas').click(function(){
		        if (!soundPlaying){
					createjs.Sound.play('sound');
				}
				soundPlaying = true;
			});

        },

        createChooserWorld: function () {

            var geometry = new THREE.BoxGeometry(1, 1, 1);

            manicGameChoice = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x123fe5 } ) );
            manicGameChoice.position.set( 2, 1, -10 );
            manicGameChoice.name = 'manic';

            depressedGameChoice = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xf630a5 } ) );
            depressedGameChoice.position.set( -2, 1, -10 );
            depressedGameChoice.name = 'depressed';

            scene.add( manicGameChoice );
            scene.add( depressedGameChoice );

            //ThreeDeeWorld._createFloor();
        },

        createGameWorld: function () {

            ThreeDeeWorld._createGrid();
            ThreeDeeWorld._createFloor();
        },

        _createFloor: function () {

            var geometry = new THREE.PlaneGeometry( 1000,1000 );
            var texture = THREE.ImageUtils.loadTexture( 'textures/checkerboard.png' );
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set( 100, 100 );

            var groundmaterial = new THREE.MeshBasicMaterial( { map: texture } );
            var ground = new THREE.Mesh( geometry, groundmaterial );
            ground.rotation.x = -Math.PI*0.5;
            ground.position.y = -1;

            world.add(ground);
        },

        _createGrid: function () {

            var texture = THREE.ImageUtils.loadTexture( 'textures/floor_tile.jpg' );
            var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );
            var geometry = new THREE.BoxGeometry(2, 2, 2);

            for (var z = 0; z < map.length; z++) {
                for (var x = 0; x < map[z].length; x++) {
                    for (var y = 0; y < map[z][x].length; y++) {

                        if (map[z][x][y] != 0) {

                            geometry = new THREE.BoxGeometry(2, 2, 2);

                            var mesh = new THREE.Mesh(geometry, material);
                            mesh.position.x = x * 2;
                            mesh.position.y = z * 2;
                            mesh.position.z = y * 2;
                            mesh.name = 'cube';

                            var cube = {
                                mesh: mesh,
                                box: new THREE.Box3().setFromObject(mesh),
                                cubetype: map[z][x][y]
                            };

                            cubes.push(cube);
                            world.add(mesh);
                        }

                    }
                }
            }
        },

        getCamera: function () {
            return camera;
        },

        getControls: function () {
            return controls;
        },

        getCubes: function () {
            return cubes;
        },

        getGameChoiceManic: function () {
            return manicGameChoice;
        },

        getGameChoiceDepressed: function () {
            return depressedGameChoice;
        },

        getLight: function () {
            return light;
        },

        getDomElement: function () {
            if ( renderer ) {
                return renderer.domElement;
            }
        },

        getScene: function () {
            return scene;
        },

        getWorld: function () {
            return world;
        },

        handleResize: function () {

            var windowWidth = $( window ).width();
            var windowHeight = $( window ).height();

            camera.aspect = windowWidth / windowHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( windowWidth, windowHeight );
            effect.setSize( windowWidth, windowHeight );
        },

        // should be called from the implementing Game class, because that one probably
        // needs to do some extra stuff prior to rendering
        render: function () {

            renderer.render( scene, camera );
            effect.render( scene, camera );

            if ( controls ) {
                controls.update( clock.getDelta() );
            }
        }
    };

    function setOrientationControls ( e ) {

        if ( ! e.alpha ) {
            return;
        }
        controls = new THREE.DeviceOrientationControls( camera );
        controls.connect();
        controls.update();

        window.removeEventListener( 'deviceorientation', setOrientationControls, true );
    }

    /***********************************************
     *
     */

    window.ThreeDeeWorld = ThreeDeeWorld;

})( window.jQuery );