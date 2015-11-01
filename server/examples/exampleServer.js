var http = require('http'),
    fileServingHandler = require('./fileServingHandler').setup({
        rootFile: "examples.html",
        log: false
    }),
    mob = require('../lib/module.js');

var server = http.createServer(fileServingHandler); //add a simple file serving handler
    server.listen( 8080, '0.0.0.0' );


mob.addChannel('Amazed', __dirname+'/amazed/amazedChannel.js');
mob.addChannel('SimpleChat', __dirname+'/simpleChat/simpleChatChannel.js');
mob.addChannel('DuckPond', __dirname+'/duckpond/duckPondChannel.js');

mob.init(server);

console.log('running the mob on 8080 street');