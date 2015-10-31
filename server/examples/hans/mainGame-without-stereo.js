var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

var ism = false;

var rayCaster = new THREE.Raycaster();
var rayVector = new THREE.Vector3();

var map = [ [1,1,1,1,0,1,0,1,0,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,0,1,0,1,0,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,0,1,0,1,0,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,0,1,0,1,0,1],
            [1,1,1,1,0,1,1,1,0,1],
            [1,1,1,1,0,1,0,1,1,1],
            [1,1,1,1,1,1,0,1,0,1]
];

var cubes = [];

var player = {
    pos : new THREE.Vector3( 0, 0, -5 ),
    rot : new THREE.Vector3( 0, 0, 0 ),
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
        for (var i = 0; i < cubes.length; i++){

            if (cubes[i].box.containsPoint(tryPos)) {
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
        for (var i = 0; i < player.keys.length; i++) {
            if(player.keys[i].isDown) {
                player.keys[i].action();
            }
        }

        camera.position.x = player.pos.x;
        camera.position.y = player.pos.y;
        camera.position.z = player.pos.z;

        camera.rotation.x = player.rot.x;
        camera.rotation.y = player.rot.y;
        camera.rotation.z = player.rot.z;

        if (player.rot.y >= 2* Math.PI || player.rot.y <= -(2* Math.PI)) player.rot.y = 0;

    }
};

function setup() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


    var texture1 = THREE.ImageUtils.loadTexture( "checkerboard1.jpg" );

    var material = new THREE.MeshBasicMaterial( { map: texture1 } );

    for (var x = 0; x < map.length; x++){
        for (var y = 0; y < map[x].length; y++){


                if (map[x][y] != 0) {

                    var geometry = new THREE.BoxGeometry(2, 2, 2);

                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.position.x = x * 2;
                    mesh.position.z = y * 2;
                    mesh.name = "cube";

                    var cube = {
                        mesh: mesh,
                        box: new THREE.Box3().setFromObject(mesh),
                        cubetype : map[x][y]
                    }

                    cubes.push(cube);
                    scene.add(mesh);
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

    scene.add(ground);

    render();
}


function render () {
    requestAnimationFrame( render );

    player.move();

    //cube.rotation.x += 0.1;
    //cube.rotation.y += 0.1;
    //controls.update();
    renderer.render(scene, camera);

};

document.onkeydown = function(e){
    player.updateVel({key: e.keyCode, isPressed: true});
}
document.onkeyup = function(e){
    player.updateVel({key: e.keyCode, isPressed: false});
}

document.onmousemove = function(e){

    rayVector.x = 2 * (e.clientX / window.innerWidth) - 1;
    rayVector.y = 1 - 2 * ( e.clientY / window.innerHeight );
    rayCaster.setFromCamera( rayVector, camera );
    var intersects = rayCaster.intersectObjects( scene.children );
    for ( var i = 0; i < intersects.length; i++ ) {

        if(intersects[ i].object.name == "cube"){
            intersects[ i].object.material.color.set(0xff0000);
        };

    }
}

//controls = new DeviceOrientationController( camera, renderer.domElement );
//controls.connect();

setup();