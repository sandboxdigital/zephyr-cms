
(function ($) { // hide the namespace


    jQuery.fn.hasAttr = function (attr) {
        var attribVal = this.attr(attr);
        return (attribVal !== undefined) && (attribVal !== false);
    };

})(jQuery);
