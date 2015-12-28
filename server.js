var express = require('express'); // Docs http://expressjs.com/
var socketIo = require('socket.io'); // Docs http://socket.io/

var GameEngine = require('./GameEngine');


var app = express();
var server = require('http').Server( app );
var io = socketIo( server );

    // binding to 0.0.0.0 allows connections from any other computer in the network
    // to your ip address
var ipAddress = process.env.IP || '0.0.0.0';
var port = process.env.PORT || 4000;

app.use( express.static( __dirname +'/game' ) );
app.use( '/admin', express.static( __dirname +'/admin' ) );


server.listen( port, ipAddress, function () {

    console.log('game server started on localhost:'+ port );

    new GameEngine( io );
} );