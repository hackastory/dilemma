/**
 * ClientHandler keeps track of a nodejs socket client in concern to it's channel
 */

/**
 * module dependencies
 */
var mobUtil = require("./mobUtil"),
    util = require("util"),
    protocol = require("./protocol"),
    EventEmitter = require("events").EventEmitter;


/**
 * impl
 */
var exports = module.exports;
    exports.ClientHandler = ClientHandler;


function ClientHandler(client, loginData, channel){

    EventEmitter.call(this);

    var that = this;
    this.client = client;
    this.channel = channel;
    this.loginData = loginData;

    this.client.on("disconnect", function(){
       that.onDisonnect.call(that);
    });
    this.client.on("message", function(msg){
       that.onMessage.call(that, mobUtil.parseMessage(msg));
    });
}

util.inherits(ClientHandler, EventEmitter);

mobUtil.extend(ClientHandler.prototype, {

    start : function(){

        this.channel.addClient(this);
    },

    getChannel: function(){
        return this.channel;
    },

    getId: function(){
        return this.client.id;
    },

    getData: function(key){
        var value = this.loginData[key];
        return value? value : "";
    },

    onDisonnect: function(){
        if(this.channel){
           this.channel.removeClient(this);
           this.channel = null;
        }
        this.client = null;
        delete this;
    },

    onMessage: function(msg){
        this.emit('message', msg);
    },

    send : function(msg){
        this.client.send(msg);
    }
});