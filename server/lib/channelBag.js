/**
 * ChannelBag keeps track of all the server's channels
 */

var mobUtil = require('./mobUtil');

exports.ChannelBag = ChannelBag;


function ChannelBag(){

    this.channels = {};
    this.factories = {};
}

ChannelBag.prototype = {

    /**
     *
     * @param channelName
     * @param module {Object} either the absolute path to the channel module
     *                        or the module object itself
     */
    addChannel: function(channelName, module){
        if(typeof module === 'string'){
            try{
                this.factories[channelName] = require(module);
            }catch(e){
                mobUtil.error('channel module not found: '+ module);
            }
        }else{
            this.factories[channelName] = module;
        }
        if(this.factories[channelName]){
            this.channels[channelName] = [];
        }
    },

    createChannel: function(channelName, config){

        config = config || {};

        if( mobUtil.hasProperty(this.factories, channelName)){

            var factory = this.factories[channelName];
            var channel = factory.create(config, this.channels[channelName]);
            this.channels[channelName].push(channel);
        
            return channel;
        }else{
            mobUtil.error('no factory found for channel '+ channelName);
        }
    },

    hasChannel: function(channelName){
        return mobUtil.hasProperty(this.channels, channelName);
    },

    getFreeChannel: function(channelName){
        if(this.hasChannel(channelName)){
            var chnls = this.channels[channelName];
            var cl = chnls.length;
            for(var c=0; c<cl; c++){
                var channel = chnls[c];
                if(!channel.full()){
                    return channel;
                }
            }
        }
        return null;
    }
};