var GazeButtonControls = function(gazeButtonsHolder) {
    this.controls = this.initControls();
    gazeButtonsHolder.add(this.controls);
};

GazeButtonControls.prototype.initControls = function() {
    var c = new THREE.Object3D();

    var material = new THREE.MeshPhongMaterial({color: 0x555555, opacity: 1, transparent: false});
    var controls = [
        {geometry: new THREE.BoxGeometry(4, 4, 1), pos: {x: -8, y: 7, z: 0}, id: 'nav-topleft'},
        {geometry: new THREE.BoxGeometry(4, 4, 1), pos: {x: 8, y: 7, z: 0}, id: 'nav-topright'},
        {geometry: new THREE.BoxGeometry(4, 4, 1), pos: {x: -8, y: -7, z: 0}, id: 'nav-bottomleft'},
        {geometry: new THREE.BoxGeometry(4, 4, 1), pos: {x: 8, y: -7, z: 0}, id: 'nav-bottomright'}
    ];

    controls.forEach(function(control) {
        var mesh = new THREE.Mesh(control.geometry, material);

        mesh.name = control.id;
        mesh.position.x = control.pos.x;
        mesh.position.y = control.pos.y;
        mesh.position.z = control.pos.z;

        c.add(mesh);
    });
    //c.position.x = 4;
    //c.position.y = 7;
    //c.position.z = -10;
    return c;
};
