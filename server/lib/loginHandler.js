/**
 * loginHandler is a utillity that handles the registration of a mob client with a channel
 * that requires a login.
 */

var ClientHandler = require("./clientHandler").ClientHandler,
    mobUtil = require("./mobUtil"),
    protocol = require("./protocol"),
    loginProtocol = protocol.login.SIMPLE;

exports.init = function(mob){

    function loginHandler(client){

        client.on("message", handleMessage);

        client.send( loginProtocol.message );
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

    function onLogin(client, loginData){

        var errorMsg = validateLogin(loginData);
        if( errorMsg === ""){

            var channel = getFreeChannel(loginData.channel);
            if( channel){

                if(channel.hasClientWithUsername(loginData.username)){

                    client.send( protocol.messages.usernameTaken() );

                }else{

                    var clientHandler = new ClientHandler(client, loginData, channel);
                        clientHandler.start();
                }
            }else{

                client.send( protocol.messages.noChannel() );
            }

        }else{
            client.send( protocol.messages.invalidLogin( errorMsg ) );
        }
    }

    function getFreeChannel(forName){

        var channel = mob.channelBag.getFreeChannel(forName);

        if(!(channel)){
            channel = mob.channelBag.createChannel(forName);
        }

        return channel;
    }

    /**
     * @param loginData The data to check against the login protocol for this server
     *
     * @return errorMessage The error message or an empty string if no error
     */
    function validateLogin(loginData){

        var needs = loginProtocol.needs;
        var nl = needs.length;

        for(var n=0; n<nl; n++){

            var need = needs[n];
            var value = loginData[need.name];

            //syntax validation
            if( !(value && need.validator.test( value ))){
                return [need.invalid];
            }

            switch(need){

                case "channel":
                    if(!mob.channelBag.hasChannel(value)){
                        return [need.invalid];
                    }
                    break;
            }
        }
        return "";
    }

    return loginHandler;
};

