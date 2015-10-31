/**
 * ThreeDeeWorld only creates the basic game world that both players need.
 * Add game specific effects and gameplay in the respective ...Game.js classes
 */

(function ( $ ) {

    var camera;
    var cubes = [];
    var light;
    var renderer;
    var scene;
    var world;

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


    var ThreeDeeWorld = {

        create: function () {

            camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
            light = new THREE.HemisphereLight( 0xffffff, 0, 0.6 );
            renderer = new THREE.WebGLRenderer();
            scene = new THREE.Scene();
            world = new THREE.Object3D();

            renderer.setSize( window.innerWidth, window.innerHeight );

            document.body.appendChild( renderer.domElement );

            ThreeDeeWorld._createGrid();
            ThreeDeeWorld._createFloor();

            scene.add(world);
            scene.add(light);

            $( window ).on('resize', ThreeDeeWorld.handleResize );
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

            var texture1 = THREE.ImageUtils.loadTexture( 'textures/floor_tile.jpg' );
            var material = new THREE.MeshBasicMaterial( { map: texture1, transparent: true } );
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

        getCubes: function () {
            return cubes;
        },

        getLight: function () {
            return light;
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

            renderer.setSize( windowWidth, windowHeight );
            camera.aspect = windowWidth / windowHeight;
            camera.updateProjectionMatrix();
        },

        // called from the implementing Game class, because it probably needs to do
        // some extra stuff prior to rendering
        render: function () {
            renderer.render( scene, camera );
        }
    };



    /***********************************************
     *
     */

    window.ThreeDeeWorld = ThreeDeeWorld;

})( window.jQuery );