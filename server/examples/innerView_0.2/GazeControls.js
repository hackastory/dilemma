var GazeControls = function(scene) {
    this.ControlsPads = new THREE.Object3D();
    this.rayCaster = new THREE.Raycaster();
    this.rayVector = new THREE.Vector3();

    this.init(scene);
};

GazeControls.prototype.init = function(scene) {
    var plane = new THREE.PlaneGeometry( 1.8,1.8 );
    //var material = new THREE.MeshBasicMaterial( { color: 0xff0000, transparent: true } );
    var i, pad;

    for (i = 0; i < 7; i++){
        if (i===3)continue;
        var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        var plane = new THREE.PlaneGeometry( 1.8,1.8 );
        pad = new THREE.Mesh( plane, material );
        pad.name = "pad";
        pad.position.set(0,-0.95,-6 + (i*2));
        pad.rotation.x = -Math.PI*0.5;
        pad.userData = [0,0,-6 + (i*2)];
        this.ControlsPads.add(pad);
        material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        plane = new THREE.PlaneGeometry( 1.8,1.8 );
        pad = new THREE.Mesh( plane, material );
        pad.name = "pad";
        pad.position.set(-6 + (i*2),-0.95,0);
        pad.rotation.x = -Math.PI*0.5;
        pad.userData = [-6 + (i*2),0,0];
        this.ControlsPads.add(pad);
    }

    console.log(scene);
    scene.add(this.ControlsPads);

    this.rayVector.x = .100;
    this.rayVector.y = .1;
};

GazeControls.prototype.getGaze = function(camera,worldObjects) {
    this.rayCaster.setFromCamera( this.rayVector, camera );

    var allObjects = this.ControlsPads.children.concat(worldObjects);
    var intersects = this.rayCaster.intersectObjects( allObjects );

    var i, l = this.ControlsPads.children.length;

    for ( i = 0; i < l; i++){
        this.ControlsPads.children[i].material.color.set(0xff0000);
    }
    console.log("----");
    if (intersects.length > 0 && intersects[0].object.name === "pad"){
        console.log(intersects[0].object.name);
        intersects[0].object.material.color.set(0x00ff00);
    }

};