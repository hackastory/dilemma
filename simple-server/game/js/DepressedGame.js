(function ( ThreeDeeWorld ){

    var socket;

    var worldRotationSpeed = 0.03;
    var worldMoveSpeed = 0.2;
    var worldIsRotating = false;
    var worldRotationCurrent = new THREE.Vector3( 0, 0, 0 );
    var worldRotationTarget = new THREE.Vector3( 0, 0, 0 );
    var worldMoveTarget = new THREE.Vector3( 0, 0, 0 );
    var worldIsMoving = false;
    var worldDegrees = [];

    var floorpads = new THREE.Object3D();
    var pivot = new THREE.Object3D();
    var offsetVector = new THREE.Vector3(0,1,0)

    var hoveringId = 0;
    var hoveringTimer = 0;
    var hoverDelay = 1000;
    var hoverCooldownTimer = 0;
    var hoverCooldown = 1000;

    var rayCaster = new THREE.Raycaster();
    var rayVector = new THREE.Vector3();

    /***************************************************************
     * Depressed player
     */

    var lastPlayerPosition = { x: 0, y: 0, z:0 };

    var player = {
        pos : new THREE.Vector3( 0, 0, 0 ),
        rot : new THREE.Vector3( 0, Math.PI, 0 ),
        rotTarget: new THREE.Vector3( 0, 0, 0 ),
        keys : [    {keyCode: 37, isDown: false, action : function(){player.rot.y += 0.1}},
                    {keyCode: 38, isDown: false, action : function(){player.tryMovement("add")}},
                    {keyCode: 39, isDown: false, action : function(){player.rot.y -= 0.1}},
                    {keyCode: 40, isDown: false, action : function(){player.tryMovement("sub")}},
                    {keyCode: 33, isDown: false, action : function(){player.pos.y += 0.1}},
                    {keyCode: 34, isDown: false, action : function(){player.pos.y -= 0.1}}
                ],

        tryMovement: function ( which ) {

            var world = ThreeDeeWorld.getWorld();
            var cubes = ThreeDeeWorld.getCubes();

            var v = new THREE.Vector3( 1, 0, 1 );
            v.applyQuaternion( new THREE.Quaternion().setFromAxisAngle( offsetVector, player.rot.y - (Math.PI * .25) ) );
            v.x = Math.round( v.x );
            v.y = Math.round( v.y );
            v.z = Math.round( v.z );
            v.setLength( 0.5 );

            var tryPos = new THREE.Vector3();
            if ( which == "sub" ) {
                tryPos.subVectors( player.pos, v );
            } else {
                if ( which == "add" ) {
                    tryPos.addVectors( player.pos, v );
                }
            }

            for ( var i = 1; i < cubes.length; i++ ) {
                if ( cubes[ i ].box.containsPoint( tryPos ) ) {
                    console.log("collide with " ,cubes[i].cubetype);
                    return;
                }
            }

            v.setLength( 0.1 );


            if ( which == "sub" ) {
                world.position.sub( v );
            } else {
                if ( which == "add" ) {
                    world.position.add( v );
                }
            }

            console.log(world.position);

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
        }
    };


    /***************************************************************
     * Depressed world
     */

    function fixDegrees ( deg ) {
        if ( deg == -180 ) {
            return 180;
        }

        if ( deg == -90 ) {
            return 270;
        }

        if ( deg == -0 ) {
            return 0;
        }

        return deg;

    }

    function gaze(){
        if (worldIsRotating || worldIsMoving)
            return;

        var camera = ThreeDeeWorld.getCamera();
        var world = ThreeDeeWorld.getWorld();

        rayVector.x = .125;
        rayVector.y = .25;
        rayCaster.setFromCamera( rayVector, camera );

        var allObjects = floorpads.children.concat(world.children);
        var intersects = rayCaster.intersectObjects( allObjects );
        var i;

        for ( i = 0; i < floorpads.children.length; i++){
            floorpads.children[i].material.color.set(0xff0000);
        }



        if (intersects.length > 0 && intersects[0].object.name == "pad"){

            intersects[0].object.name == "pad";

            intersects[0].object.material.color.set(0x00ff00);


            if (hoveringId == intersects[0].object.id) {
                if (Date.now() - hoveringTimer >= hoverDelay && Date.now() > hoverCooldownTimer + hoverCooldown){
                    intersects[0].object.material.color.set(0x0000ff);
                    hoveringTimer = Date.now();

                    var moveMe = new THREE.Vector3(intersects[0].object.userData[0],intersects[0].object.userData[1],intersects[0].object.userData[2]);

                    if (worldDegrees[0] == 0 && worldDegrees[2] == 90){
                        var tmp = moveMe.x;
                        moveMe.x = moveMe.y;
                        moveMe.y = -tmp;
                    }
                    if (worldDegrees[0] == 0 && worldDegrees[2] == 180) {
                        moveMe.x = -moveMe.x
                    }
                    if (worldDegrees[0] == 0 && worldDegrees[2] == 270){
                        var tmp = moveMe.x;
                        moveMe.x = moveMe.y;
                        moveMe.y = tmp;
                    }
                    if (worldDegrees[0] == 90 && worldDegrees[2] == 0) {
                        var tmp = moveMe.x;
                        moveMe.y = moveMe.z;
                        moveMe.z = 0;
                    }
                    if (worldDegrees[0] == 90 && worldDegrees[2] == 90) {
                        var tmp = moveMe.x;
                        moveMe.x = moveMe.z;
                        moveMe.y = -tmp;
                        moveMe.z = 0;
                    }
                    if (worldDegrees[0] == 90 && worldDegrees[2] == 180) {
                        moveMe.x = -moveMe.x;
                        moveMe.y = -moveMe.z;
                        moveMe.z = 0;
                    }
                    if (worldDegrees[0] == 90 && worldDegrees[2] == 270) {
                        var tmp = moveMe.x
                        moveMe.x = -moveMe.z;
                        moveMe.z = 0;
                        moveMe.y = tmp;
                    }
                    if (worldDegrees[0] == 180 && worldDegrees[2] == 0) {
                        moveMe.z = -moveMe.z;
                    }
                    if (worldDegrees[0] == 180 && worldDegrees[2] == 90) {
                        moveMe.z = -moveMe.z;
                        moveMe.y = -moveMe.x;
                        moveMe.x = 0;
                    }
                    if (worldDegrees[0] == 180 && worldDegrees[2] == 180) {
                        moveMe.z = -moveMe.z;
                        moveMe.x = -moveMe.x;
                    }
                    if (worldDegrees[0] == 180 && worldDegrees[2] == 270) {
                        moveMe.z = -moveMe.z;
                        moveMe.y = moveMe.x;
                        moveMe.x = 0;
                    }
                    if (worldDegrees[0] == 270 && worldDegrees[2] == 0){
                        moveMe.y = -moveMe.z;
                        moveMe.z = 0;
                    }
                    if (worldDegrees[0] == 270 && worldDegrees[2] == 90){
                        var tmp = moveMe.x;
                        moveMe.x = -moveMe.z;
                        moveMe.y = -tmp;
                        moveMe.z = 0;
                    }
                    if (worldDegrees[0] == 270 && worldDegrees[2] == 180){
                        moveMe.x = -moveMe.x;
                        moveMe.y = moveMe.z;
                        moveMe.z = 0;
                    }
                    if (worldDegrees[0] == 270 && worldDegrees[2] == 270){
                        var tmp = moveMe.x;
                        moveMe.x = moveMe.z;
                        moveMe.y = tmp;
                        moveMe.z = 0;
                    }

                    console.log(moveMe);

                    worldMoveTarget.x = world.position.x - moveMe.x;
                    worldMoveTarget.y = world.position.y - moveMe.y;
                    worldMoveTarget.z = world.position.z - moveMe.z;
                    worldIsMoving = true;
                    hoverCooldownTimer = Date.now();
                }

            } else {
                hoveringId = intersects[0].object.id;
                hoveringTimer = Date.now();
            }

        }

    }

    function moveWorld() {
        if (worldIsMoving) {

            var cubes = ThreeDeeWorld.getCubes();
            var world = ThreeDeeWorld.getWorld();

            var invertedMoveTarget = new THREE.Vector3();
            invertedMoveTarget.subVectors(new THREE.Vector3(0,0,0),worldMoveTarget);

            for (var i = 1; i < cubes.length; i++){
                if (cubes[i].box.containsPoint(invertedMoveTarget)) {
                    console.log("collide");
                    worldIsMoving = false;
                    return;
                }
            }

            var delta = new THREE.Vector3();
            delta.subVectors(worldMoveTarget, world.position);

            if (delta.length() < worldMoveSpeed) {
                world.position.set(worldMoveTarget.x, worldMoveTarget.y, worldMoveTarget.z);
                worldIsMoving = false;
                hoverCooldownTimer = Date.now();

            } else {
                delta.setLength(worldMoveSpeed);
                world.position.add(delta);
            }
        }
    }

    function rotateWorld () {

        var world = ThreeDeeWorld.getWorld();

        if ( worldIsRotating ) {

            var delta = new THREE.Vector3();
            delta.subVectors(worldRotationTarget,worldRotationCurrent);
            if (delta.length() < worldRotationSpeed){
                worldRotationCurrent = worldRotationTarget;
                worldIsRotating = false;
                pivot.rotation.x = worldRotationCurrent.x;
                pivot.rotation.y = worldRotationCurrent.y;
                pivot.rotation.z = worldRotationCurrent.z;

                worldDegrees = [fixDegrees((Math.round((world.getWorldRotation().x * 180 / Math.PI)/10)*10)),
                    fixDegrees((Math.round((world.getWorldRotation().y * 180 / Math.PI)/10)*10)),
                    fixDegrees((Math.round((world.getWorldRotation().z * 180 / Math.PI)/10)*10))];

                console.log(worldDegrees);
                world.updateMatrixWorld();

                updateHitBoxes();
            } else {
                delta.setLength(worldRotationSpeed);
                worldRotationCurrent.add(delta);
                pivot.rotation.x = worldRotationCurrent.x;
                pivot.rotation.y = worldRotationCurrent.y;
                pivot.rotation.z = worldRotationCurrent.z;
            }
        }

    }

    function updateHitBoxes () {

        var cubes = ThreeDeeWorld.getCubes();

        for ( var i = 0; i < cubes.length; i++ ) {
            cubes[ i ].box = new THREE.Box3().setFromObject( cubes[ i ].mesh );
        }
    }

    function worldEvents ( which ) {

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


            worldIsRotating = true;
            updateHitBoxes();
        }
    }


    /***************************************************************
     * DepressedGame
     */

    var DepressedGame = {

        rotationKeyCodes: {
            'rotate-h': 72,
            'rotate-k': 75,
            'rotate-u': 85,
            'rotate-j': 74
        },

        setup: function ( socketConnection ) {

            socket = socketConnection;

            socket.on('grid', DepressedGame.handleGrid );

            socket.on('rotate-h', DepressedGame.handleRotation );
            socket.on('rotate-k', DepressedGame.handleRotation );
            socket.on('rotate-u', DepressedGame.handleRotation );
            socket.on('rotate-j', DepressedGame.handleRotation );
        },

        bindUserEvents: function () {

            document.addEventListener('keydown', function ( e ) {
                switch ( e.keyCode ) {
                    case 33:
                    case 34:
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

        createFloorPads: function () {

            var world = ThreeDeeWorld.getWorld();
            var scene = ThreeDeeWorld.getScene();

            for (var i = 0; i< 7; i++){
                  if (i != 3){
                      var plane = new THREE.PlaneGeometry( 1.8,1.8 );
                      var material = new THREE.MeshBasicMaterial( { color: 0xff0000, transparent: true } );
                      var pad = new THREE.Mesh( plane, material );
                      pad.name = "pad";
                      pad.position.x = 0;
                      pad.position.y = -0.95;
                      pad.position.z = -6 + (i*2);
                      pad.rotation.x = -Math.PI*0.5;
                      pad.userData = [0,0,-6 + (i*2)];
                      floorpads.add(pad);
                  }
              }
              for (var i = 0; i< 7; i++){
                  if (i != 3){
                      var plane = new THREE.PlaneGeometry(1.8,1.8 );
                      var material = new THREE.MeshBasicMaterial( { color: 0xff0000, transparent: true } );
                      var pad = new THREE.Mesh( plane, material );
                      pad.name = "pad";
                      pad.position.x = -6 + (i*2);
                      pad.position.y = -0.95;
                      pad.position.z = 0;
                      pad.rotation.x = -Math.PI*0.5;
                      pad.userData = [-6 + (i*2),0,0];
                      floorpads.add(pad);
                  }
              }

              var geometry = new THREE.BoxGeometry(1, 1, 1);
              material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
              var cube = new THREE.Mesh(geometry, material);
              cube.position.x = 2;
              cube.position.y = 2;
              cube.position.z = 2;
              world.add(cube);
              pivot.add(world);
              scene.add(pivot);
              scene.add(floorpads);

        },

        handleGrid: function ( gridData ) {
            console.log( 'grid received', gridData );
        },

        handleRotation: function ( rotation ) {

            console.log('rotation received', rotation, DepressedGame.rotationKeyCodes[ rotation ] );

            worldEvents.call( worldEvents, DepressedGame.rotationKeyCodes[ rotation ] );
        },

        start: function () {

            // create the 3D world

            console.log('we can start creating the Depressed game!');

            ThreeDeeWorld.createGameWorld();
            DepressedGame.createFloorPads();

            DepressedGame.bindUserEvents();

            DepressedGame.render();
        },


        render: function () {

            requestAnimationFrame( DepressedGame.render );

            player.move();

            rotateWorld();
            moveWorld();

            gaze();


            ThreeDeeWorld.render();
        }
    };

    window.DepressedGame = DepressedGame;

})( window.ThreeDeeWorld );