

    String.prototype.repeat = function(l) {
        return new Array(l + 1).join(this);
    };

    String.prototype.ucWord = function() {
        var newVal = '';
        var val = this.split(' ');
        for ( var i = 0; i < val.length; i++) {
            newVal += val[i].substring(0, 1).toUpperCase()
                + val[i].substring(1, val[i].length) + ' ';
        }
        return newVal;
    };
