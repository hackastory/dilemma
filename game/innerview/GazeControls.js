var GazeControls = function(scene) {
    this.ControlsPads = new THREE.Object3D();
    this.rayCaster = new THREE.Raycaster();
    this.rayVector = new THREE.Vector3();

    this.lookingAt = {id: 0, timer: 0, delay: 1000, cooldown: 0};

    this.init(scene);
};

GazeControls.prototype.init = function(scene) {
    var plane = new THREE.PlaneGeometry( 1.8,1.8 );
    var i, pad, material;

    for (i = 0; i < 7; i++){
        if (i===3)continue;
        material = new THREE.MeshBasicMaterial({color: 0xff0000});
        pad = new THREE.Mesh( plane, material );
        pad.name = "pad";
        pad.position.set(0,-0.95,-6 + (i*2));
        pad.rotation.x = -Math.PI*0.5;
        pad.userData = [0,0,-6 + (i*2)];
        this.ControlsPads.add(pad);
        material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        pad = new THREE.Mesh( plane, material );
        pad.name = "pad";
        pad.position.set(-6 + (i*2),-0.95,0);
        pad.rotation.x = -Math.PI*0.5;
        pad.userData = [-6 + (i*2),0,0];
        this.ControlsPads.add(pad);
    }

    scene.add(this.ControlsPads);

};

GazeControls.prototype.getGaze = function(camera,worldObjects) {

    if (Date.now() - this.lookingAt.cooldown < this.lookingAt.delay)
        return;

    this.rayCaster.setFromCamera( this.rayVector, camera );

    var allObjects = this.ControlsPads.children.concat(worldObjects);
    var intersects = this.rayCaster.intersectObjects(allObjects, true);

    var i, l = this.ControlsPads.children.length;

    for ( i = 0; i < l; i++){
        this.ControlsPads.children[i].material.color.set(0xff0000);
    }


    if (intersects.length > 0 && intersects[0].object.name === "pad"){
        intersects[0].object.material.color.set(0x00ff00);

        if (this.lookingAt.id === intersects[0].object.id) {
            if (Date.now() - this.lookingAt.timer > this.lookingAt.delay) {
                intersects[0].object.material.color.set(0x0000ff);
                this.lookingAt.cooldown = Date.now();

                var moveMe = new THREE.Vector3(intersects[0].object.userData[0],
                    intersects[0].object.userData[1],
                    intersects[0].object.userData[2]);

                return moveMe;


            }
        } else {
            this.lookingAt.id = intersects[0].object.id;
            this.lookingAt.timer = Date.now();
        }

    } else {
        this.lookingAt.id = 0;
    }

};