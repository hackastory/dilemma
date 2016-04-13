var OuterGazeControls = function(scene) {
    this.ControlsPads = new THREE.Object3D();
    this.rayCaster = new THREE.Raycaster();
    this.rayVector = new THREE.Vector3();

    this.lookingAt = {id: 0, timer: 0, delay: 500, cooldown: 0, name: ''};
};

OuterGazeControls.prototype.getGaze = function (navNodes, hitter) {

    if (Date.now() - this.lookingAt.cooldown < this.lookingAt.delay) {
        return;
    }

    var intersects = [];
    var boundingBox = new THREE.Box3();
    boundingBox.setFromObject( hitter );

    navNodes.forEach(function (n) {
        n.material.color.set(0x00ff00);

        var worldPos = new THREE.Vector3();
        worldPos.setFromMatrixPosition( n.matrixWorld );

        if( boundingBox.distanceToPoint( worldPos ) < 5 ) {
            intersects.push( n );
        }
    });

    //console.log('child=', navNodes.getObjectByName('aap'));
    //console.log('OuterGazeControls -> getGaze', position);

    for (i = intersects.length - 1; i >= 0; i--) {
        if (intersects[i].visible === false)
            intersects.splice(i);
    }

    if (intersects.length > 0 && intersects[0].name.indexOf("nav-") === 0) {
        console.log('OuterGazeControls -> getGaze', intersects);

        if (this.lookingAt.id === intersects[0].id) {

            intersects[0].material.color.set(0x000fff);

            if (Date.now() - this.lookingAt.timer > this.lookingAt.delay) {
                //intersects[0].object.material = this.normalMaterial;
                this.lookingAt.cooldown = Date.now();

                console.log('getGaze found a button:', this.lookingAt.name);

                return this.lookingAt.name;
            }

        } else {
            this.lookingAt.id = intersects[0].id;
            this.lookingAt.name = intersects[0].name;
            this.lookingAt.timer = Date.now();
        }

    } else {
        this.lookingAt.id = 0;
    }

};