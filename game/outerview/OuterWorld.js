var OuterWorld = function( onInit ) {

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
    this.pivotObject = new THREE.Object3D();

    var material = new THREE.MeshPhongMaterial({color: 0x555555, opacity: 0.1, transparent: true});
    var geometry = new THREE.BoxGeometry(1,1,1);
    var geometry2 = new THREE.BoxGeometry(2,2,2);
    this.gazeButtonHolder = new THREE.Mesh(geometry, material);
    this.gazeButtonHolder.position.set(0,0,-15);

    // will represent the gaze target as an object in the root world.
    this.gazeTargetHelper = new THREE.Mesh( geometry2, new THREE.MeshPhongMaterial({color: 0x500005, opacity: 0, transparent: true}) );
    this.gazeTargetHelper.position.set(0,0, 5);

    //this.pivotObject.y = -20;
    this.playerIndicator = null;

    this.playerLight = new THREE.PointLight(0xffffff, 1, 20);
    this.globalLight = new THREE.HemisphereLight(0xff0000, 0x89584B, 0.3);
    this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    this.directionalLight.position.set( 10, 10, 0 );
    this.ambientLight = new THREE.AmbientLight( 0xfcc22f ); // soft white light

    this.scene = new THREE.Scene();

    this.triggerObjects = [];

    this.init( onInit );
};

//Init
OuterWorld.prototype.init = function( onInit ) {

    this.buildWorld();

    this.playerLight.position.set(0, 0, 0);
    this.scene.add(this.playerLight);
    this.scene.add(this.globalLight);
    this.scene.add(this.ambientLight);
    this.scene.add(this.directionalLight);

    //var material =  new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture("/global/assets/textures/UV_Grid_Sm.jpg")});
    var material = new THREE.MeshPhongMaterial({color: 0xFCC22F, opacity: 1, transparent: false});
    var finishMaterial = new THREE.MeshPhongMaterial({color: 0x000FFF, opacity: 1, transparent: false});


    var loader = new THREE.ColladaLoader();
    //loader.options.convertUpAxis = true;
    loader.load('/global/assets/models/prototypeMazeV4.dae', function (collada) {
        var dae = collada.scene;

        dae.scale.x = dae.scale.y = dae.scale.z = 0.01;

        dae.traverse(function (child) {
            child.material = material;

            if (child.name !== null && child.name.indexOf("Trigger") === 0) {
                //child.visible = false;
                child.scale.x = child.scale.y = child.scale.z = 1.1;
                child.material = finishMaterial;
            }

            if (child.name !== null && child.name.indexOf("NavPath") === 0) {
                child.visible = false;
            }
        }.bind(this));

        this.worldObject.add(dae);

        //TODO: use skybox for outerview as well
        //this.scene.add(this.buildSkybox());
        this.worldObject.add(this.buildPlayerIndicator());

        onInit();

    }.bind(this));
};

OuterWorld.prototype.buildSkybox = function () {
    var imagePrefix = "/global/assets/textures/images/skybox-innerView-";
    var directions = ["west", "east", "up", "down", "north", "south"];
    var imageSuffix = ".jpg";
    var skyGeometry = new THREE.BoxGeometry(100, 100, 100);

    var skyMaterialArray = [];
    for (var i = 0; i < 6; i++) {
        skyMaterialArray.push(new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
            side: THREE.BackSide
        }));
    }
    var skyMaterial = new THREE.MeshFaceMaterial(skyMaterialArray);

    var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
    return skyBox;
};

OuterWorld.prototype.buildPlayerIndicator = function() {
    var geometry = new THREE.BoxGeometry(2.2, 2.2, 2.2);
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    this.playerIndicator = new THREE.Mesh( geometry, material );

    return this.playerIndicator;
};

//Creates the world objects from the map
OuterWorld.prototype.buildWorld = function() {
    // Nesting world inside pivotObject, with half its size as offset.

    this.worldObject.position.x = -4;
    this.worldObject.position.y = -7;
    this.worldObject.position.z = 10;

    //this.pivotObject.rotation.x = Math.PI/-4;
    //this.pivotObject.rotation.y = Math.PI/-8;
    //this.pivotObject.rotation.z = Math.PI/4;

    this.pivotObject.add(this.worldObject);
    this.scene.add(this.pivotObject);
    this.scene.add(this.gazeButtonHolder);
    this.scene.add(this.gazeTargetHelper);

};

OuterWorld.prototype.setPlayerIndicator = function(x, y, z) {
    this.playerIndicator.position.set(-x,y,-z);
};

OuterWorld.prototype.setRotateTo = function (which) {
    if (this.isBusy())
        return;

    this.props.vectorRotationTarget = new THREE.Vector3(
        this.props.vectorRotationCurrent.x,
        this.props.vectorRotationCurrent.y,
        this.props.vectorRotationCurrent.z);

    switch (which) {
        case 72: //H
            this.props.vectorRotationTarget.z = this.props.vectorRotationTarget.z + (Math.PI * .5);
            break;
        case 75: //K
            this.props.vectorRotationTarget.z = this.props.vectorRotationTarget.z - (Math.PI * .5);
            break;
        case 85: //U
            this.props.vectorRotationTarget.x = this.props.vectorRotationTarget.x - (Math.PI * .5);
            break;
        case 74: //J
            this.props.vectorRotationTarget.x = this.props.vectorRotationTarget.x + (Math.PI * .5);
            break;

        //Y axis for internal testing use only
        case 78: //N
            this.props.vectorRotationTarget.y = this.props.vectorRotationTarget.y - (Math.PI * .5);
            break;
        case 77: //M
            this.props.vectorRotationTarget.y = this.props.vectorRotationTarget.y + (Math.PI * .5);
            break;
    }

    this.props.isRotating = true;


};

// rotates the world object
OuterWorld.prototype.rotate = function() {
    if (!this.props.isRotating)
        return;

    var delta = new THREE.Vector3();
    delta.subVectors(this.props.vectorRotationTarget, this.props.vectorRotationCurrent);

    if (delta.length() < this.props.rotationSpeed){
        // rotation is very close to target
        // so set rotation to target and stop rotating
        this.props.vectorRotationCurrent = this.props.vectorRotationTarget;
        this.rotateOneTick();
        this.props.isRotating = false;
        this.props.rotationAsDegrees = this.fixDegrees([this.worldObject.getWorldRotation().x,
            this.worldObject.getWorldRotation().y,
            this.worldObject.getWorldRotation().z]);

        return true;

    } else {
        // rotation by rotationSpeed
        delta.setLength(this.props.rotationSpeed);
        this.props.vectorRotationCurrent.add(delta);
        this.rotateOneTick();
    }

    return false;
};

OuterWorld.prototype.rotateOneTick = function () {
    console.log('OuterWorld -> rotateOneTick', this.props.vectorRotationCurrent.z);
    this.pivotObject.rotation.x = this.props.vectorRotationCurrent.x;
    this.pivotObject.rotation.y = this.props.vectorRotationCurrent.y;
    this.pivotObject.rotation.z = this.props.vectorRotationCurrent.z;
    this.pivotObject.updateMatrixWorld();
};

// moves the world object
OuterWorld.prototype.move = function() {
    if(!this.props.isMoving)
        return;

    var delta = new THREE.Vector3();
    delta.subVectors(this.props.vectorMoveTarget, this.worldObject.position);

    if (delta.length() < this.props.moveSpeed) {
        this.worldObject.position.x = this.props.vectorMoveTarget.x;
        this.worldObject.position.y = this.props.vectorMoveTarget.y;
        this.worldObject.position.z = this.props.vectorMoveTarget.z;
        this.props.isMoving = false;
        this.updateNodes();
        return true;
    } else {
        delta.setLength(this.props.moveSpeed);
        this.worldObject.position.add(delta);
    }
    return false;
};

//jumps to a new location without tweening
//expects a Vector3
OuterWorld.prototype.setJumpBy = function(delta, rotation) {
    delta = delta.setLength(.05);
    var axis = new THREE.Vector3( 0, 1, 0 );
    delta.applyAxisAngle(axis,rotation.z);
    this.worldObject.position.add(delta);
};

//expects an [x,y,z] array from the control pads
OuterWorld.prototype.setMoveTo = function(target) {


    var offset = new THREE.Vector3(target.x,target.y,target.z);

    this.props.vectorMoveTarget = new THREE.Vector3().subVectors(this.worldObject.position,offset);

    this.props.isMoving = true;
};

//turn radians into degrees, rounded to 0, 90, 180 or 270
OuterWorld.prototype.fixDegrees = function (radArray) {
    console.log(radArray);
    var i = 0, l = radArray.length, r = [], d;
    for (i;i<l;i++){
        d = (Math.round((radArray[i] * 180 / Math.PI) / 10) * 10);
        d = d === -90 ? 270 : d;
        r.push(Math.abs(d));
    }
    return r;
};

OuterWorld.prototype.update = function() {
    if (this.rotate() || this.move()) return true;
};

OuterWorld.prototype.isBusy = function() {
    return (this.props.isMoving || this.props.isRotating);
};
