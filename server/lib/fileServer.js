/**
 * Fileserver adapted from NowJS. Serves Mob's client API files.
 * @see https://github.com/Flotype/now
 */

var fs = require('fs'),
    mobUtil = require('./mobUtil'),

    fileCache = {},
    mobFileCache = {},

    defaultListeners,
    server,
    options;


/**
 * Wraps the Mob server to handle a request for Mob's client API files
 */
function wrapServer (httpServer, serverOptions) {
    server = httpServer;
    options = serverOptions || {client: {}};
    options.client = JSON.stringify(options.client);

    defaultListeners = server.listeners('request');

    server.removeAllListeners('request');
    server.on('request', handleResponse);
}

/**
 * httpResponse handler, handle request for Mob's API files or pass it through
 */
function handleResponse(request, response) {

    if (request.method === 'GET') {

        var regExp = /^\/mob\/([^\.]+\.js)$/;
        var filePath = request.url.split('?')[0];

        if (regExp.test(filePath)) {
            serveFile(__dirname +'/client/'+ (filePath.match(regExp)[1]), request, response, options);

        }else{
            handleDefaultResponse(request, response);
        }
    }else{
        handleDefaultResponse(request, response);
    }
}

function handleDefaultResponse(request, response){
    for (var i in defaultListeners) {
        if (mobUtil.hasProperty(defaultListeners, i)) {
            defaultListeners[i].call(server, request, response);
        }
    }
}


function serveFile(filename, request, response, options) {

    if (filename.indexOf('/mob.js') !== -1) {

        // Write file from cache if possible
        if (mobUtil.hasProperty(mobFileCache, request.headers.host)) {

            // write file from cache
            response.writeHead(200, {'Content-Type': 'text/javascript'});
            response.write(mobFileCache[request.headers.host].now);
            response.end();
        } else {

            // determine hostname / port if not given in options
            var host = request.headers.host.split(':');

            var gclOptions = {
                protocol : 'http',
                host : host[0],
                port : host[1] || '80'
            };
            mobUtil.extend(gclOptions, options);

            // call generate client libs, which takes the desired host/port and API scope
            generateClientLibs(gclOptions, function (mobText) {

                response.writeHead(200, {'Content-Type': 'text/javascript'});
                response.write(mobText);
                response.end();

                mobFileCache[request.headers.host] = {now: mobText};
            });
        }
    } else {
        // for any other filename, read file and serve (not cached)
        fs.readFile(filename, function (err, data) {
            if(data){
                var text = data.toString();
                response.writeHead(200);
                response.write(text);
                response.end();
                fileCache[filename] = text;
            }
        });
    }
}

/**
 * Adds client API execution to the client API library.
 * @param options
 * @param callback
 */
function generateClientLibs(options, callback) {

    fs.readFile(__dirname + '/client/mob.js', function (err, data) {
        var mobText = data.toString();
        var initString = '({scope:'+ options.scope +', '+
                            'protocol:\''+ options.protocol +'\','+
                            'host:\''+ options.host +'\','+
                            'port:'+ options.port +
                           '}, \''+ options.protocol + '://' + options.host + ':' + options.port + '\');\n';
        mobText += initString;

        callback(mobText);
    });
}

exports.wrapServer = wrapServer;
exports.generateClientLibs = generateClientLibs;