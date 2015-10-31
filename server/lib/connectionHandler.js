/**
 * ConnectionHandler is a utillity that handles the registration of a mob client with a channel,
 * direct or through a login.
 */
var mobUtil = require("./mobUtil"),
    protocol = require("./protocol");

module.exports.init = function(mob){

    function connectionHandler(client){

        client.on("message", handleMessage);
    }

    function handleMessage(msg){

        var parsed = mobUtil.parseMessage(msg);
        var action = parsed.action;

        switch(action){

            case "login":
                onLogin(this, parsed.data);
                break;
        }
    }

    return connectionHandler;
};

