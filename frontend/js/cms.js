;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(root, require('jquery'));
    } else {
        root.SandboxCMS = factory(root.jQuery || root.Zepto);
    }
}(this, function($) {

    /* globals define, module */
/**
 * https://github.com/javascript/augment/blob/master/augment.js
 */

(function (global, factory) {
    if (typeof define === "function" && define.amd) {define(factory);}
    else if (typeof module === "object") {module.exports = factory();}
    else {global.augment = factory();}
}(this, function () {
    "use strict";

    var Factory = function () {};
    var slice = Array.prototype.slice;

    var augment = function (base, body) {
        if (body === undefined) {
            return augment.defclass(base);
        }
        
        var uber = Factory.prototype = typeof base === "function" ? base.prototype : base;
        var prototype = new Factory, properties = body.apply(prototype, slice.call(arguments, 2).concat(uber));
        if (typeof properties === "object") {for (var key in properties) {prototype[key] = properties[key];}}
        if (!prototype.hasOwnProperty("constructor")) {return prototype;}
        var constructor = prototype.constructor;
        constructor.prototype = prototype;
        return constructor;
    };

    augment.defclass = function (prototype) {
        var constructor = prototype.constructor;
        constructor.prototype = prototype;
        return constructor;
    };

    augment.extend = function (base, body) {
        return augment(base, function (uber) {
            this.uber = uber;
            return body;
        });
    };

    return augment;
}));
/*
 * ContextMenu - jQuery plugin for right-click context menus
 *
 * Author: Chris Domigan
 * Contributors: Dan G. Switzer, II
 * Parts of this plugin are inspired by Joern Zaefferer's Tooltip plugin
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Version: r2
 * Date: 16 July 2007
 *
 * For documentation visit http://www.trendskitchens.co.nz/jquery/contextmenu/
 *
 */

(function($) {
  var menu, shadow, trigger, content, hash, currentTarget;
  var defaults = {
    menuStyle: {
      listStyle: 'none',
      padding: '1px',
      margin: '0px',
      backgroundColor: '#fff',
      border: '1px solid #999',
      width: '100px'
    },
    itemStyle: {
      margin: '0px',
      color: '#000',
      display: 'block',
      cursor: 'default',
      padding: '3px',
      border: '1px solid #fff',
      backgroundColor: 'transparent'
    },
    itemHoverStyle: {
      border: '1px solid #0a246a',
      backgroundColor: '#b6bdd2'
    },
    eventPosX: 'pageX',
    eventPosY: 'pageY',
    shadow : true,
    onContextMenu: null,
    onShowMenu: null,
    menuPosition:'event',
    menuAlign:'left'
 	};

  $.fn.contextMenu = function(id, options) {
    if (!menu) {                                      // Create singleton menu
      menu = $('<div id="jqContextMenu"></div>')
               .hide()
               .css({position:'absolute', zIndex:'1010'})
               .appendTo('body')
               .bind('click', function(e) {
                 e.stopPropagation();
               });
    }
    if (!shadow) {
      shadow = $('<div></div>')
                 .css({backgroundColor:'#000',position:'absolute',opacity:0.2,zIndex:499})
                 .appendTo('body')
                 .hide();
    }
    hash = hash || [];
    hash.push({
      id : id,
      menuStyle: $.extend({}, defaults.menuStyle, options.menuStyle || {}),
      itemStyle: $.extend({}, defaults.itemStyle, options.itemStyle || {}),
      itemHoverStyle: $.extend({}, defaults.itemHoverStyle, options.itemHoverStyle || {}),
      bindings: options.bindings || {},
      shadow: options.shadow || options.shadow === false ? options.shadow : defaults.shadow,
      onContextMenu: options.onContextMenu || defaults.onContextMenu,
      onShowMenu: options.onShowMenu || defaults.onShowMenu,
      eventPosX: options.eventPosX || defaults.eventPosX,
      eventPosY: options.eventPosY || defaults.eventPosY
    });
	
	var event = options['event']=='click'?'click':'contextmenu';
	
    var index = hash.length - 1;
    $(this).bind(event, function(e) {
      // Check if onContextMenu() defined
      var bShowContext = (!!hash[index].onContextMenu) ? hash[index].onContextMenu(e) : true;
      if (bShowContext) display(index, this, e, options);
      return false;
    });
    
    
    return this;
  };

  function display(index, trigger, e, options) {
    var cur = hash[index];
    content = $('#'+cur.id).find('ul:first').clone(true);
    content.css(cur.menuStyle).find('li').css(cur.itemStyle).hover(
      function() {
        $(this).css(cur.itemHoverStyle);
      },
      function(){
        $(this).css(cur.itemStyle);
      }
    ).find('img').css({verticalAlign:'middle',paddingRight:'2px'});

    // Send the content to the menu
    menu.html(content);

    // if there's an onShowMenu, run it now -- must run after content has been added
		// if you try to alter the content variable before the menu.html(), IE6 has issues
		// updating the content
    if (!!cur.onShowMenu) 
    	menu = cur.onShowMenu(e, menu);

    $.each(cur.bindings, function(id, func) {
      $('#'+id, menu).bind('click', function(e) {
        hide();
        var target = e.currentTarget?e.currentTarget:e.target;
        func(trigger, target);
      });
    });
    
    if (options['menuPosition']=='object') {
    	var o = $(trigger).offset ();
		var h = $(trigger).outerHeight ();
		var w = $(trigger).outerWidth ();
		if (options['menuAlign']=='br') {
	    	var top = o.top+h;
	    	var left = o.left+w;
    	} else if (options['menuAlign']=='tr') {
	    	var top = o.top;
	    	var left = o.left+w;
    	} else if (options['menuAlign']=='left') {
	    	var top = o.top+h;
	    	var left = o.left;
    	} else {
	    	var top = o.top+h;
	    	var left = o.left-(menu.width()-w);
    	}
    } else {
	    var left = e[cur.eventPosX];
	    var top = e[cur.eventPosY];
    }
    
    menu.css({'left':left,'top':top}).show();

    if (cur.shadow) 
    	shadow.css({width:menu.width(),height:menu.height(),left:left+2,top:top+2}).show();
    $(document).one('click', hide);
  }

  function hide() {
    menu.hide();
    shadow.hide();
  }

  // Apply defaults
  $.contextMenu = {
    defaults : function(userDefaults) {
      $.each(userDefaults, function(i, val) {
        if (typeof val == 'object' && defaults[i]) {
          $.extend(defaults[i], val);
        }
        else defaults[i] = val;
      });
    }
  };

})(jQuery);

(function ($) { // hide the namespace


    jQuery.fn.hasAttr = function (attr) {
        var attribVal = this.attr(attr);
        return (attribVal !== undefined) && (attribVal !== false);
    };

})(jQuery);

/**
 * Inheritance plugin 1.0.9
 *
 * Copyright (c) 2009 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

(function($) {

    var
        hasIntrospection = (function(){_}).toString().indexOf('_') > -1,
        emptyBase = function() {}
        ;

    $.inherit = function() {

        var
            hasBase = jQuery.isFunction(arguments[0]),
            base = hasBase? arguments[0] : emptyBase,
            props = arguments[hasBase? 1 : 0] || {},
            staticProps = arguments[hasBase? 2 : 1],
            result = props.__constructor || base.prototype.__constructor?
                function() {
                    this.__constructor.apply(this, arguments);
                } : function() {},
            inheritance = function() {}
            ;

        $.extend(result, base, staticProps);

        inheritance.prototype = base.prototype;
        result.prototype = new inheritance();
        result.prototype.__self = result.prototype.constructor = result;

        var propList = [];
        $.each(props, function(i) {
            if(props.hasOwnProperty(i)) {
                propList.push(i);
            }
        });
        // fucking ie hasn't toString, valueOf in for
        $.each(['toString', 'valueOf'], function() {
            if(props.hasOwnProperty(this) && jQuery.inArray(this, propList) == -1) {
                propList.push(this);
            }
        });

        $.each(propList, function() {
            if(hasBase
                && jQuery.isFunction(base.prototype[this]) && $.isFunction(props[this])
                && (!hasIntrospection || props[this].toString().indexOf('.__base') > -1)) {

                (function(methodName) {
                    var
                        baseMethod = base.prototype[methodName],
                        overrideMethod = props[methodName]
                        ;
                    result.prototype[methodName] = function() {
                        var baseSaved = this.__base;
                        this.__base = baseMethod;
                        var result = overrideMethod.apply(this, arguments);
                        this.__base = baseSaved;
                        return result;
                    };
                })(this);

            }
            else {
                result.prototype[this] = props[this];
            }
        });

        return result;

    };

})(jQuery);
/*
 * jQuery UI Sortable
 *
 * Copyright (c) 2008 Paul Bakaus
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * http://docs.jquery.com/UI/Sortables
 *
 * Depends:
 *	ui.core.js
 */
(function($) {

function contains(a, b) { 
    var safari2 = $.browser.safari && $.browser.version < 522; 
    if (a.contains && !safari2) { 
        return a.contains(b); 
    } 
    if (a.compareDocumentPosition) 
        return !!(a.compareDocumentPosition(b) & 16); 
    while (b = b.parentNode) 
          if (b == a) return true; 
    return false; 
};

$.widget("ui.sortable", $.extend($.ui.mouse, {
	init: function() {

		var o = this.options;
		this.containerCache = {};
		this.element.addClass("ui-sortable");
	
		//Get the items
		this.refresh();

		//Let's determine if the items are floating
		this.floating = this.items.length ? (/left|right/).test(this.items[0].item.css('float')) : false;
		
		//Let's determine the parent's offset
		if(!(/(relative|absolute|fixed)/).test(this.element.css('position'))) this.element.css('position', 'relative');
		this.offset = this.element.offset();

		//Initialize mouse events for interaction
		this.mouseInit();
		
	},
	plugins: {},
	ui: function(inst) {
		return {
			helper: (inst || this)["helper"],
			placeholder: (inst || this)["placeholder"] || $([]),
			position: (inst || this)["position"],
			absolutePosition: (inst || this)["positionAbs"],
			options: this.options,
			element: this.element,
			item: (inst || this)["currentItem"],
			sender: inst ? inst.element : null
		};		
	},
	propagate: function(n,e,inst, noPropagation) {
		$.ui.plugin.call(this, n, [e, this.ui(inst)]);
		if(!noPropagation) this.element.triggerHandler(n == "sort" ? n : "sort"+n, [e, this.ui(inst)], this.options[n]);
	},
	serialize: function(o) {

		var items = ($.isFunction(this.options.items) ? this.options.items.call(this.element) : $(this.options.items, this.element)).not('.ui-sortable-helper'); //Only the items of the sortable itself
		var str = []; o = o || {};
		
		items.each(function() {
			var res = ($(this).attr(o.attribute || 'id') || '').match(o.expression || (/(.+)[-=_](.+)/));
			if(res) str.push((o.key || res[1])+'[]='+(o.key && o.expression ? res[1] : res[2]));
		});
		
		return str.join('&');
		
	},
	toArray: function(attr) {
		
		var items = ($.isFunction(this.options.items) ? this.options.items.call(this.element) : $(this.options.items, this.element)).not('.ui-sortable-helper'); //Only the items of the sortable itself
		var ret = [];

		items.each(function() { ret.push($(this).attr(attr || 'id')); });
		return ret;
		
	},
	/* Be careful with the following core functions */
	intersectsWith: function(item) {
		
		var x1 = this.positionAbs.left, x2 = x1 + this.helperProportions.width,
		y1 = this.positionAbs.top, y2 = y1 + this.helperProportions.height;
		var l = item.left, r = l + item.width, 
		t = item.top, b = t + item.height;

		if(this.options.tolerance == "pointer" || (this.options.tolerance == "guess" && this.helperProportions[this.floating ? 'width' : 'height'] > item[this.floating ? 'width' : 'height'])) {
			return (y1 + this.offset.click.top > t && y1 + this.offset.click.top < b && x1 + this.offset.click.left > l && x1 + this.offset.click.left < r);
		} else {
		
			return (l < x1 + (this.helperProportions.width / 2) // Right Half
				&& x2 - (this.helperProportions.width / 2) < r // Left Half
				&& t < y1 + (this.helperProportions.height / 2) // Bottom Half
				&& y2 - (this.helperProportions.height / 2) < b ); // Top Half
		
		}
		
	},
	intersectsWithEdge: function(item) {	
		var x1 = this.positionAbs.left, x2 = x1 + this.helperProportions.width,
			y1 = this.positionAbs.top, y2 = y1 + this.helperProportions.height;
		var l = item.left, r = l + item.width, 
			t = item.top, b = t + item.height;

		if(this.options.tolerance == "pointer" || (this.options.tolerance == "guess" && this.helperProportions[this.floating ? 'width' : 'height'] > item[this.floating ? 'width' : 'height'])) {

			if(!(y1 + this.offset.click.top > t && y1 + this.offset.click.top < b && x1 + this.offset.click.left > l && x1 + this.offset.click.left < r)) return false;
			
			if(this.floating) {
				if(x1 + this.offset.click.left > l && x1 + this.offset.click.left < l + item.width/2) return 2;
				if(x1 + this.offset.click.left > l+item.width/2 && x1 + this.offset.click.left < r) return 1;
			} else {
				if(y1 + this.offset.click.top > t && y1 + this.offset.click.top < t + item.height/2) return 2;
				if(y1 + this.offset.click.top > t+item.height/2 && y1 + this.offset.click.top < b) return 1;
			}

		} else {
		
			if (!(l < x1 + (this.helperProportions.width / 2) // Right Half
				&& x2 - (this.helperProportions.width / 2) < r // Left Half
				&& t < y1 + (this.helperProportions.height / 2) // Bottom Half
				&& y2 - (this.helperProportions.height / 2) < b )) return false; // Top Half
			
			if(this.floating) {
				if(x2 > l && x1 < l) return 2; //Crosses left edge
				if(x1 < r && x2 > r) return 1; //Crosses right edge
			} else {
				if(y2 > t && y1 < t) return 1; //Crosses top edge
				if(y1 < b && y2 > b) return 2; //Crosses bottom edge
			}
		
		}
		
		return false;
		
	},
	refresh: function() {
		this.refreshItems();
		this.refreshPositions();
	},
	refreshItems: function() {
		
		this.items = [];
		this.containers = [this];
		var items = this.items;
		var self = this;
		var queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element), this]];
	
		if(this.options.connectWith) {
			for (var i = this.options.connectWith.length - 1; i >= 0; i--){
				var cur = $(this.options.connectWith[i]);
				for (var j = cur.length - 1; j >= 0; j--){
					var inst = $.data(cur[j], 'sortable');
					if(inst && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element), inst]);
						this.containers.push(inst);
					}
				};
			};
		}

		for (var i = queries.length - 1; i >= 0; i--){
			queries[i][0].each(function() {
				$.data(this, 'sortable-item', queries[i][1]); // Data for target checking (mouse manager)
				items.push({
					item: $(this),
					instance: queries[i][1],
					width: 0, height: 0,
					left: 0, top: 0
				});
			});
		};

	},
	refreshPositions: function(fast) {

		//This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
		if(this.offsetParent) {
			var po = this.offsetParent.offset();
			this.offset.parent = { top: po.top + this.offsetParentBorders.top, left: po.left + this.offsetParentBorders.left };
		}

		for (var i = this.items.length - 1; i >= 0; i--){		
			
			//We ignore calculating positions of all connected containers when we're not over them
			if(this.items[i].instance != this.currentContainer && this.currentContainer && this.items[i].item[0] != this.currentItem[0])
				continue;
				
			var t = this.options.toleranceElement ? $(this.options.toleranceElement, this.items[i].item) : this.items[i].item;
			
			if(!fast) {
				this.items[i].width = t.outerWidth();
				this.items[i].height = t.outerHeight();
			}
			
			var p = t.offset();
			this.items[i].left = p.left;
			this.items[i].top = p.top;
			
		};
		
		for (var i = this.containers.length - 1; i >= 0; i--){
			var p =this.containers[i].element.offset();
			this.containers[i].containerCache.left = p.left;
			this.containers[i].containerCache.top = p.top;
			this.containers[i].containerCache.width	= this.containers[i].element.outerWidth();
			this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
		};
		
	},
	destroy: function() {
		this.element
			.removeClass("ui-sortable ui-sortable-disabled")
			.removeData("sortable")
			.unbind(".sortable");
		this.mouseDestroy();
		
		for ( var i = this.items.length - 1; i >= 0; i-- )
			this.items[i].item.removeData("sortable-item");
	},
	createPlaceholder: function(that) {
		
		var self = that || this, o = self.options;

		if(o.placeholder.constructor == String) {
			var className = o.placeholder;
			o.placeholder = {
				element: function() {
					return $('<div></div>').addClass(className)[0];
				},
				update: function(i, p) {
					p.css(i.offset()).css({ width: i.outerWidth(), height: i.outerHeight() });
				}
			};
		}
		
		self.placeholder = $(o.placeholder.element.call(self.element, self.currentItem)).appendTo('body').css({ position: 'absolute' });
		o.placeholder.update.call(self.element, self.currentItem, self.placeholder);
	},
	contactContainers: function(e) {
		for (var i = this.containers.length - 1; i >= 0; i--){

			if(this.intersectsWith(this.containers[i].containerCache)) {
				if(!this.containers[i].containerCache.over) {
					

					if(this.currentContainer != this.containers[i]) {
						
						//When entering a new container, we will find the item with the least distance and append our item near it
						var dist = 10000; var itemWithLeastDistance = null; var base = this.positionAbs[this.containers[i].floating ? 'left' : 'top'];
						for (var j = this.items.length - 1; j >= 0; j--) {
							if(!contains(this.containers[i].element[0], this.items[j].item[0])) continue;
							var cur = this.items[j][this.containers[i].floating ? 'left' : 'top'];
							if(Math.abs(cur - base) < dist) {
								dist = Math.abs(cur - base); itemWithLeastDistance = this.items[j];
							}
						}
						
						if(!itemWithLeastDistance && !this.options.dropOnEmpty) //Check if dropOnEmpty is enabled
							continue;
						
						//We also need to exchange the placeholder
						if(this.placeholder) this.placeholder.remove();
						if(this.containers[i].options.placeholder) {
							this.containers[i].createPlaceholder(this);
						} else {
							this.placeholder = null;;
						}
						
						this.currentContainer = this.containers[i];
						itemWithLeastDistance ? this.rearrange(e, itemWithLeastDistance, null, true) : this.rearrange(e, null, this.containers[i].element, true);
						this.propagate("change", e); //Call plugins and callbacks
						this.containers[i].propagate("change", e, this); //Call plugins and callbacks

					}
					
					this.containers[i].propagate("over", e, this);
					this.containers[i].containerCache.over = 1;
				}
			} else {
				if(this.containers[i].containerCache.over) {
					this.containers[i].propagate("out", e, this);
					this.containers[i].containerCache.over = 0;
				}
			}
			
		};			
	},
	mouseCapture: function(e, overrideHandle) {
	
		if(this.options.disabled || this.options.type == 'static') return false;

		//We have to refresh the items data once first
		this.refreshItems();

		//Find out if the clicked node (or one of its parents) is a actual item in this.items
		var currentItem = null, self = this, nodes = $(e.target).parents().each(function() {	
			if($.data(this, 'sortable-item') == self) {
				currentItem = $(this);
				return false;
			}
		});
		if($.data(e.target, 'sortable-item') == self) currentItem = $(e.target);

		if(!currentItem) return false;
		if(this.options.handle && !overrideHandle) {
			var validHandle = false;
			
			$(this.options.handle, currentItem).find("*").andSelf().each(function() { if(this == e.target) validHandle = true; });
			if(!validHandle) return false;
		}
			
		this.currentItem = currentItem;
		return true;	
			
	},
	mouseStart: function(e, overrideHandle, noActivation) {

		var o = this.options;
		this.currentContainer = this;

		//We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
		this.refreshPositions();

		//Create and append the visible helper			
		this.helper = typeof o.helper == 'function' ? $(o.helper.apply(this.element[0], [e, this.currentItem])) : this.currentItem.clone();
		if(!this.helper.parents('body').length) this.helper.appendTo((o.appendTo != 'parent' ? o.appendTo : this.currentItem[0].parentNode)); //Add the helper to the DOM if that didn't happen already
		this.helper.css({ position: 'absolute', clear: 'both' }).addClass('ui-sortable-helper'); //Position it absolutely and add a helper class

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		this.margins = {																				//Cache the margins
			left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
			top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
		};		
	
		this.offset = this.currentItem.offset();														//The element's absolute position on the page
		this.offset = {																					//Substract the margins from the element's absolute offset
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};
		
		this.offset.click = {																			//Where the click happened, relative to the element
			left: e.pageX - this.offset.left,
			top: e.pageY - this.offset.top
		};
		
		this.offsetParent = this.helper.offsetParent();													//Get the offsetParent and cache its position
		var po = this.offsetParent.offset();			

		this.offsetParentBorders = {
			top: (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};
		this.offset.parent = {																			//Store its position plus border
			top: po.top + this.offsetParentBorders.top,
			left: po.left + this.offsetParentBorders.left
		};
	
		this.originalPosition = this.generatePosition(e);												//Generate the original position
		this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };  //Cache the former DOM position
		
		//If o.placeholder is used, create a new element at the given position with the class
		this.helperProportions = { width: this.helper.outerWidth(), height: this.helper.outerHeight() };//Cache the helper size
		if(o.placeholder) this.createPlaceholder();
		
		//Call plugins and callbacks
		this.propagate("start", e);
		this.helperProportions = { width: this.helper.outerWidth(), height: this.helper.outerHeight() };//Recache the helper size
		
		if(o.cursorAt) {
			if(o.cursorAt.left != undefined) this.offset.click.left = o.cursorAt.left;
			if(o.cursorAt.right != undefined) this.offset.click.left = this.helperProportions.width - o.cursorAt.right;
			if(o.cursorAt.top != undefined) this.offset.click.top = o.cursorAt.top;
			if(o.cursorAt.bottom != undefined) this.offset.click.top = this.helperProportions.height - o.cursorAt.bottom;
		}

		/*
		 * - Position constraining -
		 * Here we prepare position constraining like grid and containment.
		 */	
		
		if(o.containment) {
			if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
			if(o.containment == 'document' || o.containment == 'window') this.containment = [
				0 - this.offset.parent.left,
				0 - this.offset.parent.top,
				$(o.containment == 'document' ? document : window).width() - this.offset.parent.left - this.helperProportions.width - this.margins.left - (parseInt(this.element.css("marginRight"),10) || 0),
				($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.offset.parent.top - this.helperProportions.height - this.margins.top - (parseInt(this.element.css("marginBottom"),10) || 0)
			];

			if(!(/^(document|window|parent)$/).test(o.containment)) {
				var ce = $(o.containment)[0];
				var co = $(o.containment).offset();
				
				this.containment = [
					co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) - this.offset.parent.left,
					co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) - this.offset.parent.top,
					co.left+Math.max(ce.scrollWidth,ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - this.offset.parent.left - this.helperProportions.width - this.margins.left - (parseInt(this.currentItem.css("marginRight"),10) || 0),
					co.top+Math.max(ce.scrollHeight,ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - this.offset.parent.top - this.helperProportions.height - this.margins.top - (parseInt(this.currentItem.css("marginBottom"),10) || 0)
				];
			}
		}

		//Set the original element visibility to hidden to still fill out the white space
		if(this.options.placeholder != 'clone')
			this.currentItem.css('visibility', 'hidden');
		
		//Post 'activate' events to possible containers
		if(!noActivation) {
			 for (var i = this.containers.length - 1; i >= 0; i--) { this.containers[i].propagate("activate", e, this); }
		}
		
		//Prepare possible droppables
		if($.ui.ddmanager) $.ui.ddmanager.current = this;
		if ($.ui.ddmanager && !o.dropBehaviour) $.ui.ddmanager.prepareOffsets(this, e);

		this.dragging = true;

		this.mouseDrag(e); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;


	},
	convertPositionTo: function(d, pos) {
		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		return {
			top: (
				pos.top																	// the calculated relative position
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop) * mod	// The offsetParent's scroll position
				+ this.margins.top * mod												//Add the margin (you don't want the margin counting in intersection methods)
			),
			left: (
				pos.left																// the calculated relative position
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft) * mod	// The offsetParent's scroll position
				+ this.margins.left * mod												//Add the margin (you don't want the margin counting in intersection methods)
			)
		};
	},
	generatePosition: function(e) {
		
		var o = this.options;
		var position = {
			top: (
				e.pageY																	// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)	// The offsetParent's scroll position, not if the element is fixed
			),
			left: (
				e.pageX																	// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft)	// The offsetParent's scroll position, not if the element is fixed
			)
		};
		
		if(!this.originalPosition) return position;										//If we are not dragging yet, we won't check for options
		
		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */
		if(this.containment) {
			if(position.left < this.containment[0]) position.left = this.containment[0];
			if(position.top < this.containment[1]) position.top = this.containment[1];
			if(position.left > this.containment[2]) position.left = this.containment[2];
			if(position.top > this.containment[3]) position.top = this.containment[3];
		}
		
		if(o.grid) {
			var top = this.originalPosition.top + Math.round((position.top - this.originalPosition.top) / o.grid[1]) * o.grid[1];
			position.top = this.containment ? (!(top < this.containment[1] || top > this.containment[3]) ? top : (!(top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;
			
			var left = this.originalPosition.left + Math.round((position.left - this.originalPosition.left) / o.grid[0]) * o.grid[0];
			position.left = this.containment ? (!(left < this.containment[0] || left > this.containment[2]) ? left : (!(left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
		}
		
		return position;
	},
	mouseDrag: function(e) {


		//Compute the helpers position
		this.position = this.generatePosition(e);
		this.positionAbs = this.convertPositionTo("absolute");

		//Rearrange
		for (var i = this.items.length - 1; i >= 0; i--) {
			var intersection = this.intersectsWithEdge(this.items[i]);
			if(!intersection) continue;
			
			if(this.items[i].item[0] != this.currentItem[0] //cannot intersect with itself
				&&	this.currentItem[intersection == 1 ? "next" : "prev"]()[0] != this.items[i].item[0] //no useless actions that have been done before
				&&	!contains(this.currentItem[0], this.items[i].item[0]) //no action if the item moved is the parent of the item checked
				&& (this.options.type == 'semi-dynamic' ? !contains(this.element[0], this.items[i].item[0]) : true)
			) {
				
				this.direction = intersection == 1 ? "down" : "up";
				this.rearrange(e, this.items[i]);
				this.propagate("change", e); //Call plugins and callbacks
				break;
			}
		}
		
		//Post events to containers
		this.contactContainers(e);
		
		 //Call plugins and callbacks
		this.propagate("sort", e);

		if(!this.options.axis || this.options.axis == "x") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis == "y") this.helper[0].style.top = this.position.top+'px';
		
		//Interconnect with droppables
		if($.ui.ddmanager) $.ui.ddmanager.drag(this, e);

		return false;
		
	},
	rearrange: function(e, i, a, hardRefresh) {
		a ? a.append(this.currentItem) : i.item[this.direction == 'down' ? 'before' : 'after'](this.currentItem);
		
		//Various things done here to improve the performance:
		// 1. we create a setTimeout, that calls refreshPositions
		// 2. on the instance, we have a counter variable, that get's higher after every append
		// 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
		// 4. this lets only the last addition to the timeout stack through
		this.counter = this.counter ? ++this.counter : 1;
		var self = this, counter = this.counter;

		window.setTimeout(function() {
			if(counter == self.counter) self.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
		},0);
		
		if(this.options.placeholder)
			this.options.placeholder.update.call(this.element, this.currentItem, this.placeholder);
	},
	mouseStop: function(e, noPropagation) {

		//If we are using droppables, inform the manager about the drop
		if ($.ui.ddmanager && !this.options.dropBehaviour)
			$.ui.ddmanager.drop(this, e);
			
		if(this.options.revert) {
			var self = this;
			var cur = self.currentItem.offset();

			//Also animate the placeholder if we have one
			if(self.placeholder) self.placeholder.animate({ opacity: 'hide' }, (parseInt(this.options.revert, 10) || 500)-50);

			$(this.helper).animate({
				left: cur.left - this.offset.parent.left - self.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
				top: cur.top - this.offset.parent.top - self.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
			}, parseInt(this.options.revert, 10) || 500, function() {
				self.clear(e);
			});
		} else {
			this.clear(e, noPropagation);
		}

		return false;
		
	},
	clear: function(e, noPropagation) {

		if(this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) this.propagate("update", e, null, noPropagation); //Trigger update callback if the DOM position has changed
		if(!contains(this.element[0], this.currentItem[0])) { //Node was moved out of the current element
			this.propagate("remove", e, null, noPropagation);
			for (var i = this.containers.length - 1; i >= 0; i--){
				if(contains(this.containers[i].element[0], this.currentItem[0])) {
					this.containers[i].propagate("update", e, this, noPropagation);
					this.containers[i].propagate("receive", e, this, noPropagation);
				}
			};
		};
		
		//Post events to containers
		for (var i = this.containers.length - 1; i >= 0; i--){
			this.containers[i].propagate("deactivate", e, this, noPropagation);
			if(this.containers[i].containerCache.over) {
				this.containers[i].propagate("out", e, this);
				this.containers[i].containerCache.over = 0;
			}
		}
		
		this.dragging = false;
		if(this.cancelHelperRemoval) {
			this.propagate("stop", e, null, noPropagation);
			return false;
		}
		
		$(this.currentItem).css('visibility', '');
		if(this.placeholder) this.placeholder.remove();
		this.helper.remove(); this.helper = null;
		this.propagate("stop", e, null, noPropagation);
		
		return true;
		
	}
}));

$.extend($.ui.sortable, {
	getter: "serialize toArray",
	defaults: {
		helper: "clone",
		tolerance: "guess",
		distance: 1,
		delay: 0,
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		cancel: ":input",
		items: '> *',
		zIndex: 1000,
		dropOnEmpty: true,
		appendTo: "parent"
	}
});

/*
 * Sortable Extensions
 */

$.ui.plugin.add("sortable", "cursor", {
	start: function(e, ui) {
		var t = $('body');
		if (t.css("cursor")) ui.options._cursor = t.css("cursor");
		t.css("cursor", ui.options.cursor);
	},
	stop: function(e, ui) {
		if (ui.options._cursor) $('body').css("cursor", ui.options._cursor);
	}
});

$.ui.plugin.add("sortable", "zIndex", {
	start: function(e, ui) {
		var t = ui.helper;
		if(t.css("zIndex")) ui.options._zIndex = t.css("zIndex");
		t.css('zIndex', ui.options.zIndex);
	},
	stop: function(e, ui) {
		if(ui.options._zIndex) $(ui.helper).css('zIndex', ui.options._zIndex);
	}
});

$.ui.plugin.add("sortable", "opacity", {
	start: function(e, ui) {
		var t = ui.helper;
		if(t.css("opacity")) ui.options._opacity = t.css("opacity");
		t.css('opacity', ui.options.opacity);
	},
	stop: function(e, ui) {
		if(ui.options._opacity) $(ui.helper).css('opacity', ui.options._opacity);
	}
});

$.ui.plugin.add("sortable", "scroll", {
	start: function(e, ui) {
		var o = ui.options;
		var i = $(this).data("sortable");
	
		i.overflowY = function(el) {
			do { if(/auto|scroll/.test(el.css('overflow')) || (/auto|scroll/).test(el.css('overflow-y'))) return el; el = el.parent(); } while (el[0].parentNode);
			return $(document);
		}(i.currentItem);
		i.overflowX = function(el) {
			do { if(/auto|scroll/.test(el.css('overflow')) || (/auto|scroll/).test(el.css('overflow-x'))) return el; el = el.parent(); } while (el[0].parentNode);
			return $(document);
		}(i.currentItem);
		
		if(i.overflowY[0] != document && i.overflowY[0].tagName != 'HTML') i.overflowYOffset = i.overflowY.offset();
		if(i.overflowX[0] != document && i.overflowX[0].tagName != 'HTML') i.overflowXOffset = i.overflowX.offset();
		
	},
	sort: function(e, ui) {
		
		var o = ui.options;
		var i = $(this).data("sortable");
		
		if(i.overflowY[0] != document && i.overflowY[0].tagName != 'HTML') {
			if((i.overflowYOffset.top + i.overflowY[0].offsetHeight) - e.pageY < o.scrollSensitivity)
				i.overflowY[0].scrollTop = i.overflowY[0].scrollTop + o.scrollSpeed;
			if(e.pageY - i.overflowYOffset.top < o.scrollSensitivity)
				i.overflowY[0].scrollTop = i.overflowY[0].scrollTop - o.scrollSpeed;
		} else {
			if(e.pageY - $(document).scrollTop() < o.scrollSensitivity)
				$(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
			if($(window).height() - (e.pageY - $(document).scrollTop()) < o.scrollSensitivity)
				$(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
		}
		
		if(i.overflowX[0] != document && i.overflowX[0].tagName != 'HTML') {
			if((i.overflowXOffset.left + i.overflowX[0].offsetWidth) - e.pageX < o.scrollSensitivity)
				i.overflowX[0].scrollLeft = i.overflowX[0].scrollLeft + o.scrollSpeed;
			if(e.pageX - i.overflowXOffset.left < o.scrollSensitivity)
				i.overflowX[0].scrollLeft = i.overflowX[0].scrollLeft - o.scrollSpeed;
		} else {
			if(e.pageX - $(document).scrollLeft() < o.scrollSensitivity)
				$(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
			if($(window).width() - (e.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
				$(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
		}
		
	}
});

})(jQuery);

/* Simple JavaScript Inheritance with NFE's
 * MIT Licensed.
 * 
 *  From @dylanthehuman's article: (http://techblog.netflix.com/2014/05/improving-performance-of-our-javascript.html) 
 *  about Netflix's improved version of John Resig's 
 *  "simple-javascript-inheritance" (http://ejohn.org/blog/simple-javascript-inheritance/)
 */

// Inspired by base2 and Prototype and John Resig's class system
(function(){
    var initializing = false;

    // The base Class implementation (does nothing)
    this.Class = function(){};

    // Create a new Class that inherits from this class
    Class.extend = function extend(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // if we're overwriting an existing function
            // set the base property
            var value = prop[name];
            if (typeof prop[name] == "function" && typeof _super[name] == "function"){
                value.base = _super[name];
            }
            prototype[name] = value;
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();

/*
 //Example from the article:
 var Human = Class.extend({
 init: function (height, weight){
 this.height = height;
 this.weight = weight;
 }
 });
 var Mutant = Human.extend({
 init: function init(height, weight, abilities){
 init.base.call(this, height, weight);
 this.abilities = abilities;
 }
 });

 var theWolverine = new Mutant('5ft 3in', 300, [
 'adamantium skeleton',
 'heals quickly',
 'claws'
 ]);
 */
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


/* globals CMS, Class, Tg, $, Form, tinymce, tinyMCE */

CMS.Defaults.Form = {
    adapter:'json',
    container: "#formContainer",
    url: '/admin/content/save',
    path: 'cmsForm',
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
            console.log (this.options.input);
            this.input = jQuery(this.options.input + '');
            console.log (this.input.length);
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

        output += '<div class="cmsForm">';

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
                var xml = this.toXml();

                this.input.val(xml);

                return true;
            } else {
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
                'cmsForm': xml
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
            return '<div class="row">' +this.renderLabel() + this.renderField() + '</div>';
        }

        ,renderDone: function () {

        }

        ,renderLabel: function () {
            return '<div class="label"><label>' + this.label + '</label></div>';
        }

        ,renderField: function () {
            return '<div class="field"><input type="hidden" name="' + this.path + '" id="' + this.elPath + '" /></div>';
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
/* globals CMS, $, Form, tinymce, tinyMCE */

CMS.Form.Field.Block = $.inherit(
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
		
		__constructor : function(xml, parent) {
			this.__base (xml, parent);
		},

		loadXml : function (xml, adapter){
			this.__base(xml, adapter);

            this.view = new String($(xml).attr("view"));
			this.xml = xml;
			
			this.expandedOnCreate = $(xml).attr("expanded") == 'false' ? false : true;

			adapter.loadFields (xml, this);
		},
		
		debug : function(indent) {
			var output = "\t".repeat(indent)+"Field "+this.type + ", id:"+this.id + ", path:"+this.path + "<br>"+"\t".repeat(indent)+"{<br>";
			$.each(this.fields, function (id) {
				output += this.debug (indent+1);
			});
			output += "\t".repeat(indent)+"}<br>";
			return output;
		},
		
		render : function() {
			var output = "";
			
			if (this.expandedOnCreate) {
				$.each(this.fields, function (id) {
					output += this.render ();
				})
			}
			
			var css = this.expandedOnCreate?"":"display:none;";

            return '<div class="CMSGroupoption CMSGroupoption'+this.id+'" id="' + this.elPath + '"><div id="' + this.elPath + '_title" class="CMSGroupoptionTitle">' + this.label + '</div><div id="' + this.elPath + '_fields" class="CMSGroupoptionBody" style="'+css+'">' + output + '<div style="clear:both;float:none;height:1px;">&nbsp;</div></div></div>';
		},
		
		renderDone : function () {
			if (this.expandedOnCreate){
				var cssClass = "CMSIconHide";
				var title = "Hide";
				this.expanded = true;
			}else{
				var cssClass = "CMSIconShow";
				var title = "Show";
				this.expanded = false;
			}
			var div = '<div class="CMSElementDetails" id="'+this.elPath+'_detail"><div><nobr><a href="#" class="CMSElementDetailsToggleVis '+cssClass+'" title="'+title+'">'+title+'</a></nobr></div></div>';
			var jqItem = $('#'+this.elPath);
			
			this.details = $(div).appendTo(jqItem).hide();

			jqItem.unbind ();
			jqItem.hover ($.proxy(this.onElementOver,this), $.proxy(this.onElementOut,this));
			$('#'+this.elPath+'_detail .CMSElementDetailsToggleVis').click ($.proxy(this.onToggleVis,this));


			if (this.expandedOnCreate) {		
				$.each(this.fields, function (id) {
					this.renderDone ();
				});
				this.childrenRendered = true;
			} else 
				this.childrenRendered = false;
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
		
		hide : function ()
		{
			$('#'+this.elPath+' > div > nobr > .CMSElementDetailsToggleVis').addClass ('CMSIconShow').removeClass ('CMSIconHide').attr ("title","Show");
			$('#'+this.elPath+'_fields').slideUp();	
			
			this.expanded = false;		
		},
		
		show : function ()
		{
			$('#'+this.elPath+' > div > nobr > .CMSElementDetailsToggleVis').addClass ('CMSIconHide').removeClass ('CMSIconShow').attr ("title","Hide");
			$('#'+this.elPath+'_fields').slideDown();
			
			if (!this.childrenRendered)
			{

				c(this.childrenRendered)
				var output = '';

				$.each(this.fields, function (id) {
					output += this.render ();
				})
				
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
		
		populateChildren : function (xml)
		{
			var _this = this;
			$(xml).children().each (function (key) {
				if (_this.fields[$(this).attr("id")])
					_this.fields[$(this).attr("id")].populate (this);
			});
		},
		
		onElementOver : function (event) 
		{
			this.details.show();
		},
		
		onElementOut : function (event) 
		{			
			this.details.hide();
		},
		
		onToggleVis : function (event) 
		{
			// hide/show
			if (this.expanded)
				this.hide ();
			else
				this.show ();
				
			return false;
		},
		
		toXml: function (xmlDoc) {
			if (this.childrenRendered) {
			    var el = xmlDoc.createElement(this.type);
			    el.setAttribute("id", this.id);
		        el.setAttribute("uid", this.uid);
			    el.setAttribute("view", this.view);
	
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

/* globals CMS, $, Form, tinymce, tinyMCE */

CMS.Form.Field.Custom = $.inherit(
    CMS.Form.Field,
    {
        __constructor : function(xml, parent) {
            this.__base (xml, parent);
            
            this._html = $(xml).attr("html") ? $(xml).attr("html") : "";
        },
        
        render : function() {
            return '<div class="custom">'+this._html+'</div>';
        }
    });


/* globals CMS, $, Form, tinymce, tinyMCE */

CMS.Form.Field.Date = $.inherit(
	CMS.Form.Field,
	{
		__constructor : function(xml, parent) {
			this.__base (xml, parent);
		},
		
		renderField : function() {
			return '<div class="field"><input type="text" name="'+this.path+'" id="'+this.elPath+'" class="textsmall" /></div>';
		},
		
		populate : function (xml) 
		{
            this.__base(xml);
			if (xml.firstChild) {
				$('#' + this.elPath).val(xml.firstChild.data);
			}
		},
		
		renderDone : function ()
		{
			$('#'+this.elPath).datepicker({showAnim: 'fadeIn' ,dateFormat:"dd-mm-yy"});
		} 
	});

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
            var output = '<div class="FormFile" style="width:98%;"><div class="FormFilePreviewTable" style="float:left;"><table id="' + this.elPath + '_table"></table></div>';
            output += '<div id="'+this.elPath + '_FormFileButtons" class="FormFileButtons" style="float:left;"><div id="' + this.elPath + '_progress"></div><div>';
            output += '<input id="' + this.elPath + '_btnSelect" type="button" class="' + this.elPath + '_btnSelect btnSelect" value="Select file" />';
            output += '<input id="' + this.elPath + '_btnCancel" type="button" class="' + this.elPath + '_btnCancel btnCancel" value="Cancel upload" style="display:none;" />';
            output += '</div></div></div>';

            return '<div class="field">' + output + '</div>';
        },

        renderDone: function () {
            Tg.log('#'+this.elPath + '_btnSelect');
            var el = jQuery('#'+this.elPath + '_btnSelect');
            el.click(this.showFileBrowser.bind(this));
        }    

        ,populate: function (xml) {
            this.__base(xml);
            if (jQuery(xml).attr('fileUrl')) {
                var file = {
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
                onSelect: this.addFile.bind(this)
            });
        }    
        
        ,setValue : function (value) 
        {
            this.addFile(value);
        }
        
        ,addFile : function (file) 
        {
            this.file = file;
            
            this._preview  = jQuery('#' + this.elPath + '_table');

            this._preview.empty();
    
            var url = file.url;            
            // if (file.thumbnailUrl !== undefined)
            // {
            //     url = file.thumbnailUrl;
            // }
            var ext = Tg.FileUtils.getExtension(url);

            if (ext !== "jpg" && ext !== "jpeg" && ext !== "png" && ext !== "gif") {
                // TODO - this path should be set via config
                url = "/core/images/fileicons/" + ext + ".png";
            }
            
            var html = '<tr id="fileUploadRow' + this._id + '">';
            html += '<td class="fileUploadThumbnail"><img id="' + this._id + '_image" src="' + url + '"  /></td>';
            html += '<td id="' + this._id + '_name" class="fileUploadName">' + file.name + '</td>';
            html += '<td class="fileUploadDelete">';
            html += '<a href="#" class="formFileUploadDelete">Remove this file</a>';
            html += '</td>';
            html += '</tr>';

            this._preview.append(html);
            
            this._preview.find('.formFileUploadDelete').bind('click', this.handleFileDelete.bind(this));

            jQuery('#'+this.elPath + '_btnSelect').val('Change file');

            jQuery('#'+this.elPath + '_FormFileButtons').css({float:'right'});
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
            var s = "\t".repeat(indent) + "Field " + this.type + ", id:" + this.id + ", path:" + this.elPath + ", value:" + this.value;
            
            if (this.file) {
                s += ", file:" + this.file.id;
            }
            s+="\n";
            
            return s;            
        }

        ,toXml: function (xmlDoc) {      
            var el = xmlDoc.createElement(this.type);
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

            var html = '<div class="row">';
            html += '<div class="label"><label>' + this.label + '</label></div>';
            html += '<div class="field">';
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





CMS.Form.Field.Select = $.inherit(
	CMS.Form.Field,
	{
		options : null,

		__constructor : function(xml, parent) {
			this.__base (xml, parent);
			
			var options = new Object ();
			
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
    		var html = '<div class="field"><select type="text" name="'+this.path+'" id="'+this.elPath+'" class="select">';

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



CMS.Form.Field.Text = $.inherit(
	CMS.Form.Field,
	{
		__constructor : function(xml, parent) {
			this.__base (xml, parent);
		},
		
		renderField : function() {
		    return '<div class="field"><input type="text" name="' + this.path + '" id="' + this.elPath + '" class="text" /></div>';
		},
		
		populate : function (xml) 
		{
            this.__base(xml);
			if (xml.firstChild)
				$('#'+this.elPath).val(xml.firstChild.data)
		}
	});



CMS.Form.Field.Textarea = $.inherit(
	CMS.Form.Field,
	{
		__constructor : function(xml, parent) {
			this.__base (xml, parent);
		},
		
		renderField : function() {
		    return '<div class="field"><textarea name="' + this.path + '" id="' + this.elPath + '" class="text"></textarea></div>';
		},
		
		populate : function (xml) 
		{
            this.__base(xml);
			if (xml.firstChild)
				$('#'+this.elPath).val(xml.firstChild.data)
		}

        , getValue : function ()
        {
//            alert ('1')
            return CMS.Utils.stripInvalidXmlChars (this.value);
        }
	});


/* globals CMS, Class, Tg, $, Form, tinymce, tinyMCE */

CMS.Utils = {

    guidGenerator : function () 
    {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+S4());
    },

    urldecode : function (str) {
        // http://kevin.vanzonneveld.net
        // +   original by: Philip Peterson
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: AJ
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Brett Zamir (http://brett-zamir.me)
        // +      input by: travc
        // +      input by: Brett Zamir (http://brett-zamir.me)
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Lars Fischer
        // +      input by: Ratheous
        // %          note 1: info on what encoding functions to use from: http://xkr.us/articles/javascript/encode-compare/
        // *     example 1: urldecode('Kevin+van+Zonneveld%21');
        // *     returns 1: 'Kevin van Zonneveld!'
        // *     example 2: urldecode('http%3A%2F%2Fkevin.vanzonneveld.net%2F');
        // *     returns 2: 'http://kevin.vanzonneveld.net/'
        // *     example 3: urldecode('http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a');
        // *     returns 3: 'http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a'

        //    var hash_map = {}, ret = str.toString(), unicodeStr='', hexEscStr='';
        //
        //    var replacer = function(search, replace, str) {
        //        var tmp_arr = [];
        //        tmp_arr = str.split(search);
        //        return tmp_arr.join(replace);
        //    };
        //
        //    // The hash_map is identical to the one in urlencode.
        //    hash_map["'"]   = '%27';
        //    hash_map['(']   = '%28';
        //    hash_map[')']   = '%29';
        //    hash_map['*']   = '%2A';
        //    hash_map['~']   = '%7E';
        //    hash_map['!']   = '%21';
        //    hash_map['%20'] = '+';
        //    hash_map['\u00DC'] = '%DC';
        //    hash_map['\u00FC'] = '%FC';
        //    hash_map['\u00C4'] = '%D4';
        //    hash_map['\u00E4'] = '%E4';
        //    hash_map['\u00D6'] = '%D6';
        //    hash_map['\u00F6'] = '%F6';
        //    hash_map['\u00DF'] = '%DF';
        //    hash_map['\u20AC'] = '%80';
        //    hash_map['\u0081'] = '%81';
        //    hash_map['\u201A'] = '%82';
        //    hash_map['\u0192'] = '%83';
        //    hash_map['\u201E'] = '%84';
        //    hash_map['\u2026'] = '%85';
        //    hash_map['\u2020'] = '%86';
        //    hash_map['\u2021'] = '%87';
        //    hash_map['\u02C6'] = '%88';
        //    hash_map['\u2030'] = '%89';
        //    hash_map['\u0160'] = '%8A';
        //    hash_map['\u2039'] = '%8B';
        //    hash_map['\u0152'] = '%8C';
        //    hash_map['\u008D'] = '%8D';
        //    hash_map['\u017D'] = '%8E';
        //    hash_map['\u008F'] = '%8F';
        //    hash_map['\u0090'] = '%90';
        //    hash_map['\u2018'] = '%91';
        //    hash_map['\u2019'] = '%92';
        //    hash_map['\u201C'] = '%93';
        //    hash_map['\u201D'] = '%94';
        //    hash_map['\u2022'] = '%95';
        //    hash_map['\u2013'] = '%96';
        //    hash_map['\u2014'] = '%97';
        //    hash_map['\u02DC'] = '%98';
        //    hash_map['\u2122'] = '%99';
        //    hash_map['\u0161'] = '%9A';
        //    hash_map['\u203A'] = '%9B';
        //    hash_map['\u0153'] = '%9C';
        //    hash_map['\u009D'] = '%9D';
        //    hash_map['\u017E'] = '%9E';
        //    hash_map['\u0178'] = '%9F';
        //
        //    for (unicodeStr in hash_map) {
        //        hexEscStr = hash_map[unicodeStr]; // Switch order when decoding
        //        ret = replacer(hexEscStr, unicodeStr, ret); // Custom replace. No regexing
        //    }
        //
        //    Tg.log (ret);
        //
        //    decodeURIComponent('%EF');
        //    Tg.log (ret);
        //    return ret;

        // End with decodeURIComponent, which most resembles PHP's encoding functions
        //    ret = decodeURIComponent(ret);
        return decodeURIComponent(str.replace(/\+/g, '%20'));
    },

    stripInvalidXmlChars : function (s)
    {
        //var s = "London by nightA fantastic nocturnal tour Le Monde.fr : Actualité à la Une!@#$%^&*()?";
        //
        // removes http://www.w3.org/TR/2000/REC-xml-20001006#NT-Char
        // Char	   ::=   	#x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]	/* any Unicode character, excluding the surrogate blocks, FFFE, and FFFF. */
        // JS unicode range only goes as high as \uFFFF
        // Uses negative lookahead
        var re = /(?![\u0009\u000A\u000D\u0020-\uD7FF]|[\uE000-\uFFFD])./g;
        s = s.replace(re, "");
        return s;
    }
};
/* globals Tg, CMS, $, Form, tinymce, tinyMCE */



CMS.Defaults.TinyMce = {
    mode : "none",
    theme: "advanced",
    plugins: "media,advimage,paste,inlinepopups",
    dialog_type : "modal",
    theme_advanced_buttons1: "bold,italic,underline,bullist,numlist,separator,outdent,indent,|,link,unlink,image,|,code",
    theme_advanced_buttons2: "justifyleft,justifycenter,justifyright,|,formatselect,|,cleanup,removeformat,|,pastetext,pasteword",
    theme_advanced_buttons3: "",
    theme_advanced_toolbar_location: "top",
    theme_advanced_statusbar_location: "bottom",
    theme_advanced_toolbar_align: "left",
    theme_advanced_resizing: true,
    theme_advanced_resize_horizontal: false,
    file_browser_callback: "myFileBrowser"
    //, document_base_url: "../../.." // relative to this file cms.form.js
    ,relative_urls : false
    ,theme_advanced_resizing_use_cookie : false
};

CMS.TinyMce = {

};

$.extend (CMS.TinyMce, {
    textareaIds : [],

    init : function () {
        tinyMCE.init(CMS.Defaults.TinyMce);
    },

    register : function (id)
    {
        this.textareaIds.push (id);
        tinyMCE.execCommand("mceAddControl", false, id);
    },

    unregisterAll : function ()
    {
        tinyMCE.triggerSave();
        for (var i = 0; i < this.textareaIds.length; i++) {
            tinyMCE.execCommand('mceRemoveControl', false, this.textareaIds[i]);
        }
        
        this.textareaIds = [];
    }
});

function myFileBrowser (field_name, url, type, win) 
{
    if (type === 'image') {
        var config = {
            'onSelect':function (file) {
                 if (Tg.FileManager.fileBrowserWindow) {
                     Tg.FileManager.fileBrowserWindow.hide();
                 }
                 
                 var url = file.url;
                // insert information now
                win.document.getElementById(field_name).value = url;

                // are we an image browser
                if (typeof(win.ImageDialog) !== "undefined")
                {
                    // we are, so update image dimensions and preview if necessary
                    if (win.ImageDialog.getImageData) {
                        win.ImageDialog.getImageData();
                    }
                    if (win.ImageDialog.showPreviewImage) {
                        win.ImageDialog.showPreviewImage(url);
                    }
                }
            }
        };
        Tg.FileManager.showBrowserInWindow (config);
    }

    return false;
}

/* globals CMS, Class, Tg, $, Form, tinymce, tinyMCE */

CMS.Ajax = {
    loadFile: function (url, callback) {
        $.ajax({
            type: "GET",
            url: url,
            dataType: "html",
            success: function (response) {
                callback (true, response);
            }
        });
    }
};
function fromIsoDate(value) {
  if (typeof value === 'string') {
    var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(?:([\+-])(\d{2})\:(\d{2}))?Z?$/.exec(value);
      if (a) {
//        var utcMilliseconds = Date.UTC(
        return new Date(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]);
      }
  }
  return value;
}


DateUtils = {};
DateUtils.parseDate = function (dateString, format) 
{
	if (format == 'dd-mm-yyyy')
	{
		var dateArray = dateString.split ('-');
		return new Date (dateArray[2], dateArray[1]-1, dateArray[0]);
	} else 
		alert ('DateUtils.parseDate - unknown format :'+format);
};
DateUtils.parseTime = function (timeString, format) 
{
	if (format==null || format == 'hh:mm:ss')
	{
		var tiemArray = timeString.split (':');
		var d = new Date ();
		d.setHours (tiemArray[0]);
		d.setMinutes (tiemArray[1]);
		d.setSeconds (tiemArray[0]);
		return d;
	} else 
		alert ('DateUtils.parseTime - unknown format :'+format);
};


/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};
// functions required to deal with Date returned from MS ASP.NET MVC

function parseMSJSONString(data) {
	try {
		var newdata = data.replace(
			new RegExp('"\\\\\/Date\\\((-?[0-9]+)\\\)\\\\\/"', "g")
			, "new Date($1)");
		newdata = eval('(' + newdata + ')');
		return newdata;
	}
	catch (e) { return null; }
}


Date.prototype.toMSJSON = function () {
	var date = '"\\\/Date(' + this.getTime() + ')\\\/"';
	return date;
};


    String.prototype.repeat = function(l) {
        return new Array(l + 1).join(this);
    };

    String.prototype.ucWord = function() {
        var newVal = '';
        var val = this.split(' ');
        for ( var i = 0; i < val.length; i++) {
            newVal += val[i].substring(0, 1).toUpperCase()
                + val[i].substring(1, val[i].length) + ' ';
        }
        return newVal;
    };


    var Tg = {
        log : function (msg) {
            // trace a message to the browser console (must be enabled in firebug
            if (typeof window.console !== 'undefined') {
                window.console.log(msg);
            }
        }
    };

    Tg.Debug = {};




	Tg.FileUtils = {};
	Tg.FileUtils.getExtension = function (filename) {
		//c(filename);
		var ext = /^.+\.([^.]+)$/.exec(filename);
		return ext == null ? "" : new String(ext[1]).toLowerCase();
	};
/* globals CMS, Class, Tg, $, Form, tinymce, tinyMCE */

/**
 * Create a new Document object. If no arguments are specified,
 * the document will be empty. If a root tag is specified, the document
 * will contain that single root tag. If the root tag has a namespace
 * prefix, the second argument must specify the URL that identifies the
 * namespace.
 */
CMS.Xml = {
    createXml: function (rootTagName, namespaceURL) {
        if (!rootTagName) rootTagName = "";
        if (!namespaceURL) namespaceURL = "";
        if (document.implementation && document.implementation.createDocument) {
            // This is the W3C standard way to do it
            return document.implementation.createDocument(namespaceURL, rootTagName, null);
        }
        else { // This is the IE way to do it
            // Create an empty document as an ActiveX object
            // If there is no root element, this is all we have to do
            var doc = new ActiveXObject("MSXML2.DOMDocument");
            // If there is a root tag, initialize the document
            if (rootTagName) {
                // Look for a namespace prefix
                var prefix = "";
                var tagname = rootTagName;
                var p = rootTagName.indexOf(':');
                if (p != -1) {
                    prefix = rootTagName.substring(0, p);
                    tagname = rootTagName.substring(p + 1);
                }
                // If we have a namespace, we must have a namespace prefix
                // If we don't have a namespace, we discard any prefix
                if (namespaceURL) {
                    if (!prefix) prefix = "a0"; // What Firefox uses
                }
                else prefix = "";
                // Create the root element (with optional namespace) as a
                // string of text
                var text = "<" + (prefix ? (prefix + ":") : "") + tagname +
                    (namespaceURL
                        ? (" xmlns:" + prefix + '="' + namespaceURL + '"')
                        : "") +
                    "/>";
                // And parse that text into the empty document
                doc.loadXML(text);
            }
            return doc;
        }
    },

    parseXml : function (xmlString)
    {
        if(typeof(ActiveXObject) != 'undefined')
        {
            //Internet Explorer
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlString);
            return xmlDoc;
        } else {
            try {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(xmlString, "text/xml");
            } catch (e)
            {
                alert (e);
            }
        }
        return xmlDoc;
    },

    xmlToString: function (elem) {

        var serialized;

        if (typeof(XMLSerializer) != 'undefined') {
            // XMLSerializer exists in current Mozilla browsers
            try {
                serializer = new XMLSerializer();
                serialized = serializer.serializeToString(elem);
            }
            catch (e) {
                // Internet Explorer has a different approach to serializing XML
                alert("Oh dear unable to serialize XML\nError:\n" + e);
            }
        } else {
            // Internet Explorer has a different approach to serializing XML
            serialized = elem.xml;
        }

        return serialized;
    }
};

    return CMS;
}));
