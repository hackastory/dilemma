/**
 * Channel delivers the basics for communicating between nodejs clients and apps.
 * All apps need to extend Channel.
 */

var util = require('util'),
    mobUtil = require('./mobUtil'),
    EventEmitter = require('events').EventEmitter;


var DEFAULTS = {
        clientLimit : -1, //unlimited
        description: '',
        broadcastAddAndRemove: true //automatically broadcasts when a client is added or removed
                                    //if you want to do this yourself, for instance to
                                    //add parameters or do some other checks first, you can turn it off
    };

exports.Channel = Channel;

function Channel(config){

    EventEmitter.call(this);

    config = config || {};

    this.setup(DEFAULTS);
    this.setup(config);

    this.clientsSize = 0;
    this.clients = {};
}

util.inherits(Channel, EventEmitter);

mobUtil.extend(Channel.prototype, {

    setup : function(cfg){
        for(var prop in cfg){
            this[prop] = cfg[prop];
        }
    },

    clientCount : function(){

        return this.clientsSize;
    },

    addClient: function(clientHandler){
        if(!this.full()){

            var that = this;
            this.clientsSize++;
            this.clients[clientHandler.getId()] = clientHandler;

            clientHandler.on("message", function(msg){
               that.onClientMessage.call(that, clientHandler, msg);
            });

            if(this.broadcastAddAndRemove){
                this.onClientAddDefault(clientHandler);
            }

            this.onClientAdd(clientHandler);
        }
    },

    onClientAddDefault: function(clientHandler, msg){
       this.broadcast(mobUtil.createMessage("client-added", {
           id: clientHandler.getId(),
           username: clientHandler.getData("username")
       }));
    },

    removeClient: function(clientHandler){
        var clientToRemove = this.clients[clientHandler.getId()];
        if( clientToRemove){

            delete this.clients[clientHandler.getId()];
            this.clientsSize--;

            if(this.broadcastAddAndRemove){
                this.onClientRemoveDefault(clientHandler.getId(), clientHandler.getData("username"));    
            }

            this.onClientRemove(clientHandler.getId(), clientHandler.getData("username"));
        }

        //cleanup channel if empty?
    },

    onClientRemoveDefault: function(clientId, clientUsername){
        this.broadcast(mobUtil.createMessage("client-removed", {
            id: clientId,
            username: clientUsername
        }));
    },

    hasClientWithUsername: function(username){
        return (this.clientByUsername(username));
    },

    clientByUsername: function(username){
        for(var id in this.clients){
            if( this.clients[id].getData('username') === username){
                return this.clients[id];
            }
        }
        return false;
    },

    clientById : function(id){
        return this.clients[id];
    },

    full: function(){
        if(this.clientLimit === -1){
            return false;
        }else{
            return this.clientCount() >= this.clientLimit;
        }
    },

    /**
     * @param msg A message created by util.createMessage
     * @param clients [optional] specific set of clients to broadcast to
     * @param exclude [optional] Boolean in- or exclude the given clients, defaults to include
     */
    broadcast : function(msg, clients, exclude){
        exclude = typeof exclude != "undefined"? exclude : false;

        if(clients && exclude){

            var ids = {};
            clients.forEach(function(clientHandler){
                ids[clientHandler.getId()] = true;
            });

            for(var id in this.clients){
                var clientHandler = this.clients[id];
                if( !ids[id]){
                    clientHandler.send(msg);
                }
            }

        }else if(clients && !exclude){

            clients.forEach(function(clientHandler){
                clientHandler.send(msg);
            });

        }else{
            for(var id in this.clients){
                this.clients[id].send(msg);
            }
        }
    },

    //abstracts, override in a specific channel
    onClientMessage : function(clientHandler, message){},
    onClientAdd: function(clientHandler){},
    onClientRemove: function(clientId, clientUsername){}

});