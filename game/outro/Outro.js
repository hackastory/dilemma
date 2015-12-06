var Outro = function ( success ) {

    this.socket = io( document.location.origin );
    this.videoSrc = '/global/assets/video/' +( ( success ) ? 'explosion_ending.mp4' : 'explosion_ending.mp4');

    this.create();
};

Outro.prototype = {

    create: function (  ) {

        this.video = document.createElement('video');
        this.video.src = this.videoSrc;

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

             this.socket.emit( 'outro-finished' );

        }.bind( this ), false );

        this.video.play();
    }
};