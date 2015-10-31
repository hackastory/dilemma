var EventEmitter = require('events').EventEmitter,
    io = require('socket.io'),
    mobUtil = require('./mobUtil'),
    fileServer = require('./fileServer'),
    Channel = require('./channel').Channel,
    channelBag = new (require('./channelBag').ChannelBag)(),
    protocol = require("./protocol");


function Mob(){
    this.options = {
        autoHost : true,
        socketio : {'log level': 1},
        scope : 'window'
    };
}

Mob.prototype = {

    /**
     *
     * @param {httpServer} server a Node.js http server
     * @param {Object} [options={}]
     */
    init : function(server, options){

        if (typeof options === 'object') {
            mobUtil.extend(this.options, options);
        }

        this.initModules();

        //let Mob serve it's API, if not, app developer must include the mob.js client api manually
        if(this.options.autoHost){
            fileServer.wrapServer(server, this.options);
        }

        this.server = io.listen(server, this.options.socketio);
        this.server.sockets.on('connection', this.loginHandler);
    },

    initModules: function(){
        this.channelBag = channelBag;
        this.loginHandler = require('./loginHandler').init(this);
    }
};

Mob.prototype.__proto__ = EventEmitter.prototype;

module.exports = {

    util : mobUtil,

    Channel : Channel,

    addChannel : function(){
        channelBag.addChannel.apply(channelBag, arguments);
    },

    getChannels: function(){
       return channelBag.getChannels.apply(channelBag, arguments);
    },

    loginProtocol: protocol.login,

    init : function(){
        var m = new Mob();
            m.init.apply(m, arguments);
        return m;
    }
};