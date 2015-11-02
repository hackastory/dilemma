var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
var light = new THREE.HemisphereLight(0xffffff,0,0.6);

var clock = new THREE.Clock();
var controls;
var effect = new THREE.StereoEffect(renderer);

var ism = false;

var rayCaster = new THREE.Raycaster();
var rayVector = new THREE.Vector3();


var socket = io( document.location.origin );

var debug = document.createElement('div');
debug.style.position = 'absolute';
debug.style.zIndex = 999;



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

var worldRotationSpeed = 0.03;
var worldMoveSpeed = 0.2;
var worldIsRotating = false;
var worldRotationCurrent = new THREE.Vector3( 0, 0, 0 );
var worldRotationTarget = new THREE.Vector3( 0, 0, 0 );
var worldMoveTarget = new THREE.Vector3( 0, 0, 0 );
var worldIsMoving = false;
var world = new THREE.Object3D();
world.position.x = 2;
world.position.y = 2;
world.position.z = 2;
var worldDegrees = [];

var endBox;
var endMesh;

var floorpads = new THREE.Object3D();
var pivot = new THREE.Object3D();
var offsetVector = new THREE.Vector3(0,1,0);

var hoveringId = 0;
var hoveringTimer = 0;
var hoverDelay = 1000;
var hoverCooldownTimer = 0;
var hoverCooldown = 1000;

var hasWon = false;

var lastPlayerPosition = {x:0, y:0, z:0 };
var lastPivot = null;
var lastWorldPosition = null;


var cubes = [];

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
    tryMovement : function(which){
        var v = new THREE.Vector3(1,0,1);
        v.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(offsetVector ,player.rot.y - (Math.PI *.25)));
        v.x = Math.round(v.x);
        v.y = Math.round(v.y);
        v.z = Math.round(v.z);
        v.setLength(0.5);

        var tryPos = new THREE.Vector3();
        if (which == "sub"){
            tryPos.subVectors(player.pos,v);
        } else if (which == "add") {
            tryPos.addVectors(player.pos,v);
        }

        for (var i = 1; i < cubes.length; i++){
            if (cubes[i].box.containsPoint(tryPos)) {
                console.log("collide with " ,cubes[i].cubetype);
                return;
            }
        }



        v.setLength(0.1);



        if (which == "sub"){
            world.position.sub(v);
        } else if (which == "add") {
            world.position.add(v);
        }



        //return v;
    },
    updateVel : function(input) {
        for (var i = 0; i < player.keys.length; i++){
            if (player.keys[i].keyCode == input.key){
                player.keys[i].isDown = input.isPressed;
            }
        }
    },
    move : function() {
        if (!worldIsRotating) {
            for (var i = 0; i < player.keys.length; i++) {
                if (player.keys[i].isDown) {
                    player.keys[i].action();
                }
            }
        }

        camera.position.x = player.pos.x;
        camera.position.y = player.pos.y;
        camera.position.z = player.pos.z;

        if ( ! controls ) {
            // we're dealing with desktop here, no mobile orientation controls
            // so now we may manually adjust the player's rotation
            camera.rotation.x = player.rot.x;
            camera.rotation.y = player.rot.y;
            camera.rotation.z = player.rot.z;
        }

        light.position.set(player.pos.x,player.pos.y,player.pos.z);

        if (player.rot.y >= 2* Math.PI || player.rot.y <= -(2* Math.PI)) player.rot.y = 0;



        var newPosition = { x: player.pos.x, y: player.pos.y, z: player.pos.z},
            newPivot = JSON.stringify({ x: pivot.rotation.x, y: pivot.rotation.y, z: pivot.rotation.z}),
            newWorldPos = JSON.stringify({ x: world.position.x, y: world.position.y, z: world.position.z});

        //if ( JSON.stringify( newPosition ) !== JSON.stringify( lastPlayerPosition ) ) {
        //
        //    lastPlayerPosition.x = newPosition.x;
        //    lastPlayerPosition.y = newPosition.y;
        //    lastPlayerPosition.z = newPosition.z;
        //
        //    socket.emit( 'player-coordinates', lastPlayerPosition );
        //}

        if (newWorldPos !== lastWorldPosition) {
            //console.log('mainGame -> newPivot', newPivot);
            //console.log('mainGame -> worldpos', newWorldPos, lastWorldPosition);

            socket.emit( 'world-position', newWorldPos);
            lastWorldPosition = newWorldPos;
        }
        if (newPivot !== lastPivot) {
            console.log(pivot);
            console.log('mainGame -> pivot', newPivot, lastPivot);
            socket.emit('pivot', newPivot);
            lastPivot = newPivot;
        }
    }
};

function setup() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    effect.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var outerWallTexture = THREE.ImageUtils.loadTexture( "textures/patterns/floor_tile.jpg" );
    outerWallTexture.wrapS = outerWallTexture.wrapT = THREE.RepeatWrapping;
    outerWallTexture.repeat.set(12.5,12.5)

    var outerWallMaterial = new THREE.MeshBasicMaterial( { map: outerWallTexture} );
    var oGeometry = new THREE.BoxGeometry(2, 25, 25);
    var wall = new THREE.Mesh(oGeometry, outerWallMaterial);
    wall.position.x = -4;
    wall.position.y = 7;
    wall.position.z = 9;
    var cube = {
        mesh: wall,
        box: new THREE.Box3().setFromObject(wall),
        cubetype: 3
    }
    cubes.push(cube);
    world.add(wall);

    wall = new THREE.Mesh(oGeometry, outerWallMaterial);
    wall.position.x = 18;
    wall.position.y = 7;
    wall.position.z = 9;
    var cube = {
        mesh: wall,
        box: new THREE.Box3().setFromObject(wall),
        cubetype: 3
    }
    cubes.push(cube);
    world.add(wall);

    oGeometry = new THREE.BoxGeometry(25, 25, 2);
    wall = new THREE.Mesh(oGeometry, outerWallMaterial);
    wall.position.x = 9;
    wall.position.y = 7;
    wall.position.z = -4;
    var cube = {
        mesh: wall,
        box: new THREE.Box3().setFromObject(wall),
        cubetype: 3
    }
    cubes.push(cube);
    world.add(wall);

    wall = new THREE.Mesh(oGeometry, outerWallMaterial);
    wall.position.x = 9;
    wall.position.y = 7;
    wall.position.z = 18;
    var cube = {
        mesh: wall,
        box: new THREE.Box3().setFromObject(wall),
        cubetype: 3
    }
    cubes.push(cube);
    world.add(wall);

    oGeometry = new THREE.BoxGeometry(25, 2, 25);
    wall = new THREE.Mesh(oGeometry, outerWallMaterial);
    wall.position.x = 9;
    wall.position.y = -4;
    wall.position.z = 9;
    var cube = {
        mesh: wall,
        box: new THREE.Box3().setFromObject(wall),
        cubetype: 3
    }
    cubes.push(cube);
    world.add(wall);

    wall = new THREE.Mesh(oGeometry, outerWallMaterial);
    wall.position.x = 9;
    wall.position.y = 16;
    wall.position.z = 9;
    var cube = {
        mesh: wall,
        box: new THREE.Box3().setFromObject(wall),
        cubetype: 3
    }
    cubes.push(cube);
    world.add(wall);

    var texture1 = THREE.ImageUtils.loadTexture( "textures/patterns/floor_tile.jpg" );

    var material = new THREE.MeshBasicMaterial( { map: texture1} );

    for (var z = 0; z < map.length; z++) {
        for (var x = 0; x < map[z].length; x++) {
            for (var y = 0; y < map[z][x].length; y++) {


                if (map[z][x][y] == 1) {

                    var geometry = new THREE.BoxGeometry(2, 2, 2);

                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.position.x = (x * 2)-2;
                    mesh.position.y = (z * 2)-2;
                    mesh.position.z = (y * 2)-2;
                    mesh.name = "cube";

                    var cube = {
                        mesh: mesh,
                        box: new THREE.Box3().setFromObject(mesh),
                        cubetype: map[z][x][y]
                    }

                    cubes.push(cube);
                    world.add(mesh);
                }
                if (map[z][x][y] == 4) {

                    var texture2 = THREE.ImageUtils.loadTexture( "textures/patterns/checkerboard.png" );

                    var material2 = new THREE.MeshBasicMaterial( { map: texture2 } );
                    var geometry = new THREE.BoxGeometry(1, 1, 1);
                    endMesh = new THREE.Mesh(geometry, material2);
                    endMesh.position.x = (x * 2)-2;
                    endMesh.position.y = (z * 2)-2;
                    endMesh.position.z = (y * 2)-2;

                    world.add(endMesh);

                    endBox = new THREE.Box3().setFromObject(mesh);
                }

            }
        }
    }

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
    scene.add(light);
    scene.add(floorpads);


    window.addEventListener('resize', handleResize );
    window.addEventListener( 'deviceorientation', setOrientationControls, true );

    socket.on('rotate-h', worldEvents.bind( worldEvents, 72 ) );
    socket.on('rotate-k', worldEvents.bind( worldEvents, 75 ) );
    socket.on('rotate-u', worldEvents.bind( worldEvents, 85 ) );
    socket.on('rotate-j', worldEvents.bind( worldEvents, 74 ) );

    render();
}

function worldEvents(which) {

    if (!worldIsRotating) {

        worldRotationTarget = new THREE.Vector3(worldRotationCurrent.x, worldRotationCurrent.y, worldRotationCurrent.z);

        switch(which){
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
        //updateHitBoxes();
    }
}

function rotateWorld() {
    if (worldIsRotating) {

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

function fixDegrees(deg) {
    if (deg == -180)
        return 180;

    if (deg == -90)
        return 270;

    if (deg == -0)
        return 0;

    return deg;

}

function moveWorld() {
    if (worldIsMoving) {

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
            world.position.set(worldMoveTarget.x, worldMoveTarget.y, worldMoveTarget.z)
            worldIsMoving = false;
            hoverCooldownTimer = Date.now();

        } else {
            delta.setLength(worldMoveSpeed);
            world.position.add(delta);
        }
    }
}

function updateHitBoxes(){
    for (var i = 0; i < cubes.length; i++) {
        cubes[i].box = new THREE.Box3().setFromObject(cubes[i].mesh);
    }
    endBox = new THREE.Box3().setFromObject(endMeshmesh);
}


function render () {
    requestAnimationFrame( render );

    player.move();

    rotateWorld();
    moveWorld();

    gaze();

    //controls.update();
    renderer.render(scene, camera);
    effect.render( scene, camera );

    if ( controls ) {
        controls.update( clock.getDelta() );
    }

}

function handleResize () {

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( windowWidth, windowHeight );
    effect.setSize( windowWidth, windowHeight );
}

function setOrientationControls ( e ) {

    if ( ! e.alpha ) {
        return;
    }

    controls = new THREE.DeviceOrientationControls( camera );
    controls.connect();
    controls.update();

    window.removeEventListener( 'deviceorientation', setOrientationControls, true );
}

document.addEventListener('keydown', function(e){
    switch(e.keyCode) {
        case 37:
        case 38:
        case 39:
        case 40:
        case 33:
        case 34:
            player.updateVel({key: e.keyCode, isPressed: true});
            break;
        default:
            worldEvents(e.keyCode);
            break;
    }
});
document.addEventListener('keyup', function(e){
    player.updateVel({key: e.keyCode, isPressed: false});
});

function gaze(){
    if (worldIsRotating || worldIsMoving)
        return;



    //rayVector.x = 2 * (window.innerWidth *.25) - 1;
    //rayVector.y = 1 - 2 * ( window.innerHeight *.5);
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

};

setup();