var View = function() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.effect = new THREE.StereoEffect(renderer);
    this.renderer = new THREE.WebGLRenderer();
    this.clock = new THREE.Clock();
    this.controls = false;

    this.eventResizeHandler = this.handleResize.bind(this);
    this.eventOrientationHandler = this.setOrientationControls.bind(this);

    this.init();
};

View.prototype.init = function(){
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.effect.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );

    window.addEventListener( 'resize', this.eventResizeHandler);
    window.addEventListener( 'deviceorientation', this.eventOrientationHandler, true );
};

View.prototype.handleResize = function(){
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    self.camera.aspect = windowWidth / windowHeight;
    self.camera.updateProjectionMatrix();

    self.renderer.setSize( windowWidth, windowHeight );
    self.effect.setSize( windowWidth, windowHeight );
};

View.prototype.setOrientationControls = function(e){
    if ( ! e.alpha ) {
        return;
    }

    self.controls = new THREE.DeviceOrientationControls( camera );
    self.controls.connect();
    self.controls.update();

    window.removeEventListener('deviceorientation', this.eventOrientationHandler, true );
};

View.prototype.render = function(scene) {

    //TODO: does this mean we're rendering the scene twice?
    this.renderer.render(scene, this.camera);
    effect.render(scene,camera);

    if (this.controls){
        this.controls.update( this.clock.getDelta() );
    }
};