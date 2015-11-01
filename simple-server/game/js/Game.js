(function ( ManicGame, DepressedGame ) {

    var dl = document.location;
    var socketServer = dl.origin;
    var socket = io( socketServer );

    var $gameContainer = $('#app'); // for rendering the intro/outro etc
                                    // The 3D game is rendered in a body > canvas

    var Game = {

        setup: function () {

            socket.on('reset', Game.handleReset );
            socket.on('playertaken', Game.handlePlayerTaken );

            socket.on('lost', Game.handleLost );
            socket.on('won', Game.handleWon );

            Game.createChooser();
            
            // Preload the audio
            createjs.Sound.registerSound("audio/threebirds.mp3", "story");
            
        },

        createChooser: function () {

            // TODO: hide irrelevante knopjes wanneer iemand later de pagina bezoekt
            $gameContainer.append( ''.concat(
                '<h1>Choose your player</h1>',
                '<button id="manic">Light</button>',
                '<button id="depressed">Dark</button>'
            ) );

            // For now, clicking on a button above automatically starts the game
            // by emitting the 'start' event.
            // When merging both worlds emitting the 'start' event should depend
            // on both players having clicked a button

            $('#manic' ).on('click', function () {

                $gameContainer.hide();

                ManicGame.setup( socket );
                socket.emit('login', 'manic');
                
            });

            $('#depressed' ).on('click', function () {

                $gameContainer.hide();

                DepressedGame.setup( socket );
                socket.emit('login', 'depressed');
	        	createjs.Sound.play("story");
	        	
            });
        },

        createIntro: function () {
            // Intro movie? Animated Gif?
        },

        createOutro: function () {

        },

        handleLost: function () {

        },

        handlePlayerTaken: function ( playerName ) {
            $('#'+ playerName ).hide(); // hide the button option
        },

        handleReset: function () {

        },

        handleWon: function () {

        }
        
    };


    /****************************/
    Game.setup();
})( window.ManicGame, window.DepressedGame );