/* globals CMS, Class, Tg, $, Form, tinymce, tinyMCE */

CMS.Defaults.Form = {
    adapter:'json',
    container: "#formContainer",
    url: '/admin/content/save',
    path: 'cms-form',
    subform: false
};

CMS.Form = CMS.Object.extend({
    name:'CMS.Form',
    formXml: null,
    container: null,
    fields: null,
    id: "",
    path: "",
    elPath: "",
    type: "form",
    options: null,
    input: null,

    init: function (options) {
        this.log('init');
        this.setOptions (options);
        this.container = jQuery(this.options.container);

        this.path = this.options.path;
        this.elPath = this.options.path;

        if (this.options.subform) {
            this.log('subForm');
            this.input = jQuery(this.options.input + '');
            if (this.options.input && this.input.length > 0) {
                var form = this.input.parents('form');
                if (form.length === 0) {
                    alert ('Subform set but parent form not found');
                } else {
                    jQuery(form).submit(this.onSubmit.bind(this));
                }
            } else {
                alert ('Subform set but input not found. Expecting: '+this.options.input);
            }
        }
    },

    setOptions: function (options) {
        this.options = $.extend([], CMS.Defaults.Form, options);

        this.log('setOptions');
        Tg.log(this.options);
    },

    clear: function () {
        CMS.TinyMce.unregisterAll ();

        // unload all fields
        this.fields = [];

        this.render();
        this.renderDone();
    },
    
    load : function (data, callback) {
        this.log('load');

        this.clear();

        if (this.options.adapter === 'xml')
        {
            var adapter = new CMS.Form.Adapter.Xml();
            adapter.loadXml (this, data, callback);
        } else if (this.options.adapter === 'json')
        {
            alert('Json loading not supported yet');
        } else {
            alert('No adapter defined');
        }
    },

    loadFile : function (file, callback) {
        this.log('loadFile');

        this.clear();

        if (this.options.adapter === 'xml')
        {
            var adapter = new CMS.Form.Adapter.Xml();
            adapter.loadXmlFile (this, file, callback);
        } else if (this.options.adapter === 'json')
        {
            alert('Json loading not supported yet');
            //CMS.Form.Adapter.Json.loadXmlFile(this, file, callback);
        } else {
            alert('No adapter defined');
        }
    },

    render: function () {
        this.log('render');

        var output = '';
        if (!this.options.subform) {
            output += '<form class="cmsFormForm" method="post">';
        }

        output += '<div class="cms-form">';

        $.each(this.fields, function (id) {
            output += this.render();
        });

        if (this.options.subform === false && this.options.hidesave === false) {
            output += '<div><input type="button" id="cmsFormSave" value="Save" /> <input type="button" id="cmsFormSaveClose" value="Save &amp; Close" /></div>';
        }
        output += '</div>';

        if (!this.options.subform) {
            output += '</form>';
        }

        this.container.html(output);

        var _this = this;
        $('#cmsFormSave').click($.proxy(this.save, this));
        $('#cmsFormSaveClose').click($.proxy(this.saveAndClose, this));
    }

    , renderDone: function () {
        $.each(this.fields, function (id) {
            this.renderDone();
        });
    }

    // TODO - move to adapter
    , populate : function (xmlString) {
        this.log('populate');
        xmlString = unescape(xmlString);

        var xml = CMS.Xml.parseXml(xmlString);

        xml = jQuery(xml).children()[0];
        var _this = this;

        $(xml).children().each(function (key) {
            var id = $(this).attr("id");
            if (_this.fields[id]) {
                _this.fields[id].populate(this);
            }

        });
    },

    populateFromFile : function (file) {
        this.log('populateFromFile');
        var that = this;
        CMS.Ajax.loadFile(file, function (success, data) {
            // console.log ('populateFromFile');
            // console.log (success);
            // console.log (data);
            if (success) {
                that.populate(data);
            }
        });
    },

    isValid: function () {
        tinyMCE.triggerSave();
        $.each(this.fields, function (id) {
            var valid = this.isValid();
        });

        return true;
    },

    toXml: function () {
        var xmlDoc = CMS.Xml.createXml('data');
        var el = xmlDoc.childNodes[0];
        try {
            if (this.fields) {
                $.each(this.fields, function (id) {
                    el.appendChild(this.toXml(xmlDoc));
                });
            }
            //            c(xmlDoc)
            return CMS.Xml.xmlToString(xmlDoc);
        } catch (e) {
            alert (e.message);
            return false;
        }
    }
    
    // TODO - add toJson
    , debug: function (containerId) {
        var output = "";

        output = 'Fields: ' + Object.keys(this.fields).length + '\n';

        $.each(this.fields, function (id) {
            output += this.debug(2);
        });

        if (containerId !== null) {
            jQuery(containerId).html("<pre>" + output + "</pre>");
        }

        return output;
    }

    // TODO - change to use adapter
    , onSubmit: function () {
        this.log('onSubmit');
        console.log (this);
        // try {
            var valid = this.isValid();

            if (valid) {
                this.log('onSubmit valid');
                var xml = this.toXml();

                console.log(xml);

                this.input.val(xml);

                return true;
            } else {
                this.log('onSubmit notvalid');
                return false;
            }
        // } catch (e) {
        //     Tg.log(e);
        //
        //     return false;
        // }
    }

    // TODO - move to a subclass

    , onSave: function (response) {
        jQuery('#cmsFormSave').show();

        if (this.options.onSave) {
            this.options.onSave(response);
        }
    }
    
    , save: function () {
        this.isValid();
        var d = this.debug();
        var xml = this.toXml();
        this.saveAjax(xml, this.onSave);
    }

    , saveAndClose: function () {
        this.isValid();
        var xml = this.toXml();
        this.saveAjax(xml, this.onSaveClose);
    }

    , saveAjax: function (xml, onSave) {
        if (xml === false || xml === null || xml.trim() === "") {
            alert('XML not found.\n\nPlease send the content you are trying to upload to your site administrator');
        } else {
            var data = {
                'pageId': this.options.pageId,
                'contentId': this.options.contentId,
                'contentVersion': this.options.contentVersion,
                'cms-form': xml
            };

            $('#cmsFormSave').hide();
            $('#cmsFormSaveClose').hide();

            $.ajax({
                url: this.options.url
                , type: 'POST'
                , dataType: 'json'
                //, dataType: 'script'
                , data: data
                , success: $.proxy(onSave, this)
            });
        }
    }

    , onSaveClose: function () {
        document.location.reload();
    }
});

CMS.Form.Textareas = [];