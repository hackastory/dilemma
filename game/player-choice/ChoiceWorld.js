var ChoiceWorld = function() {

    this.props = {
        rotationSpeed : 0.03,
        moveSpeed : 0.2,
        isRotating : false,
        isMoving : false,
        vectorRotationCurrent : new THREE.Vector3(0,0,0),
        vectorRotationTarget : new THREE.Vector3(0,0,0),
        vectorMoveTarget : new THREE.Vector3(0,0,0),
        rotationAsDegrees : []
    };

    this.worldObject = new THREE.Object3D();

    this.globalLight = new THREE.HemisphereLight(0xffffff, 0, 1);
    this.scene = new THREE.Scene();

    this.init();
};

//Init
ChoiceWorld.prototype.init = function() {

    var geometry = new THREE.BoxGeometry(1, 1, 1);

    this.innerChoice =  new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x123fe5 } ) );
    this.innerChoice.position.set( 3, 1, -10 );
    this.innerChoice.name = 'inner';

    this.outerChoice = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0xf630a5 } ) );
    this.outerChoice.position.set( -3, 1, -10 );
    this.outerChoice.name = 'outer';

    this.worldObject.add( this.innerChoice );
    this.worldObject.add( this.outerChoice );

    this.scene.add( this.worldObject );

    this.scene.add(this.globalLight);
};

//turn radians into degrees, rounded to 0, 90, 180 or 270
ChoiceWorld.prototype.fixDegrees = function (radArray) {
    console.log(radArray);
    var i = 0, l = radArray.length, r = [], d;
    for (i;i<l;i++){
        d = (Math.round((radArray[i] * 180 / Math.PI) / 10) * 10);
        d = d === -90 ? 270 : d;
        r.push(Math.abs(d));
    }
    return r;
};

ChoiceWorld.prototype.isBusy = function() {
    return (this.props.isMoving || this.props.isRotating);
};
