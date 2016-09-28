/* globals Tg, CMS, $, Form, tinymce, tinyMCE */

CMS.Form.Field.Groupoption = $.inherit(
    CMS.Form.Field,
    {
        fields : null,
        xml : null,
        details : null,
        expandedOnCreate : null,
        number : null,
        view : null,
        expanded : null,
        populated : true,
        childrenRendered : false,
        _dataXml : null,
        
        __constructor : function(parent) {
            this.__base (parent);
            
            this.number = parent.numFields;
        },

        loadXml : function (xml, adapter)
        {
            this.__base (xml);

            // give this groupoption a uniquie path based on the number of fields the parent has
            this.path = this.parent.path+"["+this.parent.numFields+"]["+this.id+"]";
            this.elPath = this.parent.elPath+"_"+this.parent.numFields+"_"+this.id;
            
            this.xml = xml;
            this.expandedOnCreate = $(xml).attr("expanded") === 'false'?false:true;
            adapter.loadFields (xml, this);
        },
        
        debug : function(indent) {
            var output = "\t".repeat(indent)+"Field "+this.type + ", id:"+this.id + ", path:"+this.path + "\n"+"\t".repeat(indent)+"{\n";
            $.each(this.fields, function (id) {
                output += this.debug (indent+1);
            });
            output += "\t".repeat(indent)+"}\n";
            return output;
        },
        
        render : function() {
            var output = "";
            
            if (this.expandedOnCreate) {
                $.each(this.fields, function (id) {
                    output += this.render ();
                });
            }
            
            var css = this.expandedOnCreate?"":"display:none;";

            return '<div class="CMSGroupoption CMSGroupoption'+this.id+'" id="' + this.elPath + '"><div id="' + this.elPath + '_title" class="CMSGroupoptionTitle">' + this.label + ' (' + (this.number + 1) + ')</div><div id="' + this.elPath + '_fields" class="CMSGroupoptionBody" style="'+css+'">' + output + '<div style="clear:both;float:none;height:1px;">&nbsp;</div></div></div>';
        },
        
        renderDone : function () {
            var title = "Hide";
            var cssClass = "CMSIconHide";
            this.expanded = true;
            if (!this.expandedOnCreate){
                cssClass = "CMSIconShow";
                title = "Show";
                this.expanded = false;
            }
            var div = '<div class="CMSElementDetails" id="'+this.elPath+'_detail"><div><nobr><a href="#" class="CMSElementDetailsToggleVis '+cssClass+'" title="Hide">'+title+'</a>';
            // div += '<a class="CMSElementDetailsMove CMSIconMove" title="Move" style="-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-o-user-select: none;user-select: none;">Move</a>';
            div += '<a href="#" class="CMSElementDetailsDelete CMSIconDelete" title="Delete">Delete</a></nobr></div></div>';
            var jqItem = $('#'+this.elPath);
            
            this.details = $(div).appendTo(jqItem).hide();

            jqItem.unbind ();
            jqItem.hover ($.proxy(this.onElementOver,this), $.proxy(this.onElementOut,this));
            $('#'+this.elPath+'_detail .CMSElementDetailsDelete').click ($.proxy(this.onDeleteClick,this));
            $('#'+this.elPath+'_detail .CMSElementDetailsToggleVis').click ($.proxy(this.onToggleVis,this));

            if (this.expandedOnCreate) {        
                $.each(this.fields, function (id) {
                    this.renderDone ();
                });
                this.childrenRendered = true;
            } else {
                this.childrenRendered = false;
            }
        },
        
        populate : function (xml)
        {
            this.__base(xml);
            if (this.expandedOnCreate) {                
                this.populateChildren (xml);
            } else {
                this._dataXml = xml; // save for later
            }
        },

        populateChildren : function (xml)
        {
            var _this = this;
            $(xml).children().each (function (key) {
                if (_this.fields[$(this).attr("id")]) {
                    _this.fields[$(this).attr("id")].populate(this);
                }
            });
        },
        
        hide : function ()
        {
            $('#'+this.elPath+' > div > nobr > .CMSElementDetailsToggleVis').addClass ('CMSIconShow').removeClass ('CMSIconHide').attr ("title","Show");
            $('#'+this.elPath+'_fields').slideUp();    
            
            this.expanded = false;        
        },
        
        show : function ()
        {
            $('#'+this.elPath+' > div > nobr > .CMSElementDetailsToggleVis').addClass ('CMSIconHide').removeClass ('CMSIconShow').attr ("title","Hide");
                        
            if (!this.childrenRendered)
            {
                var output = '';
                $.each(this.fields, function (id) {
                    output += this.render ();
                });
                
                $('#'+this.elPath+'_fields').html (output);
                
                $.each(this.fields, function (id) {
                    this.renderDone ();
                });
                this.populateChildren (this._dataXml);
                this.childrenRendered = true;
            }
            $('#'+this.elPath+'_fields').slideDown();
            this.expanded = true;
        },
        
        onElementOver : function (event) 
        {
            this.details.show();
        },
        
        onElementOut : function (event) 
        {            
            this.details.hide();
        },
        
        onDeleteClick : function (event) 
        {
            // parent (Group) takes care of removing
            this.parent.deleteOption(this.elPath);
            return false;
        },
        
        onToggleVis : function (event) 
        {
            // hide/show
            if (this.expanded) {
                this.hide();
            } else {
                this.show();
            }
                
            return false;
        },
        
        toXml: function (xmlDoc) {
            
            if (this.childrenRendered) {
                var el = xmlDoc.createElement(this.type);
                el.setAttribute("id", this.id);
                el.setAttribute("uid", this.uid);
                el.setAttribute("namespace", this.namespace);
    
                if (this.value) {
                    var newCDATA = xmlDoc.createCDATASection(this.value);
                    el.appendChild(newCDATA);
                }
    
                if (this.fields) {
                    $.each(this.fields, function (id) {
                        el.appendChild(this.toXml(xmlDoc));
                    });
                }
                return el;
            } else {                
                xmlDoc.adoptNode (this._dataXml);
                return this._dataXml;
            }
        }
    });
