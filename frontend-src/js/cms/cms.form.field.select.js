
CMS.Form.Field.Select = $.inherit(
	CMS.Form.Field,
	{
		options : null,

		__constructor: function (parent) {
			this.__base(parent);
		},

		loadXml : function (xml, adapter){
			this.__base(xml, adapter);
			var options = {};
			
			$(xml).children().each (function (key) { 
				var option = 0;
				if ($(this).hasAttr("value")) 
					option = $(this).attr("value");
				else if ($(this).hasAttr("option")) 
					option = $(this).attr("option");

				var label = option;
				if ($(this).hasAttr("label"))
					label = $(this).attr("label");
				
				options[option] =  label;
			});
			
			this.options = options;
		},
		
		renderField : function() {
    		var html = '<div class="cmsField"><select type="text" name="'+this.path+'" id="'+this.elPath+'" class="select">';

			var _this = this;
			
			$.each(this.options, function (value) {
				html += '<option value="'+value+'">'+_this.options[value]+'</option>';
			});
    		
    		html += '</select></div>';
    		return html;
		},
		
		populate : function (xml) 
		{
            this.__base(xml);
			if (xml.firstChild)
				$('#'+this.elPath).val(xml.firstChild.data)
		},
		
		renderDone : function ()
		{
			$('#'+this.elPath).datepicker({showAnim: 'fadeIn' ,dateFormat:"dd-mm-yy"});
		} 
	});
