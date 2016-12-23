/* globals CMS, Class, Tg, $, Form, tinymce, tinyMCE */

    if (CMS.Form.Adapter === undefined)
    {
        CMS.Form.Adapter = {};
    }

    CMS.Form.Adapter.Xml = CMS.Object.extend({
        name:'CMS.Form.Adapter.Xml',

        init: function (options) {

        },

        loadXmlFile: function (form, url, callback) {
            this.log('loadXmlFile');

            var that  = this;
            $.ajax({
                type: "GET",
                url: url,
                dataType: "html",
                success: function (response) {
                    that.loadXml(form, response, callback);
                }
            });
        },

        loadXml: function (form, xmlString, callback) {
            this.log('loadXml');
            // unload all fields
            form.fields = [];

            xmlString = unescape(xmlString);

            var xml = CMS.Xml.parseXml(xmlString);

            var formXml = $(xml).children()[0];

            var multilingual = $(this.formXml).attr('multilingual') === 'true' ? true : false;

            if (multilingual)
            {
                this.languages = $(this.formXml).attr('languages').split(',');
                var self = this;

                var block = $(self.formXml).find(' > block#lang').detach();

                if (block.length < 0) {
                    alert('Multilingual form must have a single block with id=lang');
                }

                $(this.languages).each(function (key) {
                    var lang = this;
                    var newBlock = $(block).clone().attr('id',lang);
                    $(self.formXml).append(newBlock);
                });

                Tg.log (this.formXml);
            }

            this.loadFields(formXml, form);

            form.render();
            form.renderDone();


            if (callback) {
                console.log ('done');
                callback ();
            }
        },

        loadFields : function (xml, parent) {
            console.log (xml);
            parent.fields = {};

            var _this = this;
            $(xml).children().each(function (key) {
                var field = _this.loadField(this, parent);
                if (field) {
                    parent.fields[field.id] = field;
                }
            });
        },

        loadField : function (xml, parent, settings) {
            settings = settings || {};
            var field = null;
            try {
                // TODO - change so we're not using eval
                var evals = "new CMS.Form.Field." + xml.nodeName.ucWord() + "(parent, settings);";
                console.log (evals);
                field = eval(evals);
                field.loadXml(xml, this);
            } catch (e) {
                 Tg.log(e);
                 Tg.log (xml);
                 alert('Unknown field ' + xml.nodeName + ', try including cms.form.field.' + xml.nodeName + '.js');
            }

            return field;
        },


        populateXml: function (form, xmlString) {
            //c("!2");
            xmlString = unescape(xmlString);
            //xmlString = urldecode(xmlString);

            this.handlePopulate(CMS.Form.parseXml(xmlString));
        },

        handlePopulate: function (xml) {
            xml = $(xml).children()[0];
            var _this = this;

            $(xml).children().each(function (key) {
                var id = $(this).attr("id");
                if (_this.fields[id]) {
                    _this.fields[id].populate(this);
                }
            });
        }
    });