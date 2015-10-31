/**
 * Simple httpServer request handler for serving files from the server root
 */
var fs = require('fs'),
    util = require('util'),
    DEFAULTS = {
        log: true,
        indexFile: 'index.html',
        rootFile: 'index.html',
        root: __dirname
    },
    mime;

try{
    mime = require('mime');//https://github.com/bentomas/node-mime
}catch(e){
    console.log(''.concat('mime module not found! using a basic version that supports ',
                          'html, js, css, jpg, png, gif, json, xml and defaults to text/plain'));
    mime = {
        lookup: function(fileName){
            var ext = fileName.split('.').pop();
            switch(ext){
                case "jpg": case "jpe": case "jpeg": return "image/jpeg"; break;
                case "png": return "image/png"; break;
                case "gif": return "image/gif"; break;
                case "js": return "application/javascript"; break;
                case "json": return "application/json"; break;
                case "css": return "text/css"; break;
                case "html": case "htm": return "text/html"; break;
                case "dae": case "xml": return "text/xml"; break;
            }
            return "text/plain";
        }
    };
}

/**
 * Setup returns a file serving handler you can use as callback in http.createServer
 *
 * @param config Hash of options
 *  @option log {Boolean} log statistics, default true
 *  @option indexFile {String} Which file to serve in case of a directory request, default index.html
 *  @option rootFile {String} Which file to serve on a server root request, default index.html
 *  @option root {String} The root from which to serve files, default to __dirname
 */
exports.setup = function(config){

    return function(){
        this.config = extend({}, DEFAULTS, config);
        handler.apply(this, arguments);
    }
};


//private delegate
function handler(request, response){

    var config = this.config;

    var file = request.url.split('?')[0];
    if (file.indexOf('/../') === 0 || file === '/'){
        file = '/'+ config.rootFile;

    }else if(file.lastIndexOf('/') === file.length-1){
        file += config.indexFile;//directory request, maybe it has an index
    }

    file = config.root + file;

    if(config.log){util.log('serving '+ file);}

    fs.stat(file, function onStats(err, stats){
        if(stats && stats.isFile()){

            var contentType = 'text/plain';
            if(mime){
                contentType = mime.lookup(file);
            }
            response.writeHead(200, {'Content-Type':contentType});

            var fileStream = fs.createReadStream(file);
                fileStream.on('error', function(err){
                    if(config.log){
                        util.log(err);
                    }
                });
                fileStream.pipe(response);
        }else{
            response.writeHead(404, {'Content-Type':'text/plain'});
            response.end('File not found');
            if(config.log){
                util.log('File not found: '+ file);
            }
        }
    });
}

/**
 * modified version of http://ejohn.org/blog/javascript-getters-and-setters/
 * allow for an indefinite number of source objects
 */
function extend(a){

    Array.prototype.slice.call(arguments, 1).forEach(function(b){

        for(var i in b){
            var g = b.__lookupGetter__(i), s = b.__lookupSetter__(i);

            if ( g || s ) {
                if ( g ){
                    a.__defineGetter__(i, g);
                }
                if ( s ){
                    a.__defineSetter__(i, s);
                }
            }else{
                 a[i] = b[i];
            }
        }
    });
    return a;
}