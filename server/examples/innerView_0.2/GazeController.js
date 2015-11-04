var GazeController = function() {
    this.controllerPads = new THREE.Object3D();
    this.rayCaster = new THREE.Raycaster();
    this.rayVector = new THREE.Vector3();

    this.init();
};

GazeController.prototype.init = function() {
    var plane = new THREE.PlaneGeometry( 1.8,1.8 );
    var material = new THREE.MeshBasicMaterial( { color: 0xff0000, transparent: true } );
    var i, pad;

    for (i = 0; i< 7; i++){
        pad = new THREE.Mesh( plane, material );
        pad.name = "pad";
        pad.position.set(0,-0.95,-6 + (i*2));
        pad.rotation.x = -Math.PI*0.5;
        pad.userData = [0,0,-6 + (i*2)];
        this.controllerPads.add(pad);
        pad = new THREE.Mesh( plane, material );
        pad.position.set(-6 + (i*2),-0.95,0);
        pad.rotation.x = -Math.PI*0.5;
        pad.userData = [-6 + (i*2),0,0];
        this.controllerPads.add(pad);
    }

    this.rayVector.x = .125;
    this.rayVector.y = .25;
};

GazeController.prototype.getGaze = function(camera,worldObjects) {
    this.rayCaster.setFromCamera( this.rayVector, camera );

    var allObjects = this.controllerPads.children.concat(worldObjects);
    var intersects = rayCaster.intersectObjects( allObjects );

    var i, l = this.controllerPads.children.length;

    for ( i = 0; i < l; i++){
        this.controllerPads.children[i].material.color.set(0xff0000);
    }

    if (intersects.length > 0 && intersects[0].object.name == "pad"){
        intersects[0].object.material.color.set(0x00ff00);
    }

};