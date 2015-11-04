var Main = function() {
    this.world = new World();
    this.view = new View();
    this.gaze = new GazeControls(this.world.scene);
    this.input = new DesktopControls();

    this.update();
};

Main.prototype.update = function() {
    requestAnimationFrame( this.update.bind(this));

    if(!this.world.isBusy()) {
        this.gaze.getGaze(this.view.camera, this.world.worldObject.children);
        this.world.setJumpBy(this.input.getMovement(),this.view.getRotation());
    }

    this.world.update();

    this.view.rotateCamera(this.input.getMouse());

    this.view.render(this.world.scene);

};

var main = new Main();