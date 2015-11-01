/**
 * DuckPond is multi-user 3D test channel showing what the Mob server can do.
 */
var DuckPond = {

    init: function(mob, canvas, duckMesh){

        Duck.DUCK_MESH = duckMesh;

        this.mob = mob;
        this.username = "";
        this.pond = new Pond(mob, canvas);
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        mob.on('connect', mob.util.proxy(this, this.onConnect));
        mob.on('disconnect', mob.util.proxy(this, this.onDisconnect));
        mob.on('message', mob.util.proxy(this, this.handleMessage));
    },

    onConnect: function(){},

    onDisconnect : function(){
        this.pond.clear();
    },

    handleMessage : function(msg){

        var parsed = this.mob.util.parseMessage(msg);
        var action = parsed.action;

        switch(action){

            case "login":
                //depending on the login needs, create a login form

                this.username = prompt("Vul je gebruikersnaam in");
                if( this.username != ""){
                    this.mob.send( this.mob.util.createMessage("login", {
                        "username" : this.username,
                        "channel" : "DuckPond"
                    }));
                }
                break;

            case "client-added":
                var duck = new Duck(parsed.data.username);
                this.pond.addDuck(duck);

                if(parsed.data.username === this.username){
                    this.duck = duck;
                    this.bindUserEvents();
                }
                break;

            case "client-removed":
                this.pond.removeDuck(parsed.data.username);
                break;

            

            case "move":
                if(parsed.data.username !== this.username){
                    this.pond.updateDuck(parsed.data.username, parsed.data);
                }
                break;

            case "ducks":
                var ll = parsed.data.length;
                for(var l=0; l<ll; l++){
                    var duck = parsed.data[l],
                        newDuck = new Duck(duck.username);
                    if(duck.position){
                        newDuck.setPosition(duck.position);
                    }
                    if(duck.rotation){
                        newDuck.setRotation(duck.rotation);
                    }

                    this.pond.addDuck(newDuck);
                }
                break;
        }
    },

    bindUserEvents: function(){
        //keys
        FB.addEvent(document, "keydown", this.mob.util.proxy(this, this.keyDown) );
        FB.addEvent(document, "keyup", this.mob.util.proxy(this, this.keyUp) );
    },

    keyUp: function(e){
        e.preventDefault();
        var key = e.charCode? e.charCode : e.keyCode;

        switch(key){
            case 40: clearInterval(this.keys.up);this.keys.up = false; break;
            case 38: clearInterval(this.keys.down);this.keys.down = false; break;
            case 37: clearInterval(this.keys.left);this.keys.left = false; break;
            case 39: clearInterval(this.keys.right);this.keys.right = false; break;
        }
    },

    keyDown: function(e){
        e.preventDefault();

        var pos = this.duck.getPosition();
        var rot = this.duck.getRotation();
        var timing = 50;
        var key = e.charCode? e.charCode : e.keyCode;
        var toRotate = (Math.PI / 180) * 10;

        switch(key){

            case 40:
                //move forwards
                if(this.keys.up){break;}
                var upProxy = mob.util.proxy(this, this.moveUp);
                this.keys.up = setInterval( function(){
                    upProxy(pos, rot);
                }, timing );
                break;

            case 38:
                //move backwards
                if(this.keys.down){break;}
                var downProxy = mob.util.proxy(this, this.moveDown);
                this.keys.down = setInterval( function(){
                    downProxy(pos, rot);
                }, timing );
                break;

            case 37:
                //rotate left
                if(this.keys.left){break;}
                var leftProxy = mob.util.proxy(this, this.moveLeft);
                this.keys.left = setInterval( function(){
                    leftProxy(toRotate, rot);
                }, timing );
                break;

            case 39:
                //rotate right
                if(this.keys.right){break;}
                var rightProxy = mob.util.proxy(this, this.moveRight);
                this.keys.right = setInterval( function(){
                    rightProxy(toRotate, rot);
                }, timing );
                break;
        }
    },

    moveUp: function(position, rotation){

        this.move(true, position, rotation);
        this.sendMove({position: position});
    },

    moveDown: function(position, rotation){

        this.move(false, position, rotation);
        this.sendMove({position: position});
    },

    moveLeft: function(amount, rotation){

        if(rotation.y + amount >= Math.PI * 2){
           rotation.y = rotation.y + amount - Math.PI * 2;
        }else{
           rotation.y += amount;
        }
        this.sendMove({rotation: rotation});
    },

    moveRight: function(amount, rotation){

        if(rotation.y - amount < 0){
           rotation.y = rotation.y + Math.PI * 2 - amount;
        }else{
           rotation.y -= amount;
        }
        this.sendMove({rotation: rotation});
    },

    move: function(forwards, position, rotation){

        var amount = 10 * (forwards? 1 : -1);

        position.x += Math.sin(rotation.y) * amount;
        position.z += Math.cos(rotation.y) * amount;
    },

    sendMove: function(movement){
        movement.username = this.username;

        if ( movement.rotation ) {
            // rotation's x, y and z are setters, won't get JSONified.
            movement.rotation = {
                x: movement.rotation.x,
                y: movement.rotation.y,
                z: movement.rotation.z
            };
        }

        this.send( this.mob.util.createMessage("move", movement));
    },

    send: function(msg){
        this.mob.send(msg);
    }
};




function Duck(username){

    this.username = username;
    this.mesh = new THREE.Object3D();
    this.duckMesh = Duck.DUCK_MESH.clone();
    this.mesh.add(this.duckMesh);

    this.setup();
}
Duck.prototype = {

    setup: function(){
        //in order for the duck mesh to look forward, give him an initial rotation;
        this.duckMesh.rotation.y = Math.PI / 2;

        this.born = new Date().getTime() - Math.floor(Math.random() * 1000);
    },

    render: function(){
        //the duck floats in a pond so
        var age = (new Date().getTime() - this.born) / 700;

        this.duckMesh.rotation.x = Math.sin(age) * 0.15;
        this.duckMesh.position.y = -3 + Math.sin(age) * 3;
    },

    getMesh: function(){
        return this.mesh;
    },

    setPosition: function(to){
        this.mesh.position.set( to.x, to.y, to.z );
    },

    getPosition: function(){
        return this.mesh.position;
    },

    setRotation: function(to){
        this.mesh.rotation.set( to.x, to.y, to.z );
    },

    getRotation: function(){
        return this.mesh.rotation;
    }
};


function Pond(mob, canvas){

    this.mob = mob;
    this.canvas = canvas;
    this.ducks = {};

    this.createScene();
}
Pond.prototype = {

    createScene: function(){

        var ws = getWindowSize();

        this.canvas.width = ws.width;
        this.canvas.height = ws.height;

        this.renderer = new THREE.WebGLRenderer({
                alpha: true,
                canvas: this.canvas,
                shadowMapEnabled: true
            });
        this.renderer.setSize(this.canvas.width, this.canvas.height);

        this.scene = new THREE.Scene();

        //lights
        this.light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        this.scene.add(this.light);



        //Camera's
        this.camera = new THREE.PerspectiveCamera(
                        60,
                        this.canvas.width / this.canvas.height,
                        0.1,
                        10000
                    );
        this.camera.position.z = 1000;
        this.camera.position.y = 850;
        this.scene.add(this.camera);


        this.texture = THREE.ImageUtils.loadTexture( "assets/waternormal.jpg" );
        this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set( 50, 50 );

        this.waterBasic = new THREE.MeshPhongMaterial( {
            color: 0xaaaaff,
            map: this.texture,
            specular : 0x000000,
            shininess: 1,
            reflectivity: 0
        } );

        this.water = new THREE.Mesh( new THREE.PlaneGeometry( 50000, 50000 ), this.waterBasic );
        this.water.rotation.x = - Math.PI / 2;
        this.water.position.y = 0.3;
        this.scene.add( this.water );

        this.camera.lookAt(new THREE.Vector3(0,0,100));

        //Action!
        this.renderProxy = this.mob.util.proxy(this, this.render);
        this.render();

        FB.addEvent(window, "resize", this.mob.util.proxy(this, this.onResize) );
    },

    onResize: function(){
        var ws = getWindowSize();

        this.canvas.width = ws.width;
        this.canvas.height = ws.height;

        this.renderer.setSize(this.canvas.width, this.canvas.height);

        this.camera.aspect = this.canvas.width / this.canvas.height;
        this.camera.updateProjectionMatrix();
    },

    render: function(){
        requestAnimationFrame(this.renderProxy);

        for(var duck in this.ducks){
            this.ducks[duck].render();
        }
        this.renderer.render(this.scene, this.camera);
    },

    addDuck: function(duck){

        this.scene.add(duck.getMesh());
        this.ducks[duck.username] = duck;
    },

    removeDuck: function(duckName){
        var duck = this.getDuckByName(duckName);
        if( duck){
            this.scene.remove(duck.getMesh());
            delete this.ducks[duckName];
        }
    },

    updateDuck: function(duckName, update){
        var duck = this.getDuckByName(duckName);
        if( duck){
            if(update.position){
                duck.setPosition(update.position);
            }
            if(update.rotation){
                duck.setRotation(update.rotation);
            }
        }
    },

    getDuckByName: function(name){
        if(typeof this.ducks[name] !== "undefined"){
            return this.ducks[name];
        }
    },

    clear: function(){
        
    }
};

function getWindowSize(){
    var windowSize = {
        width: 0,
        height:0
    };

    if( typeof( window.innerWidth ) == 'number' ) {

        windowSize.width = window.innerWidth;
        windowSize.height = window.innerHeight;
    }else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
        windowSize.width  = document.documentElement.clientWidth;
        windowSize.height = document.documentElement.clientHeight;
    }
    return windowSize;
}