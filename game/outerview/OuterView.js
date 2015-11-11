var OuterView = function() {
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    this.cameraTarget = new THREE.Vector3();
    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.renderer = new THREE.WebGLRenderer();
    this.effect = new THREE.StereoEffect(this.renderer);

    this.clock = new THREE.Clock();
    this.controls = false;

    this.eventResizeHandler = this.handleResize.bind(this);
    this.eventOrientationHandler = this.setOrientationControls.bind(this);

    this.init();
};

OuterView.prototype.init = function(){
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMapEnabled = true;
    this.effect.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
    window.addEventListener( 'resize', this.eventResizeHandler);
    window.addEventListener( 'deviceorientation', this.eventOrientationHandler, true );
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

    this.controls = new THREE.DeviceOrientationControls(this.camera);
    this.controls.connect();
    this.controls.update();

    window.removeEventListener('deviceorientation', this.eventOrientationHandler, true );
};

OuterView.prototype.rotateCamera = function(rot){

    if ( ! this.controls ) {
        // we're dealing with desktop here, no mobile orientation controls
        // so now we may manually adjust the camera rotation

        this.lon += rot.x;
        this.lat -= rot.y;
        this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
        var phi = ( 90 - this.lat ) * Math.PI / 180;
        var theta = this.lon * Math.PI / 180;

        this.camera.position.x = Math.sin( phi ) * Math.cos( theta );
        this.camera.position.y = Math.cos( phi );
        this.camera.position.z = Math.sin( phi ) * Math.sin( theta );
        this.camera.position.setLength(this.cameraDistance);

        this.camera.lookAt(this.cameraTarget);
    }
};

OuterView.prototype.getRotation = function() {
    return this.camera.rotation;
};

OuterView.prototype.render = function(scene) {
    //console.log(scene.children.length);
    this.renderer.render(scene, this.camera);
    this.effect.render(scene,this.camera);

    if (this.controls){
        this.controls.update( this.clock.getDelta() );
    }
};