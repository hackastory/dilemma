var Main = function() {
    this.world = new World();
    this.view = new View();
    this.gaze = new GazeControls(this.world.scene);
    this.input = new DesktopControls();
    this.socket = io(document.location.origin);

    this.socketEvents();
    this.update();
};

Main.prototype.update = function() {
    requestAnimationFrame( this.update.bind(this));

    if(!this.world.isBusy()) {

        var target = this.gaze.getGaze(this.view.camera, this.world.worldObject.children);
        if (target != null) this.world.setMoveTo(target);



        this.world.setJumpBy(this.input.getMovement(),this.view.getRotation());
    }

    this.world.update();

    this.view.rotateCamera(this.input.getMouse());

    this.view.render(this.world.scene);


};

Main.prototype.socketEvents = function () {
    this.socket.on('rotate-h', this.world.setRotateTo.bind(this.world, 72));
    this.socket.on('rotate-k', this.world.setRotateTo.bind(this.world, 75));
    this.socket.on('rotate-u', this.world.setRotateTo.bind(this.world, 85));
    this.socket.on('rotate-j', this.world.setRotateTo.bind(this.world, 74));
};

var main = new Main();