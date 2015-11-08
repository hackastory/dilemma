var TriggerObject = function (pars) {
    this.name = pars.name;
    this.position = new THREE.Vector3(pars.pos.x, pars.pos.y, pars.pos.z);
};

TriggerObject.prototype.checkHit = function (position, callback) {
    if (this.position.x === -(position.x - 2) &&
        this.position.y === -(position.y - 2) &&
        this.position.z === -(position.z - 2)) {
        callback(this.name);
    }
};
