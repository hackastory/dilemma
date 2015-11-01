/**
 * The Client code for the Amazed game, talking to our multi-user server
 * channel
 */

var Maze = function ( mob ) {

    this.mob = mob;

    mob.on('connect', mob.util.proxy(this, this.onConnect));
    mob.on('disconnect', mob.util.proxy(this, this.onDisconnect));
    mob.on('message', mob.util.proxy(this, this.handleMessage));
};

Maze.prototype = {

    onConnect: function(){},

    onDisconnect : function(){

    },

    handleMessage : function(msg){

        var parsed = this.mob.util.parseMessage(msg);
        var action = parsed.action;

        console.log( parsed );

        switch(action){

            case "login":
                //depending on the login needs, create a login form

                this.username = prompt("Vul je gebruikersnaam in");
                if( this.username != ""){
                    this.mob.send( this.mob.util.createMessage("login", {
                        "username" : this.username,
                        "channel" : "Amazed"
                    }));
                }
                break;

            case "client-added":
                /**
                 *  parsed.data
                 *      parsed.data.username
                 */

                break;

            case "client-removed":
                /**
                 *  parsed.data
                 *      parsed.data.username
                 */
                break;


            case "mazeRunners":
                var ll = parsed.data.length;
                for(var l=0; l<ll; l++){
                    var runner = parsed.data[l];

                    console.log( runner );
                }
                break;
        }
    },

    send: function(msg){
        this.mob.send(msg);
    }
};
