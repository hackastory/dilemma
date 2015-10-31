/**
 * Bundle of frequently used messages, login protocols, etc.
 */
var mobUtil = require("./mobUtil");


module.exports = {

  login : {
      
      SIMPLE :
            (function(){

                var needs = [
                    {
                        name: "username",
                        title : "Username",
                        validator : new RegExp("^([a-z0-9_\\-\\!]+|[a-z0-9_\\-\\!]+\\s[a-z0-9_\\-\\!]+)$", "i"),
                        invalid: "Please enter a valid username. Valid characters are letters, numbers and _-!"
                    },
                    {
                        name: "channel",
                        title : "Channel",
                        validator : new RegExp("^([a-z0-9_\\-]+|[a-z0-9_\\-]+\\s[a-z0-9_\\-]+)$", "i"),
                        invalid: "Please enter a valid channel name"
                    }
                ];

                return {
                    needs : needs,

                    message : mobUtil.createMessage("login", {
                        needs: needs
                    })
                };
            })()
  },

  messages : {

      invalidLogin : function(reason){
          return mobUtil.createMessage("invalidLogin", reason);
      },

      noChannel : function(){
          return mobUtil.createMessage("noChannel", "No channel available at the moment");
      },

      usernameTaken : function(){
          return mobUtil.createMessage("usernameTaken", "There is already someone with that username. Try later or enter a different one.");
      }
  }
};