var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
var light = new THREE.HemisphereLight(0xffffff,0,0.6);
var ism = false;

var validPositions = [];
var currentPosition = 0;
var positionInterval = 5;

var rayCaster = new THREE.Raycaster();
var rayVector = new THREE.Vector3();

var debug = document.createElement('div');
debug.style.position = 'absolute';
debug.style.zIndex = 999;

var map = [];

function initSocket() {
    var dl = document.location;
    var socketServer = dl.origin;

    var socket = io( socketServer );

    // receiving

    socket.on('player-coordinates', function ( eventData ) {
        console.log('mainGame-without-stereo -> ', eventData.x, eventData.z);
        marker.mesh.position.copy(eventData);
    });

}

initSocket();

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
var worldIsRotating = false;
var worldRotationCurrent = new THREE.Vector3( 0, 0, 0 );
var worldRotationTarget = new THREE.Vector3( 0, 0, 0 );
var world = new THREE.Object3D();
var hypercube = new THREE.Object3D();
var markerOlder = new THREE.Object3D();
//markerOlder.position.set(10,10,10);

var geometry = new THREE.CubeGeometry(2,2,2);

var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
//mesh.position.x = -1;
//mesh.position.y = -1;
//mesh.position.z = -1;
mesh.name = "marker";

var marker = {
    mesh: mesh,
    //box: new THREE.Sphere(new THREE.Vector3(0,0,0), 2),
    //cubetype: map[z][x][y]
};


camera.position.z = 50;

hypercube.position.x = -10;
hypercube.position.y = -10;
hypercube.position.z = -10;

var cubes = [];

var player = {
    pos : new THREE.Vector3( 2, 2, 2 ),
    rot : new THREE.Vector3( 0, 0, 0 ),
    rotTarget: new THREE.Vector3( 0, 0, 0 ),
    keys : [    {keyCode: 37, isDown: false, action : function(){player.rot.y += 0.1}},
                {keyCode: 38, isDown: false, action : function(){player.tryMovement("sub")}},
                {keyCode: 39, isDown: false, action : function(){player.rot.y -= 0.1}},
                {keyCode: 40, isDown: false, action : function(){player.tryMovement("add")}}
            ],
    tryMovement : function(which){
        var v = new THREE.Vector3(1,0,1);
        v.applyQuaternion(new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3(0,1,0),player.rot.y - (Math.PI *.25)));
        v.setLength(0.5);

        var tryPos = new THREE.Vector3();
        if (which == "sub"){
            tryPos.subVectors(player.pos,v);
        } else if (which == "add") {
            tryPos.addVectors(player.pos,v);
        }
        for (var i = 1; i < cubes.length; i++){

            if (cubes[i].box.containsPoint(tryPos)) {

                console.log('collision on box ', i,  player.pos);
                return;
            }
        }

        v.setLength(0.1);

        if (which == "sub"){
            player.pos.sub(v);
        } else if (which == "add") {
            player.pos.add(v);
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

        //camera.position.x = player.pos.x;
        //camera.position.y = player.pos.y;
        //camera.position.z = player.pos.z + 50;

        world.rotation.x = player.rot.x;
        world.rotation.y = player.rot.y;
        world.rotation.z = player.rot.z;

        light.position.set(player.pos.x,player.pos.y,player.pos.z);

        if (player.rot.y >= 2* Math.PI || player.rot.y <= -(2* Math.PI)) player.rot.y = 0;

        debug.innerHTML = "x: " + player.pos.x + " y: " + player.pos.y + " z: " + player.pos.z;


        positionInterval++;
        positionInterval %= 15;

        if (positionInterval == 0) {
            currentPosition++;
            if (currentPosition >= validPositions.length) {
                currentPosition = 0;
            }

            //marker.mesh.position.copy(validPositions[currentPosition]);
        }

    }
};

function setup() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );



    var texture1 = THREE.ImageUtils.loadTexture( "floor_tile.jpg" );

    //var material = new THREE.MeshBasicMaterial( { map: texture1, transparent: true } );
    var material = new THREE.MeshBasicMaterial({color: 0xFF9933, opacity: 0.2, transparent: true});
    //material.color = 0xff9999;
    //material.opacity = 0.5;

    for (var z = 0; z < map.length; z++) {
        for (var x = 0; x < map[z].length; x++) {
            for (var y = 0; y < map[z][x].length; y++) {


                if (map[z][x][y] != 0) {

                    var geometry = new THREE.BoxGeometry(2, 2, 2);

                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.position.x = x * 2;
                    mesh.position.y = z * 2;
                    mesh.position.z = y * 2;
                    mesh.name = "cube";

                    var cube = {
                        mesh: mesh,
                        box: new THREE.Box3().setFromObject(mesh),
                        cubetype: map[z][x][y]
                    }

                    cubes.push(cube);
                    hypercube.add(mesh);
                }

                else {
                    var validPos = new THREE.Vector3(x * 2, y * 2, z * 2);
                    validPositions.push(validPos);
                }

            }
        }
    }


    var ggeometry = new THREE.PlaneGeometry( 1000,1000 );
    var texture = THREE.ImageUtils.loadTexture( "checkerboard.png" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set( 100, 100 );
    var groundmaterial = new THREE.MeshBasicMaterial( { map: texture } );
    var ground = new THREE.Mesh( ggeometry, groundmaterial );
    ground.rotation.x = -Math.PI*0.5;
    ground.position.y = -1;

    //world.add(ground);
    markerOlder.add(marker.mesh);
    hypercube.add(markerOlder);
    world.add(hypercube);
    scene.add(world);
    scene.add(light);

    render();
}

function worldEvents(which) {
    if (!worldIsRotating) {
        console.log(which);

        worldRotationTarget = new THREE.Vector3(worldRotationCurrent.x, worldRotationCurrent.y, worldRotationCurrent.z);

        switch (which) {
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
        offset.subVectors(new THREE.Vector3(0, 0, 0), player.pos);
        for (var i = 0; i < world.children.length; i++) {
            world.children[i].position.add(offset);
        }
        player.pos = new THREE.Vector3(0, 0, 0);
        //worldIsRotating = true;
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

        world.rotation.x = worldRotationCurrent.x;
        world.rotation.y = worldRotationCurrent.y;
        world.rotation.z = worldRotationCurrent.z;

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
    //
    //rayVector.x = 2 * (e.clientX / window.innerWidth) - 1;
    //rayVector.y = 1 - 2 * ( e.clientY / window.innerHeight );
    //rayCaster.setFromCamera( rayVector, camera );
    //var intersects = rayCaster.intersectObjects( scene.children );
    //for ( var i = 0; i < intersects.length; i++ ) {
    //
    //    if(intersects[ i].object.name == "cube"){
    //        intersects[ i].object.material.color.set(0xff0000);
    //    };
    //
    //}
}

//controls = new DeviceOrientationController( camera, renderer.domElement );
//controls.connect();

setup();