/* globals CMS, Class, Tg, $, Form, tinymce, tinyMCE */

let CMS = {
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

            options.onStart();

            let fileSelect = jQuery('#tempFile').get(0);
            let files = fileSelect.files;
            let formData = new FormData();

            // Loop through each of the selected files.
            for (let i = 0; i < files.length; i++) {
                let file = files[i];

                // Check the file type.
                // if (!file.type.match('image.*')) {
                //     continue;
                // }

                // Add the file to the request.
                formData.append('file', file, file.name);
            }
    
            let xhr = new XMLHttpRequest();
            (xhr.upload || xhr).addEventListener('progress', function(e) {
                let done = e.position || e.loaded;
                let total = e.totalSize || e.total;
                let p =  Math.round(done/total*100);
                // console.log('xhr progress: ' + p + '%');
                options.onProgress(p);

            });
            xhr.addEventListener('load', function(e) {
                console.log('xhr upload complete');
                console.log (e);
                console.log (this.responseText);

                // {
                //    id:'',
                //    url:'',
                //    thumbnailUrl: ''
                //    name:''
                // }

                let data = this.responseText;
                console.log(data);
                //alert(data);
                let file = typeof data === 'object' ? data : JSON.parse(data);
                options.onSelect(file);
                jQuery('#tempFile').remove();
                
            });
            xhr.open('post', CMS.Defaults.File.uploadUrl, true);
            xhr.send(formData);

            // $.ajax({
            //     url: CMS.Defaults.File.uploadUrl,
            //     type: 'POST',
            //     cache: false,
            //     // dataType:'text',
            //     data: formData,
            //     // cached: false,
            //     contentType: false,  // tell jQuery not to set contentType
            //     processData: false,  // tell jQuery not to process the data
            //     success: function (data) {
            //         console.log(data);
            //         //alert(data);
            //         let file = typeof data === 'object' ? data : JSON.parse(data);
            //         options.onSelect(file);
            //         jQuery('#tempFile').remove();
            //     }
            // });
        })
        .click();
};

