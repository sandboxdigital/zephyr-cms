;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(root, require('jquery'));
    } else {
        root.SandboxCMS = factory(root.jQuery || root.Zepto);
    }
}(this, function($) {

    <%= contents %>

    return CMS;
}));

