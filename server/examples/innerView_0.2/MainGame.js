var Main = function() {
    this.world = new World();
    this.view = new View();
    this.input = new InputController();

    this.update();
};

Main.prototype.update = function() {
    requestAnimationFrame( this.update );

    if(!this.world.isBusy())
        this.input.getGaze(this.view.camera,this.world.worldObject.children);

    this.world.update();

    this.view.render(this.world.scene);
};

var main = new Main();