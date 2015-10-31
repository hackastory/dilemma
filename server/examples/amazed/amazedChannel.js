/**
 * Our Amazed game. The server side Channel implementation.
 */

var util = require("util"),
    mob = require('../../lib/mob');

var mobUtil = mob.util,
    Channel = mob.Channel;

//The channel has to expose the 'create' function
//that returns an instance of this channel.
exports.create = function (){
    return new Amazed();
};

function Amazed(){

    Amazed.super_.call(this);//the channel has to invoke super_
                                 //to get all the startup gravy from mob.Channel

    this.runners = {};
}

util.inherits(Amazed, Channel);//the channel has to extend mob.Channel


mobUtil.extend(Amazed.prototype, {

    onClientAdd: function(clientHandler){

       var username = clientHandler.getData("username");

       //send other user positions
       clientHandler.send(mobUtil.createMessage("mazeRunners"), this.getMazeRunners());

       this.runners[username] = new MazeRunner(username);
    },

    onClientRemove: function(clientId, clientUsername){

        if(typeof this.runners[clientUsername] !== "undefined"){
            delete this.runners[clientUsername];
        }
    },

    onClientMessage : function(clientHandler, msg){

        switch(msg.action){

            case "move":
                var runner = this.runners[clientHandler.getData("username")];
                if( msg.data.position){
                    runner.setPosition(msg.data.position);
                }
                if( msg.data.rotation){
                    runner.setRotation(msg.data.rotation);
                }
                this.broadcast(mobUtil.createMessage("move", msg.data));
                break;
        }
    },

    //return all runners and their positions
    getMazeRunners: function(){
        var returned = [];
        for(var i in this.runners){
            var runner = this.runners[i];
            returned.push({
                username: runner.username,
                position: runner.getPosition(),
                rotation: runner.getRotation()
            });
        }
        return returned;
    }
});

function MazeRunner(username){

    this.username = username;
    this.position = {x:0,y:0,z:0};
    this.rotation = {x:0,y:0,z:0};
}
MazeRunner.prototype = {

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