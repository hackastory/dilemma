var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
var effect = new THREE.StereoEffect( renderer );
var cube;

var player = {
    pos : new THREE.Vector3( 0, 0, 5 )
    //rot : new THREE.Vector3( 0, 0, 0 ),
    //keys : [    {keyCode: 37, isDown: false, action : function(){player.rot.y += 0.1}},
    //            {keyCode: 38, isDown: false, action : function(){player.pos.sub(player.getMovement())}},
    //            {keyCode: 39, isDown: false, action : function(){player.rot.y -= 0.1}},
    //            {keyCode: 40, isDown: false, action : function(){player.pos.add(player.getMovement())}}
    //        ],
    //getMovement : function(){
    //    var v = new THREE.Vector3(1,0,1);
    //    v.applyQuaternion(new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3(0,1,0),player.rot.y - (Math.PI *.25)));
    //    v.setLength(0.1);
    //    console.log(v);
    //    return v;
    //},
    //updateVel : function(input) {
    //    for (var i = 0; i < player.keys.length; i++){
    //        if (player.keys[i].keyCode == input.key){
    //            player.keys[i].isDown = input.isPressed;
    //        }
    //    }
    //},
    //move : function() {
    //    for (var i = 0; i < player.keys.length; i++) {
    //        if(player.keys[i].isDown) {
    //            player.keys[i].action();
    //        }
    //    }
    //
    //    camera.position.x = player.pos.x;
    //    camera.position.y = player.pos.y;
    //    camera.position.z = player.pos.z;
    //
    //    camera.rotation.x = player.rot.x;
    //    camera.rotation.y = player.rot.y;
    //    camera.rotation.z = player.rot.z;
    //
    //    if (player.rot.y >= 2* Math.PI || player.rot.y <= -(2* Math.PI)) player.rot.y = 0;
    //
    //}
};

function setup() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    cube = new THREE.Mesh( geometry, material );


    var ggeometry = new THREE.PlaneGeometry( 1000,1000 );
    var texture = THREE.ImageUtils.loadTexture( "checkerboard.png" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set( 100, 100 );
    var groundmaterial = new THREE.MeshBasicMaterial( { map: texture } );
    var ground = new THREE.Mesh( ggeometry, groundmaterial );
    ground.rotation.x = -Math.PI*0.5;
    ground.position.y = -1;

    scene.add( cube );
    scene.add(ground);


    effect.eyeSeparation = 10;
    effect.setSize(window.innerWidth, window.innerHeight);


    render();
}


function render () {
    requestAnimationFrame( render );

    //player.move();

    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;
    controls.update();
    effect.render(scene, camera);

};

//document.onkeydown = function(e){
//    player.updateVel({key: e.keyCode, isPressed: true});
//}
//document.onkeyup = function(e){
//    player.updateVel({key: e.keyCode, isPressed: false});
//}

controls = new DeviceOrientationController( camera, renderer.domElement );
controls.connect();

setup();