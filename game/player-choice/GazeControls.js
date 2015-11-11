var GazeControls = function () {
    this.rayCaster = new THREE.Raycaster();
    this.rayVector = new THREE.Vector3();

    this.lookingAt = {id: 0, timer: 0, delay: 1000, cooldown: 0, oldColor: 0x000000};
};

GazeControls.prototype.getGaze = function (camera, gazeNodes ) {

    if (Date.now() - this.lookingAt.cooldown < this.lookingAt.delay) {
        return;
    }

    this.rayCaster.setFromCamera( this.rayVector, camera );

    var intersects = this.rayCaster.intersectObjects(gazeNodes, true);

    if ( intersects.length ) {

        if (this.lookingAt.id === intersects[0].object.id) {

            intersects[0].object.material.color.set(0x00ff00);

            if (Date.now() - this.lookingAt.timer > this.lookingAt.delay) {

                intersects[0].object.material.color.set( this.lookingAt.oldColor );
                this.lookingAt.cooldown = Date.now();

                return intersects[0].object.name;
            }

        } else {
            this.lookingAt.id = intersects[0].object.id;
            this.lookingAt.oldColor = intersects[0].object.material.color.getHex();
            this.lookingAt.timer = Date.now();
        }

    } else {

        if ( this.lookingAt.id ) {
            gazeNodes.forEach( function ( node ) {
                if ( node.id === this.lookingAt.id && this.lookingAt.oldColor ) {
                    node.material.color.set( this.lookingAt.oldColor );
                }
            }.bind( this ) );
        }

        this.lookingAt.id = 0;
    }

};