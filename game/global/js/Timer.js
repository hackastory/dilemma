var Timer = Stapes.subclass({

    constructor: function ( duration ) {

        this.duration = duration;
        this.active = false;
    },

    checkProgress: function () {
        if ( this.active ) {
            this.emit( 'progress', Date.now() - this.startTime );
        }
    },

    checkTimer: function () {

        var difference = this.duration - (Date.now() - this.startTime);
        var to;

        if ( this.active ) {
            if ( difference <= 0 ) {
                this.emit('end');
            } else {
                if ( difference > 500 ) {
                    to = Math.floor( difference / 2 );
                } else {
                    to = difference;
                }
                this.timeOut = setTimeout( function () {
                    this.checkTimer();
                }.bind( this ), to );
            }
        } else {
            if ( this.timeOut ) {
                clearTimeout( this.timeOut );
            }
        }
    },

    start: function () {
        this.active = true;

        this.startTime = Date.now();
        this.checkTimer();
        this.intervalProgress = setInterval( this.checkProgress.bind( this ), 100 );
    },

    stop: function () {
        this.active = false;
        if ( this.timeOut ) {
            clearTimeout( this.timeOut );
        }
        if ( this.intervalProgress ) {
            clearInterval( this.intervalProgress );
        }
    }
});