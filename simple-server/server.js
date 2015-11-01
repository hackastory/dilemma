var express = require('express'); // Docs http://expressjs.com/
var socketIo = require('socket.io'); // Docs http://socket.io/

var GameEngine = require('./lib/GameEngine');


var app = express();
var server = require('http').Server( app );
var io = socketIo( server );

var port = process.env.PORT || 4000;

app.use( '/prototypes', express.static( __dirname +'/../server/examples' ) );
app.use( express.static( __dirname +'/game' ) );
app.use( '/vendor', express.static( __dirname +'/node_modules' ) );
app.use( '/admin', express.static( __dirname +'/admin' ) );



    // binding to 0.0.0.0 allows connections from any other computer in the network
    // to your ip address
server.listen( port, '0.0.0.0', function () {

    console.log('game server started on localhost:'+ port );

    new GameEngine( io );
} );