import Vue from 'vue';
import $ from 'jquery';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es';


Vue.directive('fixed-in-parent', {
    inserted: function (el) {
        let $buttons = $(el);
        let $parent = $(el).parent();
        let onResize = () => {
            $buttons.width($parent.outerWidth());
        };

        // $(window).on('resize', onResize);

        onResize();

        // this should trigger this.resize on load
        let ro = new ResizeObserver((entries) => {
            if (entries.length > 0) {
                onResize();
            }
        });

        ro.observe($parent[0]);

        // TODO- should destroy resize event listener when removed from dom
        // ro.destroy();
    },
});

