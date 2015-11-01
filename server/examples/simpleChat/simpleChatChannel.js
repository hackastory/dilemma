/**
 * Simple chat application. The server side Channel implementation.
 * No database, just memory :)
 */

var util = require("util"),
    mob = require('../../lib/mob');

var mobUtil = mob.util,
    Channel = mob.Channel;

//The channel has to expose the 'create' function
//that returns an instance of this channel.
exports.create = function (){
    return new SimpleChat();
};

function SimpleChat(){

    SimpleChat.super_.call(this);//the channel has to invoke super_
                                 //to get all the startup gravy from mob.Channel

    //further implementation is up to you
    this.messages = [];
    this.latestMsgCount = 5;//max number of latest messages to receive when (re)connecting
}

util.inherits(SimpleChat, Channel);//the channel has to extend mob.Channel

SimpleChat.MAX_MESSAGES = 150;

mobUtil.extend(SimpleChat.prototype, {

    onClientAdd: function(clientHandler){

       //send latest messages
       clientHandler.send(mobUtil.createMessage("latest", this.getLatestMessages()));

       //other clients will send their presence to the newcomer
    },

    //not used in SimpleChat, you can leave this function out
    //Channel automatically broadcasts a client-added and client-removed message
    onClientRemove: function(clientId, clientUsername){},

    onClientMessage : function(clientHandler, msg){

        switch(msg.action){

            case "chat":
                var chatData = {
                    client: {
                        id: clientHandler.getId(),
                        username: clientHandler.getData("username")
                    },
                    line: msg.data,
                    timestamp: (new Date()).getTime()
                };
                this.messages.push(chatData);

                while(this.messages.length > SimpleChat.MAX_MESSAGES){
                    this.messages.shift();
                }

                this.broadcast(mobUtil.createMessage("chat", chatData));
                break;

            case "presence":
                var userId = msg.data,//whom should we notify of our presence
                    user = this.clientById(userId);

                if(user){
                   user.send(mobUtil.createMessage("presence", {
                       id: clientHandler.getId(),
                       username: clientHandler.getData("username")
                   }));
                }

                break;
        }
    },

    getLatestMessages: function(){
        var ml = rml = this.messages.length;
        if( rml === 0){
            return [];
        }
        if( rml > this.latestMsgCount){
            rml = this.latestMsgCount;
        }
        return this.messages.slice(ml-rml);
    }
});
