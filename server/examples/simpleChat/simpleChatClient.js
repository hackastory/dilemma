/**
 * SimpleChat is multi-user test channel showing what the multi-user server can do.
 */
var SimpleChat = {

    init: function(mob, gui){

        this.mob = mob;
        this.username = "";
        this.gui = gui;

        mob.on('connect', mob.util.proxy(this, this.onConnect));
        mob.on('disconnect', mob.util.proxy(this, this.onDisconnect));
        mob.on('message', mob.util.proxy(this, this.handleMessage));
    },

    onConnect: function(){
        this.gui.status.innerHTML = 'connected';
    },

    onDisconnect : function(){
        this.clearFields();
        this.gui.status.innerHTML = 'disconnected';
    },

    clearFields: function(){
        this.gui.status.innerHTML = '';
        this.gui.chat.innerHTML = '';
        this.gui.users.innerHTML = '';
    },

    handleMessage : function(msg){

        var parsed = this.mob.util.parseMessage(msg);
        var action = parsed.action;

        switch(action){

            case "login":
                //depending on the login needs, create a login form

                this.username = prompt("Vul je gebruikersnaam in");
                if( this.username != ""){
                    this.mob.send( this.mob.util.createMessage("login", {
                        "username" : this.username,
                        "channel" : "SimpleChat"
                    }));
                }
                break;

            case "client-added":
                this.addUser(parsed.data);
                if(parsed.data.username === this.username){
                    this.id = parsed.data.id;
                }else{
                    this.mob.send( this.mob.util.createMessage("presence", parsed.data.id));
                }
                break;

            case "client-removed":
                var user = document.getElementById("user-"+ parsed.data.id);
                if( user){
                    user.parentNode.removeChild(user);
                }
                break;

                //just add to the list of users
            case "presence":
                this.addUser(parsed.data);
                break;

            case "chat":
                this.addLine(parsed.data);
                break;

            case "latest":
                var ll = parsed.data.length;
                for(var l=0; l<ll; l++){
                    this.addLine(parsed.data[l]);
                }
                break;
        }
    },

    addUser: function(userData){
        var user = document.createElement("li");
            user.setAttribute("id", "user-"+ userData.id);
            user.innerHTML = userData.username;

        this.gui.users.appendChild(user);
    },

    addLine: function(lineData){
        var line = document.createElement("p");
            line.innerHTML = lineData.client.username +": "+ lineData.line;

        this.gui.chat.appendChild(line);
    },

    chat: function(line){
        this.send( this.mob.util.createMessage("chat", line));
    },

    send: function(msg){
        this.mob.send(msg);
    }
};

