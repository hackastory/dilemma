var camera, scene, renderer;
var effect, controls;
var element, container;

var clock = new THREE.Clock();

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
var worldIsRotating = false;
var worldRotationCurrent = new THREE.Vector3( 0, 0, 0 );
var worldRotationTarget = new THREE.Vector3( 0, 0, 0 );
var world = new THREE.Object3D();
var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
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

        camera.position.x = player.pos.x;
        camera.position.y = player.pos.y;
        camera.position.z = player.pos.z;

        camera.rotation.x = player.rot.x;
        camera.rotation.y = player.rot.y;
        camera.rotation.z = player.rot.z;

        light.position.set(player.pos.x,player.pos.y,player.pos.z);
//        light.castShadow = true;
		scene.add(light);
        if (player.rot.y >= 2* Math.PI || player.rot.y <= -(2* Math.PI)) player.rot.y = 0;

        //debug.innerHTML = "x: " + player.pos.x + " y: " + player.pos.y + " z: " + player.pos.z;

    }
};
function worldEvents(which) {
	console.log('Rotating world!');
    if (!worldIsRotating) {
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

init();
animate();

function init() {
	renderer = new THREE.WebGLRenderer();
	renderer.shadowMap.enabled = true;
	element = renderer.domElement;
	container = document.getElementById('game');
	container.appendChild(element);

	effect = new THREE.StereoEffect(renderer);

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(60, 1, 0.001, 700);
	camera.position.set(0, 10, 0);
	scene.add(camera);

	controls = new THREE.OrbitControls(camera, element);
	controls.rotateUp(Math.PI / 4);
	controls.target.set(
		camera.position.x + 0.5,
		camera.position.y - 1.5,
		camera.position.z 
	);
	controls.noZoom = true;
	controls.noPan = true;

	function setOrientationControls(e) {
		if (!e.alpha) {
			return;
		}

		controls = new THREE.DeviceOrientationControls(camera, true);
		controls.connect();
		controls.update();

		element.addEventListener('click', fullscreen, false);

		window.removeEventListener('deviceorientation', setOrientationControls, true);
	}
	window.addEventListener('deviceorientation', setOrientationControls, true);

	
	
	var texture1 = THREE.ImageUtils.loadTexture( "floor_tile.jpg" );

    var material = new THREE.MeshBasicMaterial( { map: texture1, transparent: true } );

    for (var z = 0; z < map.length; z++) {
	    
        for (var x = 0; x < map[z].length; x++) {
            for (var y = 0; y < map[z][x].length; y++) {
				console.log('drawing map');

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
                    world.add(mesh);
                    
					
                }

            }
        }
    }
	
	
	
	var texture = THREE.ImageUtils.loadTexture(
		'checkerboard.png'
	);
	
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat = new THREE.Vector2(50, 50);
	texture.anisotropy = renderer.getMaxAnisotropy();

	var material = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		specular: 0xffffff,
		shininess: 20,
		shading: THREE.FlatShading,
		map: texture
	});

	var geometry = new THREE.PlaneGeometry(1000, 1000);

	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = -Math.PI / 2;
	scene.add(mesh);
    scene.add(world);
	window.addEventListener('resize', resize, false);
	setTimeout(resize, 1);
	worldEvents();
}

function resize() {
	var width = container.offsetWidth;
	var height = container.offsetHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize(width, height);
	effect.setSize(width, height);
}

function update(dt) {
	resize();

	camera.updateProjectionMatrix();

	controls.update(dt);
}

function render(dt) {
	//player.move();
	rotateWorld();
	//player.updateVel({key: 40, isPressed: true});
	//player.move();
	effect.render(scene, camera);
}

function animate(t) {
	requestAnimationFrame(animate);

	update(clock.getDelta());
	render(clock.getDelta());
}


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


function fullscreen() {
	if (container.requestFullscreen) {
		container.requestFullscreen();
	} else if (container.msRequestFullscreen) {
		container.msRequestFullscreen();
	} else if (container.mozRequestFullScreen) {
		container.mozRequestFullScreen();
	} else if (container.webkitRequestFullscreen) {
		container.webkitRequestFullscreen();
	}
}