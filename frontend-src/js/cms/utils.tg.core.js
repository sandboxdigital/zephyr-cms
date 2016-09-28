
    var Tg = {
        log : function (msg) {
            // trace a message to the browser console (must be enabled in firebug
            if (typeof window.console !== 'undefined') {
                window.console.log(msg);
            }
        }
    };

    Tg.Debug = {};

