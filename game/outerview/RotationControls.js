var RotationControls = function (pivotObject) {
    this.axes = this.initAxes();
    pivotObject.add(this.axes);

    this.controls = this.initControls();
    pivotObject.add(this.controls);
};

RotationControls.prototype.initAxes = function() {
    var a = new THREE.Object3D();

    var material = new THREE.MeshPhongMaterial({color: 0x333333, opacity: 1, transparent: false});
    var geometry = [
        new THREE.BoxGeometry(0.5,32,0.5),
        new THREE.BoxGeometry(32,0.5,0.5),
        new THREE.BoxGeometry(0.5,0.5,32 )
    ];

    geometry.forEach( function(geo) {
        var mesh = new THREE.Mesh(geo, material);

        a.add(mesh);
    });

    //a.position.x = 4;
    //a.position.y = 7;
    //a.position.z = -10;

    a.position.x = 0;
    a.position.y = 0;
    a.position.z = 0;

    return a;
};

RotationControls.prototype.initControls = function() {
    var c = new THREE.Object3D();

    var material = new THREE.MeshPhongMaterial({color: 0x555555, opacity: 1, transparent: false});
    var controls = [
        {geometry: new THREE.BoxGeometry(4,4,1), pos: {x:0,y:0,z:-16}, name: 'aap'},
        {geometry: new THREE.BoxGeometry(4,4,1), pos: {x:0,y:0,z:16}},
        {geometry: new THREE.BoxGeometry(1,4,4), pos: {x:-16,y:0,z:0}},
        {geometry: new THREE.BoxGeometry(1,4,4), pos: {x:16,y:0,z:0}},
        {geometry: new THREE.BoxGeometry(4,1,4), pos: {x:0,y:-16,z:0}},
        {geometry: new THREE.BoxGeometry(4,1,4), pos: {x:0,y:16,z:0}}
    ];

    controls.forEach( function(control) {
        var mesh = new THREE.Mesh(control.geometry, material);

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
