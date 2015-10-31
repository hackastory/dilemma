/**
 * Simple 3D application. The server side Channel implementation.
 */

var util = require("util"),
    mob = require('../../lib/mob');

var mobUtil = mob.util,
    Channel = mob.Channel;

//The channel has to expose the 'create' function
//that returns an instance of this channel.
exports.create = function (){
    return new DuckPond();
};

function DuckPond(){

    DuckPond.super_.call(this);//the channel has to invoke super_
                                 //to get all the startup gravy from mob.Channel
    this.ducks = {};
}

util.inherits(DuckPond, Channel);//the channel has to extend mob.Channel


mobUtil.extend(DuckPond.prototype, {

    onClientAdd: function(clientHandler){

       var username = clientHandler.getData("username");

       //send other duck positions
       clientHandler.send(mobUtil.createMessage("ducks", this.getDucks() ));

       //add user to the pond
       this.ducks[username] = new Duck(username);
    },

    onClientRemove: function(clientId, clientUsername){

        if(typeof this.ducks[clientUsername] !== "undefined"){
            delete this.ducks[clientUsername];
        }
    },

    onClientMessage : function(clientHandler, msg){

        switch(msg.action){

            case "move":
                var duck = this.ducks[clientHandler.getData("username")];
                if( msg.data.position){
                    duck.setPosition(msg.data.position);
                }
                if( msg.data.rotation){
                    duck.setRotation(msg.data.rotation);
                }
                this.broadcast(mobUtil.createMessage("move", msg.data));
                break;
        }
    },

    //return all ducks and their positions
    getDucks: function(){
        var returned = [];
        for(var d in this.ducks){
            var duck = this.ducks[d];
            returned.push({
                username: duck.username,
                position: duck.getPosition(),
                rotation: duck.getRotation()
            });
        }
        return returned;
    }
});

function Duck(username){

    this.username = username;
    this.position = {x:0,y:0,z:0};
    this.rotation = {x:0,y:0,z:0};
}
Duck.prototype = {

    setPosition: function(to){
        this.position = to;
    },

    getPosition: function(){
        return this.position;
    },

    setRotation: function(to){
        this.rotation = to;
    },

    getRotation: function(){
        return this.rotation;
    }
};