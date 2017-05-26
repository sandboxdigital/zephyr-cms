/* globals Tg, CMS, jQuery, Form, tinymce, tinyMCE */

CMS.Form.Field.FileDefaults = {
    uploadUrl:"/file/upload",
    shimName:"swfShim",
    swfUrl:"/core/flash/swfupload.swf",
    debug:false,
    sizeLimit:"32000",
    fileTypes : "*.jpg;*.gif;*.png;*.flv;*.f4v;*.mp3;*.pdf"
};

CMS.Form.Field.File = $.inherit(
    CMS.Form.Field,
    {
        url: null,
        name: null,
        fileTypes: null,
        fileUpload : null,
        file : null,

        __constructor: function (parent) {
            this.__base(parent);
        },

        loadXml : function (xml) {
            this.__base(xml);

            this.fileTypes = jQuery(xml).attr("fileTypes") ? jQuery(xml).attr("fileTypes") : CMS.Form.Field.FileDefaults.fileTypes;
            this.sizeLimit = jQuery(xml).attr("sizeLimit") ? jQuery(xml).attr("sizeLimit") : CMS.Form.Field.FileDefaults.sizeLimit;
        },

        renderField: function () {
            let output = '<div class="FormFile" style="width:98%;"><div class="FormFilePreviewTable" style="float:left;"><table id="' + this.elPath + '_table"></table></div>';
            output += '<div id="'+this.elPath + '_FormFileButtons" class="FormFileButtons" style="float:left;"><div id="' + this.elPath + '_progress"></div><div>';
            output += '<input id="' + this.elPath + '_btnSelect" type="button" class="' + this.elPath + '_btnSelect btnSelect" value="Select file" />';
            output += '<input id="' + this.elPath + '_btnCancel" type="button" class="' + this.elPath + '_btnCancel btnCancel" value="Cancel upload" style="display:none;" />';
            output += '</div></div></div>';

            return '<div class="cmsField">' + output + '</div>';
        },

        renderDone: function () {
            Tg.log('#'+this.elPath + '_btnSelect');
            let el = jQuery('#'+this.elPath + '_btnSelect');
            el.click(this.showFileBrowser.bind(this));
        }    

        ,populate: function (xml) {
            this.__base(xml);
            if (jQuery(xml).attr('fileUrl')) {
                let file = {
                    url :jQuery(xml).attr('fileUrl'),
                    name :jQuery(xml).attr('fileName'),
                    thumbnailUrl :jQuery(xml).attr('fileThumbnailUrl'),
                    id :jQuery(xml).attr('fileId')
                };
                                
                this.addFile (file);
            }
        }
        
        ,showFileBrowser : function ()        
        {
            Tg.log('#'+this.elPath + '.showFileBrowser');
            CMS.selectFile ({
                onStart : this.onStart.bind(this),
                onProgress : this.onProgress.bind(this),
                onSelect: this.addFile.bind(this),
            });
        }    
        
        ,setValue : function (value) 
        {
            this.addFile(value);
        }
        
        ,addFile : function (file) 
        {
            jQuery('#' + this.elPath + '_progress').hide();
            // file = {
            //    id:'',
            //    url:'',
            //    thumbnailUrl: ''
            //    name:''
            // }


            this.file = file;
            
            this._preview  = jQuery('#' + this.elPath + '_table');

            this._preview.empty();
    
            let url = file.url;
            // if (file.thumbnailUrl !== undefined)
            // {
            //     url = file.thumbnailUrl;
            // }
            let ext = Tg.FileUtils.getExtension(url);

            if (ext !== "jpg" && ext !== "jpeg" && ext !== "png" && ext !== "gif") {
                // TODO - this path should be set via config
                url = "/core/images/fileicons/" + ext + ".png";
            }
            
            let html = '<tr id="fileUploadRow' + this._id + '">';
            html += '<td class="fileUploadThumbnail"><img id="' + this._id + '_image" src="' + url + '"  /></td>';
            html += '<td id="' + this._id + '_name" class="fileUploadName">' + file.name + '</td>';
            html += '<td class="fileUploadDelete">';
            html += '<a href="#" class="formFileUploadDelete">Remove this file</a>';
            html += '</td>';
            html += '</tr>';

            this._preview.append(html);
            
            this._preview.find('.formFileUploadDelete').bind('click', this.handleFileDelete.bind(this));

            jQuery('#'+this.elPath + '_btnSelect').val('Change file').show();

            jQuery('#'+this.elPath + '_FormFileButtons').css({float:'right'});
        },

        onStart () {
            jQuery('#' + this.elPath + '_progress').show();
            jQuery('#' + this.elPath + '_btnSelect').hide();
        },

        onProgress (percent) {
            jQuery('#' + this.elPath + '_progress').html(percent+'%');
        },
        
        handleFileDelete : function (ev)
        {
            if (confirm ('Are you sure you want to remove this file?'))
            {
                this.file = null;
                jQuery(ev.currentTarget).parent().parent().fadeOut ();
            }
            return false;
        }

        ,debug: function (indent) {
            let s = "\t".repeat(indent) + "Field " + this.type + ", id:" + this.id + ", path:" + this.elPath + ", value:" + this.value;
            
            if (this.file) {
                s += ", file:" + this.file.id;
            }
            s+="\n";
            
            return s;            
        }

        ,toXml: function (xmlDoc) {      
            let el = xmlDoc.createElement(this.type);
            el.setAttribute("id", this.id);
            el.setAttribute("uid", this.uid);
            el.setAttribute("namespace", this.namespace);
            
            if (this.file !== null) {
                el.setAttribute("fileId", this.file.id);
                el.setAttribute("fileUrl", this.file.url);
                el.setAttribute("fileName", this.file.name);
                el.setAttribute("fileThumbnailUrl", this.file.thumbnailUrl);
            }

            return el;
        }
    });

