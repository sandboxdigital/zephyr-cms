/* globals CMS, Class, Tg, $, Form, tinymce, tinyMCE */

var CMS = {
    Defaults : {}
};

CMS.Object = Class.extend({
    name:'Cms.Object',
    log:function (s, data) {
        Tg.log(this.name+'.'+s);
        if (data) {
            Tg.log(data);
        }
    }
});

CMS.Defaults.File = {
    uploadUrl: '/file/upload'
};

CMS.selectFile = function (options) {
    Tg.log('CMS.SelectFile');

    Tg.log('CMS.SelectFile -> adding');
    jQuery('body').append('<input type="file" id="tempFile" style="visibility: hidden">');

    jQuery('#tempFile').change(function () {
            Tg.log('change');

            var fileSelect = jQuery('#tempFile').get(0);
            var files = fileSelect.files;
            var formData = new FormData();

            // Loop through each of the selected files.
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                // Check the file type.
                // if (!file.type.match('image.*')) {
                //     continue;
                // }

                // Add the file to the request.
                formData.append('file', file, file.name);
            }

            $.ajax({
                url: CMS.Defaults.File.uploadUrl,
                type: 'POST',
                cache: false,
                // dataType:'text',
                data: formData,
                // cached: false,
                contentType: false,  // tell jQuery not to set contentType
                processData: false,  // tell jQuery not to process the data
                success: function (data) {
                    console.log(data);
                    //alert(data);
                    var file = typeof data === 'object' ? data : JSON.parse(data);
                    options.onSelect(file);
                    jQuery('#tempFile').remove();
                }
            });
        })
        .click();
};

