(function ( ThreeDeeWorld ){


    var socket;

    /***************************************************************
     * Manic Player
     */


    /***************************************************************
     * ManicGame
     */

    var ManicGame = {

        setup: function ( socketConnection ) {

            socket = socketConnection;
			
            socket.on('grid', ManicGame.handleGrid );
            
            socket.on('start', ManicGame.handleStart );
            socket.on('won', ManicGame.handleWon );
            socket.on('lost', ManicGame.handleLost );
        },

        handleGrid: function ( gridData ) {
            console.log( 'grid received', gridData );
        },
		
		handleStart: function () {

            ManicGame.createIntro();
        },
        
        createIntro: function () {
	        console.log('Showing Intro');
	        
            // Intro movie? Animated Gif? 3D world?
            createjs.Sound.registerSound("audio/soundscape-outside-man-final.mp3", 'soundMan');
            
            var introVideo = document.getElementById('introVideo');
            $(introVideo).fadeIn();
            $(introVideo).attr({'src': 'video/intro.mp4'});
            
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
                    
                });
                
                socket.emit('intro-finished');
	        	createjs.Sound.play('soundMan');
	        }, false);
        },
        
        handleWon: function () {
	        console.log('WON!');
			createjs.Sound.stop('soundMan');
			
			
			var winVideo = document.getElementById('winVideo');
            $(winVideo).fadeIn();
            $(winVideo).attr({'src': 'video/explosion_ending.mp4'});
            
			if (winVideo.requestFullscreen) {
				winVideo.requestFullscreen();
			} else if (winVideo.mozRequestFullScreen) {
				winVideo.mozRequestFullScreen();
			} else if (winVideo.webkitRequestFullscreen) {
				winVideo.webkitRequestFullscreen();
			}
            winVideo.play();
            
        },
        
        handleLost: function() {
	        console.log('LOST');
        },
        
        start: function () {

            // create the 3D world

            console.log('we can start creating the Manic game!');

            ThreeDeeWorld.createGameWorld();

            ManicGame.render();
        },

        render: function () {

            requestAnimationFrame( ManicGame.render );

            // do ManicGame specific stuff

            ThreeDeeWorld.render();
        }
    };


    window.ManicGame = ManicGame;

})( window.ThreeDeeWorld );