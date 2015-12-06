var InnerIntro = function () {

    this.socket = io( document.location.origin );

    this.create();
};

InnerIntro.prototype = {

    create: function () {

        this.video = document.createElement('video');
        this.video.src = '/global/assets/video/hell_intro.mp4';

        document.body.appendChild( this.video );

        if ( this.video.requestFullscreen ) {
            this.video.requestFullscreen();
        } else {
            if ( this.video.mozRequestFullScreen ) {
                this.video.mozRequestFullScreen();
            } else {
                if ( this.video.webkitRequestFullscreen ) {
                    this.video.webkitRequestFullscreen();
                }
            }
        }

        this.video.addEventListener( 'ended', function () {

            var video = this.video;

            video.webkitExitFullScreen();
             $( video ).fadeOut( 2000, function () {

                 document.body.removeChild( video );
             } );

             this.socket.emit( 'intro-finished' );

        }.bind( this ), false );

        this.video.play();
    }
};