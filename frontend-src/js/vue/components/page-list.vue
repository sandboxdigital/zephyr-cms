<template>
    <div>
        <ul class="list-accordion" id="sortable">
            <cms-page-list-item
                    :currentItem="currentItem"
                    :model="page"
                    v-for="page in treeData"
                    :key="page.id"
                    v-on:page-selected="pageSelect"></cms-page-list-item>
        </ul>
    </div>
</template>

<script>
    import PageService from '../services/page'
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
                console.log(data);

                PageService.reorder(data);
            },
        });
    }

    export default {

        props : {
            currentItem:{}
        },

        data () {
            return {
                treeData : treeData
            }
        },

        created () {

        },

        mounted () {
            this.load();

            Events.$on('pages-refresh', (pageId) => {
                this.load(pageId);

            });
        },

        methods : {
            load (pageId) {
                PageService.load()
                    .then ( response => {
                        console.log(response);
                        this.treeData = response.data;

                        let subPage = pageId ? this.findPageById (pageId) : null;

                        if (subPage) {
                            this.pageSelect(subPage);
                        } else {
                            this.pageSelect(this.treeData[0]);
                        }

                        this.$nextTick(()=>{
                            let lists = jQuery('.sortable');

                            lists.each(function(){
                                createSortable(this);
                            })
                        })
                    });
            },

            pageSelect (page) {
                this.$emit('page-selected', page);
            },

            findPageById (pageId, children) {
                children = children || this.treeData;

                for(let child of children) {
                    if (child.id === pageId) {
                        return child;
                    } else {
                        let subPage = this.findPageById(pageId, child.children);
                        if (subPage) {
                            return subPage;
                        }
                    }
                }

                return null;
            }
        }
    }
</script>