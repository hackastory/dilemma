var World = function() {

    this.props = {
        rotationSpeed : 0.03,
        moveSpeed : 0.2,
        isRotating : false,
        isMoving : false,
        vectorRotationCurrent : new THREE.Vector3(0,0,0),
        vectorRotationTarget : new THREE.Vector3(0,0,0),
        vectorMoveTarget : new THREE.Vector3(0,0,0),
        rotationAsDegrees : []
    }

    this.worldObject = new THREE.Object3D();
    this.pivotObject = new THREE.Object3D();
    this.map = [];
};

World.prototype.rotate = function() {
    // rotates the world object

    if (!this.props.isRotating)
        return;

    var delta = new THREE.Vector3();
    delta.subVectors(this.props.vectorRotationTarget, this.props.vectorRotationCurrent);

    if (delta.length() < this.props.rotationSpeed){
        // rotation is very close to target
        // so set rotation to target and stop rotating
        this.props.vectorRotationCurrent = this.props.vectorRotationTarget;
        this.props.isRotating = false;

        this.props.rotationAsDegrees = this.fixDegrees(this.worldObject.getWorldRotation)

        //not sure if this still does anything
        world.updateMatrixWorld();

        this.updateHitBoxes();
    } else {
        // rotation by rotationspeed
        delta.setLength(this.props.rotationSpeed);
        this.props.vectorRotationCurrent.add(delta);

    }

    this.pivotObject.rotation.set()

}

World.prototype.fixDegrees = function() {

};

var Player = function() {

}