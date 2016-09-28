/* globals CMS, $, Form, tinymce, tinyMCE */



CMS.Form.Field.Html = $.inherit(
    CMS.Form.Field,
    {
        __constructor : function(xml, parent) {
            this.__base (xml, parent);
        },
        
        renderField : function() {
            return '<div class="field cmsFormFieldHtml"><textarea type="text" name="' + this.path + '" id="' + this.elPath + '"></textarea></div>';
        }, 
        
        renderDone : function ()
        {
            this.addControl ();
            CMS.Form.Textareas.push (this);
        },
        
        addControl : function ()
        {
            var width = $('#'+this.elPath).outerWidth()-15;
            
            var options = {
                // width:width
            };            
            options = $.extend(options, CMS.Defaults.TinyMce);
            this.ed = new tinymce.Editor(this.elPath, options);
            // this.ed.onBeforeRenderUI.add(function(ed, controlManager) {
            //     ed.controlManager = new ControlManager(this, ed);
            // } .createDelegate(this));

            // this.ed.onPostRender.add(function(ed, controlManager) {
            //     var s = ed.settings;
            //
            //     // Change window manager
            //     ed.windowManager = new WindowManager({
            //         editor: this.ed,
            //         manager: this.manager
            //     });
            // } .createDelegate(this));
            this.ed.render();
            tinyMCE.add(this.ed);
        },
        
        removeControl : function ()
        {
            this.ed.save();
            this.ed.hide();
            //this.ed.destroy();
            //this.ed = null;
//            tinymce.execCommand('mceRemoveControl', false, this.elPath);
            //tinymce.remove(this.elPath);
        },
        
        populate : function (xml) 
        {
            // console.log (xml);
            this.__base(xml);
            if (xml.firstChild) 
            {
                this.setValue(xml.firstChild.data);
            }
        }
        
        ,setValue : function (value) 
        {
            // console.log (this.ed);
            $('#'+this.elPath).val(value);
            var that = this;
            // add a bit of a delay
            setTimeout(function(){
                that.ed.setContent (value);
            },500)
        }
    });



