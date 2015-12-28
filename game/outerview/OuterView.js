var OuterView = function() {
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    this.cameraDistance = 30;
    this.cameraTarget = new THREE.Vector3();
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

    this.controls = new THREE.DeviceOrientationControls(this.camera);
    this.controls.connect();
    this.controls.update();
    //alert('A'+this.camera.rotation.x + ',' + this.camera.rotation.y + ',' + this.camera.rotation.z);
    this.camera.lookAt(this.cameraTarget);
    //alert('B'+this.camera.rotation.x + ',' + this.camera.rotation.y + ',' + this.camera.rotation.z);


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

        // offset detected in first loop, when controls are not present yet.
        this.rotationYOffset = this.camera.rotation.y;
    } else {
        // offset applied in every loop for mobile devices.
        this.camera.rotation.y = (this.camera.rotation.y - this.rotationYOffset);
        //document.querySelector('#pos').textContent = (this.camera.rotation.y);
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