(function ( ManicGame, DepressedGame, PlayerChooser, ThreeDeeWorld ) {

    var dl = document.location;
    var socketServer = dl.origin;

    var socket = io( socketServer );

    var $gameContainer = $('#app');

    var Game = {

        setup: function () {
        
            socket.on('reset', Game.handleReset );
            socket.on('playertaken', Game.handlePlayerTaken );
            socket.on('start', Game.handleStart );

            socket.on('lost', Game.handleLost );
            socket.on('won', Game.handleWon );

            ThreeDeeWorld.create();

            Game.createChooser();
        },

        createChooser: function () {

            // Use the 3D Chooser
            PlayerChooser.setup( socket );

            // Or choose one straight away
            //    DepressedGame.setup( socket );
            //    socket.emit('login', 'depressed');

        },

        createIntro: function () {
	        console.log('Showing Intro');
	        
            // Intro movie? Animated Gif? 3D world?
            createjs.Sound.registerSound("audio/backgroundTrack.mp3", 'sound');
            
            var introVideo = document.getElementById('introVideo');
            $(introVideo).fadeIn();
			if (introVideo.requestFullscreen) {
				introVideo.requestFullscreen();
			} else if (introVideo.mozRequestFullScreen) {
				introVideo.mozRequestFullScreen();
			} else if (introVideo.webkitRequestFullscreen) {
				introVideo.webkitRequestFullscreen();
			}
            introVideo.play();
            
            introVideo.addEventListener('ended', function() {
	            $(introVideo).get(0).webkitExitFullScreen();
	        	$(introVideo).addClass('done').fadeOut(2000, function () {

                    console.log('introoo');
                    socket.emit('intro-finished');
                });
	        	createjs.Sound.play('sound');
	        }, false);
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

        handleStart: function () {

            Game.createIntro();
        },

        handleWon: function () {

        }
    };


    /****************************/
    Game.setup();

})( window.ManicGame, window.DepressedGame, window.PlayerChooser, window.ThreeDeeWorld );