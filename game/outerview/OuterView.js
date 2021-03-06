var OuterView = function(maze) {
    console.log('OuterView -> OuterView', maze);
    this.maze = maze;
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    var material = new THREE.MeshPhongMaterial({color: 0xff0000, opacity: 1, transparent: false});
    var geometry = new THREE.BoxGeometry(2,2,2);

    this.gazeTarget = new THREE.Mesh(geometry, material);
    this.gazeTarget.position.set(0,0,20);
    //this.gazeTarget = new THREE.Vector3();

    this.maze.add(this.gazeTarget);

    this.cameraDistance = 30;
    this.cameraTarget = new THREE.Vector3();
    this.cameraTarget.y = 0;
    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.rotationYOffset = 0;

    this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    this.effect = new THREE.StereoEffect(this.renderer);

    this.clock = new THREE.Clock();
    this.controls = false;

    this.eventResizeHandler = this.handleResize.bind(this);
    this.eventOrientationHandler = this.setOrientationControls.bind(this);

    this.init();
};

OuterView.prototype.init = function(){
    this.renderer.setClearColor(0xFFFFFF, 0);
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMapEnabled = true;
    this.effect.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
    window.addEventListener( 'resize', this.eventResizeHandler);
    window.addEventListener( 'deviceorientation', this.eventOrientationHandler, true );
};

OuterView.prototype.destroy = function () {

    document.body.removeChild( this.renderer.domElement );
};

OuterView.prototype.handleResize = function(){
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    this.camera.aspect = windowWidth / windowHeight;
    this.camera.updateProjectionMatrix();
    this.camera.useQuaternions = true;

    this.renderer.setSize( windowWidth, windowHeight );
    this.effect.setSize( windowWidth, windowHeight );
};

OuterView.prototype.setOrientationControls = function(e){
    if ( ! e.alpha ) {
        return;
    }

    this.controls = new THREE.DeviceOrientationControls(this.maze);
    this.controls.connect();
    this.controls.update();

    //alert('A'+this.camera.rotation.x + ',' + this.camera.rotation.y + ',' + this.camera.rotation.z);
    //this.camera.lookAt(this.cameraTarget);
    //alert('B'+this.camera.rotation.x + ',' + this.camera.rotation.y + ',' + this.camera.rotation.z);


    window.removeEventListener('deviceorientation', this.eventOrientationHandler, true );
};

OuterView.prototype.rotateCamera = function( mouseEvent ){

    if ( ! this.controls ) {
        // we're dealing with desktop here, no mobile orientation controls
        // so now we may manually adjust the camera rotation

        if ( mouseEvent ) {
            var halfWidth = window.innerWidth / 2;
            var halfHeight = window.innerHeight / 2;

            var rotateX = ( Math.abs( mouseEvent.clientX - halfWidth ) / halfWidth ) * ( Math.PI );

            if ( mouseEvent.clientX < halfWidth ) {
                rotateX = -rotateX;
            }

            var rotateY = ( Math.abs( mouseEvent.clientY - halfHeight ) / halfHeight ) * ( Math.PI );
            if ( mouseEvent.clientY < halfHeight ) {
                rotateY = -rotateY;
            }

            this.maze.rotation.y = -rotateX;
            this.maze.rotation.x = rotateY;
        }

        this.camera.position.set(0,0,-this.cameraDistance);
        this.camera.lookAt(this.cameraTarget);

        // offset detected in first loop, when controls are not present yet.
        this.rotationYOffset = this.camera.rotation.y;

    } else {
        // offset applied in every loop for mobile devices.
        var originalRotY = Math.PI - ((this.camera.rotation.y + Math.PI) % Math.PI);
        //this.camera.rotation.y = (this.camera.rotation.y - this.rotationYOffset);
        //this.camera.position.y = 7 - (this.camera.rotation.x * 20);
        ////this.camera.position.x = 5;
        //this.camera.position.z = -10;// - (originalRotY * 10);

        ////document.querySelector('#debug').textContent = (originalRotY);
        this.maze.rotation.x = -this.maze.rotation.x;
        this.maze.rotation.y = -this.maze.rotation.y;
        this.maze.rotation.z = 0;
    }
};

OuterView.prototype.getRotation = function() {
    return this.camera.rotation;
};

OuterView.prototype.render = function(scene) {

    this.renderer.render(scene, this.camera);
    this.effect.render(scene,this.camera);

    if (this.controls){
        this.controls.update( this.clock.getDelta() );
    }
};