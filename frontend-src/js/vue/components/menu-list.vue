<template>
    <div>
        <ul class="list-accordion" id="sortable">
            <cms-menu-list-item
                    :model="page"
                    v-for="page in treeData"
                    :key="page.id"
                    :data-id="page.id"
                    v-on:menu-selected="menuSelect"></cms-menu-list-item>
        </ul>
    </div>
</template>

<script>
    import MenuService from '../services/menu'
    import Events from '../core/event-bus'
    import Sortable from 'sortablejs';
    import jQuery from 'jquery';

    let treeData = [];
    let sortable = null;

    function buildData(children) {
        let data = [];
        for(let child of children) {
            let $child = jQuery(child);
            let id = $child.data('id');
            let childData = {id:id};
            let $ul = $child.find('> ul');
            if ($ul.length) {
                childData.children = buildData($ul.children());
            }
            data.push(childData);
        }

        return data;

    }

    function createSortable (el) {
        sortable = new Sortable(el, {
            group:'sortable',

            onEnd: function (/**Event*/evt) {
                console.log(evt);
                // var itemEl = evt.item;  // dragged HTMLElement
                // evt.to;    // target list
                // evt.from;  // previous list
                // evt.oldIndex;  // element's old index within old parent
                // evt.newIndex;  // element's new index within new parent


                let sortable = jQuery('#sortable');
                let data = buildData(sortable.children());
                MenuService.reorder(data);
            },
        });
    }

    export default {

        data () {
            return {
                treeData : treeData
            }
        },

        created () {

        },

        mounted () {
            this.load();

            Events.$on('menus-refresh', (menuId) => {
                this.load(menuId);
            });
        },

        methods : {
            load (menuId) {
                MenuService.load()
                    .then ( response => {
                        // console.log(response);
                        this.treeData = response.data;

                        let subMenu = menuId ? this.findMenuById (menuId) : null;

                        if (subMenu) {
                            this.menuSelect(subMenu);
                        } else {
                            this.menuSelect(this.treeData[0]);
                        }

                        this.$nextTick(()=>{
                            let lists = jQuery('.sortable');

                            lists.each(function(){
                                createSortable(this);
                            })
                        })
                    });
            },

            menuSelect (menu) {
                console.log('menuSelect');
                console.log(menu);
                this.$emit('menu-selected', menu);
            },

            findMenuById (menuId, children) {
                children = children || this.treeData;

                for(let child of children) {
                    if (child.id === menuId) {
                        return child;
                    } else {
                        let subMenu = this.findMenuById(menuId, child.children);
                        if (subMenu) {
                            return subMenu;
                        }
                    }
                }

                return null;
            }
        }
    }
</script>