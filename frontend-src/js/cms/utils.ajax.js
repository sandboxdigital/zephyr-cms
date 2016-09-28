/* globals CMS, Class, Tg, $, Form, tinymce, tinyMCE */

CMS.Ajax = {
    loadFile: function (url, callback) {
        $.ajax({
            type: "GET",
            url: url,
            dataType: "html",
            success: function (response) {
                callback (true, response);
            }
        });
    }
};