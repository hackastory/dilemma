/**
 * Mob - client side API
 */
(function ( options, uri ) {

    var socket;
    var scope = options.scope || window, dependencies = [ {
                loaded: function () {
                    return (typeof JSON !== "undefined");
                }, path: uri + '/mob/json.js'
            }, {
                loaded: function () {
                    return (typeof io !== "undefined");
                }, path: uri + '/socket.io/socket.io.js'
            } ], mobReady = false;


    var util = {

        _events: {},

        hasProperty: function ( obj, prop ) {
            return Object.prototype.hasOwnProperty.call( Object( obj ), prop );
        },

        proxy: function ( scope, handler ) {
            return function () {
                handler.apply( scope, arguments );
            };
        },

        // Event code from socket.io
        on: function ( name, fn ) {
            if ( !(util.hasProperty( util._events, name )) ) {
                util._events[ name ] = [];
            }
            util._events[ name ].push( fn );
            return util;
        },

        emit: function ( name, args ) {
            if ( util.hasProperty( util._events, name ) ) {
                var events = util._events[ name ].slice( 0 );
                for ( var i = 0, ii = events.length; i < ii; i++ ) {
                    events[ i ].apply( util, args === undefined ? [] : args );
                }
            }
            return util;
        },

        removeEvent: function ( name, fn ) {
            if ( util.hasProperty( util._events, name ) ) {
                for ( var a = 0, l = util._events[ name ].length; a < l; a++ ) {
                    if ( util._events[ name ][ a ] === fn ) {
                        util._events[ name ].splice( a, 1 );
                    }
                }
            }
            return util;
        },

        parseMessage: function ( msg ) {

            var parsed = {
                action: "", data: ""
            };

            try {
                var json = util.parse( msg );

                if ( json.action ) {
                    parsed.action = json.action;
                }
                if ( json.data ) {
                    parsed.data = json.data;
                }

            } catch ( e ) {}

            return parsed;
        },

        createMessage: function ( action, data ) {

            var msg = {
                action: action, data: (typeof data != "undefined") ? data : ""
            };
            return util.stringify( msg );
        },

        resolveDependencies: function ( dependencies, resolvedCallback ) {

            var depsLoaded = 0, dl = dependencies.length;

            function scriptLoaded () {
                depsLoaded++;
                if ( depsLoaded == dl ) {
                    resolvedCallback();
                }
            }

            for ( var d = 0; d < dl; d++ ) {
                var dep = dependencies[ d ];
                if ( dep.loaded() ) {
                    scriptLoaded();
                    continue;
                }

                util.loadScript( dep.path, scriptLoaded );
            }
        },

        loadScript: function ( path, callback ) {
            var loaded = false, onLoad = function () {
                        if ( !loaded ) {
                            loaded = true;
                            callback();
                        }
                    };

            var script = document.createElement( 'script' );
            script.setAttribute( 'type', 'text/javascript' );
            script.setAttribute( 'src', path );
            script.onload = onLoad;
            script.onreadystatechange = function () {
                if ( script.readyState === 'loaded' || script.readyState === 'complete' ) {
                    onLoad();
                }
            };

            document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );
        },

        onDependenciesResolved: function () {

            util.parse = mob.util.parse = JSON.parse;
            util.stringify = mob.util.stringify = JSON.stringify;

            socket = io.connect( options.protocol + '://' + options.host );
            socket.on( 'connect', function () {

                mob.send = function () {
                    socket.send.apply( socket, arguments );
                };
                mob.clientId = socket.socket.id;
                lib.handleNewConnection( socket );

                util.emit( 'connect' );

                mobReady = true;
                util.emit( 'ready' );
            } );
        }
    };


    var lib = {
        handleNewConnection: function ( client ) {
            if ( client.handled ) {
                return;
            }
            client.handled = true;

            client.on( 'message', function ( data ) {
                util.emit( 'message', [ data ] );
            } );
            client.on( 'disconnect', function () {
                util.emit( 'disconnect' );
            } );
            client.on( 'error', function () {
                util.emit( 'error' );
            } );
            client.on( 'retry', function () {
                util.emit( 'retry' );
            } );
            client.on( 'reconnect', function () {
                util.emit( 'reconnect' );
            } );
            client.on( 'reconnect_failed', function () {
                util.emit( 'reconnect_failed' );
            } );
            client.on( 'connect_failed', function () {
                util.emit( 'connect_failed' );
            } );
        }
    };

    /**
     * Exposed API
     */
    var mob = {
        ready: function ( func ) {
            if ( arguments.length === 0 ) {
                util.emit( 'ready' );
            } else {
                if ( mobReady ) {
                    func();
                } else {
                    util.on( 'ready', func );
                }
            }
        }, clientId: null, on: util.on, util: {
            proxy: util.proxy, createMessage: util.createMessage, parseMessage: util.parseMessage
        }, options: options, removeEvent: util.removeEvent
    };


    util.resolveDependencies( dependencies, util.onDependenciesResolved );

    scope.mob = mob;

    /*
        function execution of this anonymous one is appended to this file by the mob server:
        })( options, uri );
     */
})