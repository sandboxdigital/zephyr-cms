/* globals Tg, CMS, $, Form, tinymce, tinyMCE */


CMS.Form.Field = $.inherit(
    {
        id: "",
        type: "",
        path: "",
        label: "",
        parent: null,
        uid:'',
        value: null,
        fields: null,
        required: false,
        loaded:false,
        adapter:null,

        __constructor: function (parent) {
            this.parent = parent;
        }

        ,load : function ()
        {
            if (this.uid === undefined || this.uid === '' || this.uid === null)
            {
                // TODO - add check to see if this uid is infact unique
                this.uid = CMS.Utils.guidGenerator();
            }

            if (this.parent.path) {
                this.path = this.parent.path + "[" + this.id + "]";
                this.elPath = this.parent.elPath + "_" + this.id;
            } else {
                this.elPath = this.path = this.id;
            }
        }

        ,render: function () {
            return '<div class="cmsRow">' +this.renderLabel() + this.renderField() + '</div>';
        }

        ,renderDone: function () {

        }

        ,renderLabel: function () {
            return '<div class="cmsLabel"><label>' + this.label + '</label></div>';
        }

        ,renderField: function () {
            return '<div class="cmsField"><input type="hidden" name="' + this.path + '" id="' + this.elPath + '" /></div>';
        }

        ,debug: function (indent) {
            return "\t".repeat(indent) + "Field " + this.type + ", id:" + this.id + ", path:" + this.elPath + ", value:" + this.value + "\n";
        }
        
        ,setValue : function (value) 
        {
            this.value = value;
            $('#'+this.elPath).val(this.value);            
        }
            
        ,getValue : function ()
        {
            if (this.value) {
                return CMS.Utils.stripInvalidXmlChars(this.value);
            } else {
                return '';
            }
        }

        ,isValid: function () {
            // get value from form
            this.value = $('#' + this.elPath).val();

            // validate
            this.valid = true;

            // validate children (if we have them)
            var valid = this.valid;
            if (this.fields) {
                $.each(this.fields, function (id) {
                    if (!this.isValid()) {
                        valid = false;
                    }
                });
            }

            return valid;
        }

        /**********************************
         * XML methods
         **********************************/

        // TODO - change to populateXml

        ,loadXml : function (xml, adapter)
        {
            this.adapter = adapter;
            this.type = xml.nodeName;


            this.id = $(xml).attr("id")+'';
            this.label = $(xml).attr("label") ? $(xml).attr("label") : this.id.ucWord();
            this.required = $(xml).attr("required") ? $(xml).attr("required") === "true" : false;
            this.uid = $(xml).attr("uid");
            this.namespace = $(xml).attr("namespace");

            this.load();
        }

        ,populate: function (xml)
        {
            this.uid = $(xml).attr("uid");
            if (this.uid === undefined || this.uid === '' || this.uid === null)
            {
                // TODO - add check to see if this uid is infact unique
                this.uid = CMS.Utils.guidGenerator();
            }
        }

        ,toXml: function (xmlDoc)
        {
            var el = xmlDoc.createElement(this.type);
            el.setAttribute("id", this.id);
            el.setAttribute("uid", this.uid);
            el.setAttribute("namespace", this.namespace);

            if (this.value) {
                var newCDATA = xmlDoc.createCDATASection(this.getValue());
                el.appendChild(newCDATA);
            }

            if (this.fields) {
                $.each(this.fields, function (id) {
                    el.appendChild(this.toXml(xmlDoc));
                });
            }

            return el;
        }    
    });
