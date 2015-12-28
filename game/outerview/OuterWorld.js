var OuterWorld = function() {

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
    this.playerIndicator = null;

    this.navNodesObject = new THREE.Object3D();
    this.playerLight = new THREE.PointLight(0xffffff, 1, 20);
    this.globalLight = new THREE.HemisphereLight(0xff0000, 0x89584B, 0.3);
    this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    this.directionalLight.position.set( 10, 10, 0 );
    this.ambientLight = new THREE.AmbientLight( 0xfcc22f ); // soft white light

    this.scene = new THREE.Scene();

    this.navPaths = [];
    this.triggerObjects = [];

    this.init();
};

//Init
OuterWorld.prototype.init = function() {

    this.worldObject.position.set(2,2,2);
    this.buildWorld();

    this.playerLight.position.set(0, 0, 0);
    this.scene.add(this.playerLight);
    this.scene.add(this.globalLight);
    this.scene.add(this.ambientLight);
    this.scene.add(this.directionalLight);

    //var material =  new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture("/global/assets/textures/UV_Grid_Sm.jpg")});
    var material = new THREE.MeshPhongMaterial({color: 0xFCC22F, opacity: 1, transparent: false});
    var finishMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});


    var loader = new THREE.ColladaLoader();
    //loader.options.convertUpAxis = true;
    loader.load('/global/assets/models/prototypeMazeV4.dae', function (collada) {
        dae = collada.scene;
        dae.position.x = dae.position.y = dae.position.z = -2;

        dae.scale.x = dae.scale.y = dae.scale.z = 0.01;

        dae.traverse(function (child) {
            child.material = material;

            if (child.name !== null && child.name.indexOf("Trigger") === 0) {
                var trigger = {
                    name: child.name,
                    pos: {
                        x: Math.round(child.position.x / 100),
                        y: Math.round(child.position.y / 100),
                        z: Math.round(child.position.z / 100)
                    }
                };

                this.triggerObjects.push(new TriggerObject(trigger));

                child.visible = false;
            }

            if (child.name !== null && child.name.indexOf("NavPath") === 0) {
                var path = {
                    name: child.name,
                    pos: {
                        x: Math.round(child.position.x / 100),
                        y: Math.round(child.position.y / 100),
                        z: Math.round(child.position.z / 100)
                    },
                    points: [{
                        x: Math.round(child.geometry.attributes.position.array[0] / 100),
                        y: Math.round(child.geometry.attributes.position.array[1] / 100),
                        z: Math.round(child.geometry.attributes.position.array[2] / 100)
                    },
                        {
                            x: Math.round(child.geometry.attributes.position.array[3] / 100),
                            y: Math.round(child.geometry.attributes.position.array[4] / 100),
                            z: Math.round(child.geometry.attributes.position.array[5] / 100)
                        }]
                };
                this.navPaths.push(new NavPath(path));
                //this.navNodes.push(
                //    new NavNode({
                //        name: child.name,
                //        x: Math.round(child.position.x/100),
                //        y: Math.round(child.position.y/100),
                //        z: Math.round(child.position.z/100)
                //    })
                //);
                child.visible = false;
            }
        }.bind(this));

        this.navPaths.forEach(function (navPath) {
            navPath.nodes.forEach(function (node) {
                this.navNodesObject.add(node);
            }, this);
        }, this);

        this.navNodesObject.position.x = this.navNodesObject.position.y = this.navNodesObject.position.z = -2;
        this.worldObject.add(this.navNodesObject);
        this.worldObject.add(dae);
        this.updateNodes();
    }.bind(this));

    //TODO: use skybox for outerview as well
    //this.scene.add(this.buildSkybox());
    this.scene.add(this.buildPlayerIndicator());

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
            side: THREE.BackSide,
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
    // ADDING THINGS TO THINGS
    this.pivotObject.add(this.worldObject);
    this.scene.add(this.pivotObject);

};

OuterWorld.prototype.setPlayerIndicator = function(x, y, z) {
    this.playerIndicator.position.set(x,y,z);
};

OuterWorld.prototype.setRotateTo = function (which) {
    if (this.isBusy())
        return;

    this.props.vectorRotationTarget = new THREE.Vector3(this.props.vectorRotationCurrent.x,
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

    var tmp;

    //this entire switch could probably be replaced by one line of code
    //something that gets the transform matrix from the world and applies it to the target vector
    //however, I'm not smart enough to get it to work
    //switch (this.props.rotationAsDegrees[0]) {
    //
    //    case 0:
    //
    //        switch (this.props.rotationAsDegrees[2]) {
    //            case 90:
    //                tmp = target.x;
    //                target.x = target.y;
    //                target.y = -tmp;
    //                break;
    //            case 180:
    //                target.x = -target.x;
    //                break;
    //            case 270:
    //                tmp = target.x;
    //                target.x = target.y;
    //                target.y = tmp;
    //                break;
    //        }
    //        break;
    //
    //    case 90:
    //
    //        switch (this.props.rotationAsDegrees[2]) {
    //            case 0:
    //                target.y = target.z;
    //                target.z = 0;
    //                break;
    //            case 90:
    //                tmp = target.x;
    //                target.x = target.z;
    //                target.y = -tmp;
    //                target.z = 0;
    //                break;
    //            case 180:
    //                target.x = -target.x;
    //                target.y = -target.z;
    //                target.z = 0;
    //                break;
    //            case 270:
    //                tmp = target.x;
    //                target.x = -target.z;
    //                target.z = 0;
    //                target.y = tmp;
    //                break;
    //        }
    //        break;
    //
    //    case 180:
    //
    //        switch (this.props.rotationAsDegrees[2]) {
    //            case 0:
    //                target.z = -target.z;
    //                break;
    //            case 90:
    //                target.z = -target.z;
    //                target.y = -target.x;
    //                target.x = 0;
    //                break;
    //            case 180:
    //                target.z = -target.z;
    //                target.x = -target.x;
    //                break;
    //            case 270:
    //                target.z = -target.z;
    //                target.y = target.x;
    //                target.x = 0;
    //                break;
    //        }
    //        break;
    //
    //    case 270:
    //
    //        switch (this.props.rotationAsDegrees[2]) {
    //            case 0:
    //                target.y = -target.z;
    //                target.z = 0;
    //                break;
    //            case 90:
    //                tmp = target.x;
    //                target.x = -target.z;
    //                target.y = -tmp;
    //                target.z = 0;
    //                break;
    //            case 180:
    //                target.x = -target.x;
    //                target.y = target.z;
    //                target.z = 0;
    //                break;
    //            case 270:
    //                tmp = target.x;
    //                target.x = target.z;
    //                target.y = tmp;
    //                target.z = 0;
    //                break;
    //        }
    //}

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

OuterWorld.prototype.updateNodes = function () {
    this.navPaths.forEach(function (navPath) {
        navPath.setVisible(this.worldObject.position);
    }, this);
};

OuterWorld.prototype.isBusy = function() {
    return (this.props.isMoving || this.props.isRotating);
};
