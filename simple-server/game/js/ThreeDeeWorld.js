/**
 * ThreeDeeWorld only creates the basic game world that both players need.
 * Add game specific effects and gameplay in the respective ...Game.js classes
 */

(function ( $ ) {

    var map = [];
    map[0]=[    [2,2,2,2,2,2,2,2,2,2],
                [2,1,2,1,1,1,1,1,1,2],
                [2,1,2,1,0,0,0,0,1,2],
                [2,1,2,1,0,0,0,0,1,2],
                [2,1,1,0,0,0,0,0,1,2],
                [2,1,0,0,0,0,0,0,1,2],
                [2,1,0,0,0,0,0,0,1,2],
                [2,1,0,0,0,0,0,0,1,2],
                [2,1,1,1,1,1,1,1,1,2],
                [2,2,2,2,2,2,2,2,2,2]   ];

    map[1]=[    [2,1,1,1,1,1,1,1,1,1],
                [1,0,1,0,0,0,0,0,0,1],
                [1,0,1,0,0,0,0,0,0,1],
                [1,1,2,1,0,0,0,0,0,1],
                [1,0,1,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1]   ];

    map[2]=[    [2,1,0,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,0,0,0],
                [0,1,2,1,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0]   ];


    map[3]=[    [2,1,0,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0,0,0],
                [1,0,1,0,0,0,0,0,0,0],
                [1,1,2,1,1,1,1,1,0,0],
                [0,0,1,0,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,1,0,0],
                [0,0,1,1,1,1,1,1,0,0],
                [0,0,1,0,0,0,0,0,0,0],
                [1,1,1,0,0,0,0,0,0,0]   ];


    map[4]=[    [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,0,0,0],
                [0,1,2,1,1,1,1,1,0,0],
                [0,1,2,1,0,0,0,0,0,0],
                [0,1,2,1,0,0,0,1,0,0],
                [0,1,2,1,1,1,1,2,1,1],
                [0,1,2,2,2,2,2,2,1,1],
                [1,1,2,1,1,1,1,1,1,1],
                [2,2,2,1,0,0,0,0,1,1]   ];


    map[5]=[    [0,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1],
                [0,0,1,0,0,0,1,1,1,1],
                [0,0,1,0,0,0,0,1,1,1],
                [0,0,1,0,0,0,1,2,1,2],
                [0,0,1,1,1,1,1,1,1,2],
                [1,0,1,0,0,0,0,0,1,2],
                [2,1,1,1,1,1,1,1,1,2]   ];

    map[6]=[    [1,1,1,1,1,1,2,1,1,2],
                [1,0,1,1,1,0,1,0,0,1],
                [0,0,0,0,0,0,1,1,1,1],
                [1,0,0,0,0,1,2,2,2,2],
                [1,0,0,1,0,0,1,1,1,1],
                [1,0,0,1,0,0,1,1,1,1],
                [1,0,0,1,0,0,1,2,2,1],
                [1,0,0,1,1,1,1,1,1,1],
                [1,0,0,1,0,0,0,0,0,1],
                [2,1,1,1,0,0,0,0,1,2]   ];

    map[7]=[    [2,1,0,0,0,0,0,0,1,2],
                [1,0,0,0,0,0,0,0,1,2],
                [0,0,0,0,0,1,1,1,1,2],
                [0,0,0,0,0,1,2,1,1,2],
                [0,0,0,0,0,1,1,1,1,1],
                [0,0,0,0,0,0,0,0,0,1],
                [0,0,0,0,0,0,0,0,0,1],
                [0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,1],
                [2,1,0,0,0,0,0,0,1,2]   ];

    map[7]=[    [2,1,1,1,1,1,2,1,1,2],
                [1,0,0,0,0,0,1,0,0,1],
                [0,0,0,0,0,0,1,0,0,1],
                [0,0,0,0,0,1,2,1,0,1],
                [0,0,0,0,0,0,1,0,0,1],
                [0,0,0,0,0,0,0,0,0,1],
                [0,0,0,0,0,0,0,0,0,1],
                [0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,1],
                [2,1,1,1,1,1,1,1,1,2]   ];

    map[8]=[    [2,2,2,2,2,2,2,2,2,2],
                [1,1,1,1,1,1,2,1,1,2],
                [0,0,0,0,0,1,2,1,1,2],
                [0,0,0,0,0,1,2,1,1,2],
                [0,0,0,0,0,0,1,0,1,4],
                [0,0,0,0,0,0,0,0,1,2],
                [0,0,0,0,0,0,0,0,1,2],
                [0,0,0,0,0,0,0,0,1,2],
                [1,1,1,1,1,1,1,1,1,2],
                [2,2,2,2,2,2,2,2,2,2]   ];

    var camera;
    var controls;
    var effect;
    var light;
    var renderer;
    var scene;
    var world;

    var clock;

    var ThreeDeeWorld = {

        create: function () {

            camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 100000 );
            clock  = new THREE.Clock();

            light = new THREE.HemisphereLight( 0xffffff, 0, 0.6 );
            renderer = new THREE.WebGLRenderer({alpha: true});
            renderer.setClearColor( 0xffffff, 0);

            effect = new THREE.StereoEffect(renderer);
            
            scene = new THREE.Scene();
            world = new THREE.Object3D();

            world.position.x = 2;
            world.position.y = 2;
            world.position.z = 2;

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

        getCamera: function () {
            return camera;
        },

        getControls: function () {
            return controls;
        },

        getLight: function () {
            return light;
        },

        getMap: function () {
            return map;
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