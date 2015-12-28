var NavPath = function (pars) {
    this.name = pars.name;
    this.position = new THREE.Vector3(pars.pos.x, pars.pos.y, pars.pos.z);
    this.nodes = this.initNodes(pars.points);
};

NavPath.prototype.initNodes = function (points) {
    var r = [];

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
        map: new THREE.ImageUtils.loadTexture("/global/assets/textures/crosshair.png"),
        transparent: true
    });
    points.forEach(function (point, i) {
        var cube = new THREE.Mesh(geometry, material);
        cube.position.x = point.x;
        cube.position.y = point.y;
        cube.position.z = point.z;
        cube.name = this.name + "_" + i;
        cube.visible = false;
        r.push(cube);
    }, this);

    return r;
};

NavPath.prototype.setVisible = function (position) {
    var found = -1;

    this.nodes.forEach(function (node, i) {
        node.visible = false;
        if (node.position.x === -(position.x) &&
            node.position.y === -(position.y) &&
            node.position.z === -(position.z)) {
            found = i;
        }
    }, this);

    if (found > -1) {
        this.nodes.forEach(function (othernode, j) {
            if (j !== found)
                othernode.visible = true;
        }, this);
    }
};

