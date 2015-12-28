
    var FormatDuration = function(a, b) {
        this.duration = a || 0, this.separator = b || ":"
    };
    FormatDuration.prototype = {
        getMilliseconds: function() {
            return this.duration
        },
        getMinutes: function() {
            var a = Math.floor(this.duration / 1e3),
                b = Math.floor(a / 60);
            return b
        },
        getMinutesSeconds: function() {
            var a = Math.floor(this.duration / 1e3),
                b = Math.floor(a / 60),
                c = Math.floor(a % 60);

            return (b < 10 ? '0' + b : b) + this.separator + (c < 10 ? '0' + c : c)
        },
        getHoursMinutesSeconds: function() {
            var a = Math.floor(this.duration / 1e3),
                b = Math.floor(a / 3600),
                c = Math.floor(a % 3600 / 60),
                d = Math.floor(a % 3600 % 60),
                e = this.separator + (d < 10 ? "0" + d : d);
            c > 0 ? (e = c + e, b > 0 && (e = b + this.separator + (c < 10 ? "0" + e : e))) : e = "0" + e;
            return e
        }
    };