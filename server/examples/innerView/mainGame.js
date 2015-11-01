var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
var light = new THREE.HemisphereLight(0xffffff,0,0.6);
var ism = false;

var rayCaster = new THREE.Raycaster();
var rayVector = new THREE.Vector3();

var debug = document.createElement('div');
debug.style.position = 'absolute';
debug.style.zIndex = 999;

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

var worldRotationSpeed = 0.03;
var worldMoveSpeed = 0.2;
var worldIsRotating = false;
var worldRotationCurrent = new THREE.Vector3( 0, 0, 0 );
var worldRotationTarget = new THREE.Vector3( 0, 0, 0 );
var worldMoveTarget = new THREE.Vector3( 0, 0, 0 );
var worldIsMoving = false;
var world = new THREE.Object3D();
var worldDegrees = [];

var floorpads = new THREE.Object3D();
var pivot = new THREE.Object3D();
var offsetVector = new THREE.Vector3(0,1,0)

var hoveringId = 0;
var hoveringTimer = 0;
var hoverDelay = 1000;
var hoverCooldownTimer = 0;
var hoverCooldown = 1000;




var cubes = [];

var player = {
    pos : new THREE.Vector3( 0, 0, 0 ),
    rot : new THREE.Vector3( 0, Math.PI, 0 ),
    rotTarget: new THREE.Vector3( 0, 0, 0 ),
    keys : [    {keyCode: 37, isDown: false, action : function(){player.rot.y += 0.1}},
                {keyCode: 38, isDown: false, action : function(){player.tryMovement("add")}},
                {keyCode: 39, isDown: false, action : function(){player.rot.y -= 0.1}},
                {keyCode: 40, isDown: false, action : function(){player.tryMovement("sub")}}
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
                console.log("collide");
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

        camera.rotation.x = player.rot.x;
        camera.rotation.y = player.rot.y;
        camera.rotation.z = player.rot.z;

        light.position.set(player.pos.x,player.pos.y,player.pos.z);

        if (player.rot.y >= 2* Math.PI || player.rot.y <= -(2* Math.PI)) player.rot.y = 0;

    }
};

function setup() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var texture1 = THREE.ImageUtils.loadTexture( "textures/patterns/floor_tile.jpg" );

    var material = new THREE.MeshBasicMaterial( { map: texture1, transparent: true } );

    for (var z = 0; z < map.length; z++) {
        for (var x = 0; x < map[z].length; x++) {
            for (var y = 0; y < map[z][x].length; y++) {


                if (map[z][x][y] != 0) {

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
            worldIsMoving = true;

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
}


function render () {
    requestAnimationFrame( render );

    player.move();

    rotateWorld();
    moveWorld();
    //cube.rotation.x += 0.1;
    //cube.rotation.y += 0.1;
    //controls.update();
    renderer.render(scene, camera);

};

document.onkeydown = function(e){
    switch(e.keyCode) {
        case 37:
        case 38:
        case 39:
        case 40:
            player.updateVel({key: e.keyCode, isPressed: true});
            break;
        default:
            worldEvents(e.keyCode);
            break;
    }
}
document.onkeyup = function(e){
    player.updateVel({key: e.keyCode, isPressed: false});
}

document.onmousemove = function(e){
    if (worldIsRotating)
        return;



    rayVector.x = 2 * (e.clientX / window.innerWidth) - 1;
    rayVector.y = 1 - 2 * ( e.clientY / window.innerHeight );
    rayCaster.setFromCamera( rayVector, camera );

    var allObjects = floorpads.children.concat(world.children);
    var intersects = rayCaster.intersectObjects( allObjects );
    var i;

    for ( i = 0; i < floorpads.children.length; i++){
        floorpads.children[i].material.opacity = 0;
    }



    if (intersects.length > 0 && intersects[0].object.name == "pad"){

        intersects[0].object.name == "pad";

        intersects[0].object.material.opacity = 0.5;


        if (hoveringId == intersects[0].object.id) {
            if (Date.now() - hoveringTimer >= hoverDelay && Date.now() > hoverCooldownTimer + hoverCooldown){
                intersects[0].object.material.opacity = 0;
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

//controls = new DeviceOrientationController( camera, renderer.domElement );
//controls.connect();

setup();