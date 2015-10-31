/**
 * Mob utilities
 */
var util = {
    createMessage : function(action, data){

        var msg = {
            action : action,
            data : (typeof data != "undefined")? data : ""
        };
        return util.stringify(msg);
    },

    parseMessage : function(msg){

        var parsed = {
            action : "",
            data: ""
        };

        try{
            var json = util.parse(msg);

            if(json.action){
               parsed.action = json.action
            }
            if(json.data){
                parsed.data = json.data;
            }

        }catch(e){
            console.log("Invalid message received");
        }

        return parsed;
    },

    stringify : JSON.stringify,
    parse : JSON.parse,

    error : function(e){
        console.log(e);
        if (util.hasProperty(e, 'stack')) {
            console.log(e.stack);
        }
    },

    extend: function (target, obj) {
        for (var i = 0, keys = Object.keys(obj), ii = keys.length; i < ii; i++) {

            var key = keys[i];
            if (util.hasProperty(target, key) && obj[key] && typeof obj[key] === 'object') {
                if(Array.isArray(obj[key])) {
                    target[key] = target[key] || [];
                }else{
                    target[key] = target[key] || {};
                }
                util.extend(target[key], obj[key]);
            }else{
                target[key] = obj[key];
            }
        }
    },

    hasProperty: function (obj, prop) {
        return Object.prototype.hasOwnProperty.call(Object(obj), prop);
    },

    proxy : function(scope, handler){
        return function(){
            handler.apply(scope, arguments);
        };
    }
};

module.exports = util;