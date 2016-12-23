/* globals Tg, CMS, $, Form, tinymce, tinyMCE */


CMS.Form.Field.Group = $.inherit(
    CMS.Form.Field,
    {
        options: null,
        fields: null,
        numFields: 0,
        maxFields: 1000000,
        topMenuClicked:false,

        __constructor: function (parent) {
            this.__base(parent);
            this.options = {};
            this.fields = [];
        },
        
        loadXml : function (xml, adapter){
            this.__base(xml, adapter);
            
            var options = {};
            var _this = this;

            this.maxFields = $(xml).attr("max") ? $(xml).attr("max") : 1000000;

            $(xml).children().each(function (key) {
                var option = adapter.loadField(this, _this);
                options[option.id] = option;
            });
            this.options = options;
            this.fields = [];
        },

        debug: function (indent) {
            var output = "    ".repeat(indent) + "Field " + this.type + ", id:" + this.id + ", path:" + this.path + "\n" + "    ".repeat(indent) + "{\n";
            $.each(this.options, function (id) {
                output += this.debug(indent + 1);
            });
            output += "    ".repeat(indent) + "}\n";
            return output;
        },

        populate: function (xml) {
            this.__base(xml);
            var _this = this;
            $(xml).children().each(function (key) {
                var field = _this.addOption($(this).attr("id"), true, this);
//                field.populate(this);
            });
        },

        render: function () {

            var output = "";
            $.each(this.fields, function (id) {
                output += this.render();
            });

            var html = '<div class="cmsRow">';
            html += '<div class="cmsLabel"><label>' + this.label + '</label></div>';
            html += '<div class="cmsField">';
            html += '<div id="' + this.elPath + '-group" class="CMSGroup CMSGroup'+this.id+'"><div class="CMSGroupTitle" id="' + this.elPath + '-title"><div class="CMSLeft">' + this.label + '</div>';
            html += '<a href="#" class="CMSGroupAddTop CMSIconAdd">Add</a>';
            html += '<a href="#" class="CMSGroupCollapse CMSIconHide">Collapse all</a>';
            html += '<a href="#" class="CMSGroupExpand CMSIconShow">Expand all</a>';
//            html += '<a href="#" class="CMSGroupPaste CMSIconPaste">Paste</a>';
//            html += '<a href="#" class="CMSGroupCopy CMSIconCopy">Copy</a>';
            html += '</div>';
            html += '<div class="CMSGroupBody" id="' + this.elPath + '">' + output + '</div>';

            html += '<div class="CMSGroupFooter" id="' + this.elPath + '-footer">';
            //html += '<div class="left"> &gt; ' + this.label + '</div>';
            html += '<a href="#" class="CMSGroupAdd CMSIconAdd">Add</a>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            return html;
        },

        renderDone: function () {
            var bindings = {};
            var html = '<div id="CMSAddMenu' + this.elPath + '"><ul>';
            for (var key in this.options) {
                bindings['cms_add_' + key] = $.proxy(this.onMenuClick, this);
                html += '<li id="cms_add_' + key + '">' + this.options[key].label + '</li>';
            }
            html += '</ul></div>';

            $(html)
                .hide()
                .css({ position: 'absolute', zIndex: '500' })
                .appendTo('body');

            $("#" + this.elPath + '-group a.CMSGroupAdd')
                .contextMenu("CMSAddMenu" + this.elPath, {
                    "bindings": bindings,
                    "menuPosition": "object",
                    "event": "click",
                    "menuAlign": "right",
                    onShowMenu: $.proxy(this.onShowMenu, this)
                });

            $("#" + this.elPath + '-group a.CMSGroupAddTop')
                .contextMenu("CMSAddMenu" + this.elPath, {
                    "bindings": bindings,
                    "menuPosition": "object",
                    "event": "click",
                    "menuAlign": "right",
                    onShowMenu: $.proxy(this.onShowMenuTop, this)
                });

            $("#" + this.elPath + '-title a.CMSGroupCopy').click(function () {
            
            });
            
            $("#" + this.elPath + '-title a.CMSGroupPaste').click(function () {
            
            });


            var _this = this;
            $("#" + this.elPath + '-title a.CMSGroupExpand').click(function () {
                $.each(_this.fields, function (id) {
                    this.show();
                });
            });

            $("#" + this.elPath + '-title a.CMSGroupCollapse').click(function () {
                $.each(_this.fields, function (id) {
                    this.hide();
                });
            });
            

            $("#" + this.elPath).sortable({
                "axis": "y",
                "handle": ".CMSElementDetailsMove",
                "forcePlaceholderSize": true,
                "placeholder": ".CMSElementPlaceholder",
                "containment": "parent",
                "start": $.proxy(this.onDragStart, this)
                ,"stop": $.proxy(this.onDragUpdate, this)
            });

            $.each(this.fields, function (id) {
                this.renderDone();
            });
        },

        addOption: function (id, expanded, contentXml, top) {
            top = top || false;
            Tg.log ("addOption to top="+top);

            var field = this.adapter.loadField(this.options[id].xml, this);

            if (top) {
                // top
                this.fields.unshift(field);
                $('#' + this.elPath).prepend(field.render());
            } else {
                this.fields.push(field);
                $('#' + this.elPath).append(field.render());

            }

            this.numFields++;
            field.renderDone ();
            field.populate (contentXml);

            if (this.fields.length >= this.maxFields) {
                $("#" + this.elPath + '-title a.CMSGroupAdd').hide();
            }

            return field;
        },

        deleteOption: function (elPath) {
            for (var i = 0; i < this.fields.length; i++) {
                if (this.fields[i].elPath === elPath) {
                    $('#' + elPath).remove();
                    this.fields.splice(i, 1);
                    i = 1000000;
                }
            }

            if (this.fields.length < this.maxFields) {
                $("#" + this.elPath + '-title a.CMSGroupAdd').show();
            }
        },

        onShowMenu: function (ev, menu) {
            Tg.log ('menu');
            this.topMenuClicked = false;
            return menu; // lazy loading - could create the menu now!!!
        },
        onShowMenuTop: function (ev, menu) {
            Tg.log ('top menu');
            this.topMenuClicked = true;
            return menu; // lazy loading - could create the menu now!!!
        },

        onMenuClick: function (trigger, target) {
            this.addOption(target.id.substr(8), true, undefined, this.topMenuClicked);
        }

        , onDragStart: function () {
            Tg.log ("onDragStart");
            for (var i = 0; i < CMS.Form.Textareas.length; i++) {
                CMS.Form.Textareas[i].removeControl ();
            }
        }

        , onDragStop: function () {
            Tg.log ("onDragStop");
        }

        , onDragUpdate: function () {
            Tg.log ("onDragUpdate");
            
            var newFields = [];
            var ids = $("#" + this.elPath).sortable('toArray');
            for (var j = 0; j < ids.length; j++) {
                for (var i = 0; i < this.fields.length; i++) {
                    if (this.fields[i].elPath == ids[j]) {
                        newFields.push(this.fields[i]);
                        i = 1000000;
                    }
                }
            }
            this.fields = newFields;

            for (var i = 0; i < CMS.Form.Textareas.length; i++) {
                CMS.Form.Textareas[i].addControl ();
            }
        }
    });



