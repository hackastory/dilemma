var GazeButtonControls = function (pivotObject) {
    this.controls = this.initControls();
    pivotObject.add(this.controls);
};

GazeButtonControls.prototype.initControls = function() {
    var c = new THREE.Object3D();

    var material = new THREE.MeshPhongMaterial({color: 0x555555, opacity: 1, transparent: false});
    var controls = [
        {geometry: new THREE.BoxGeometry(4,4,1), pos: {x:-5,y:7,z:5},  id: 'nav-za'},
        {geometry: new THREE.BoxGeometry(4,4,1), pos: {x:5,y:7,z:5},   id: 'nav-zb'},
        {geometry: new THREE.BoxGeometry(4,4,1), pos: {x:-5,y:7,z:5},  id: 'nav-za'},
        {geometry: new THREE.BoxGeometry(4,4,1), pos: {x:5,y:7,z:5},   id: 'nav-zb'}
    ];

    controls.forEach( function(control) {
        var mesh = new THREE.Mesh(control.geometry, material);

        mesh.id = control.id;
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
