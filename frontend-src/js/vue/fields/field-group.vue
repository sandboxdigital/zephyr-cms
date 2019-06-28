<template>
    <div class="cms-row cms-field-group">
        <div class="cms-field">
            <div :id="elPath+'-group'" class="CMSGroup">
                <div class="cms-group-title" :id="elPath+'-title'">
                    <label>{{label}}</label>
                    <div class="cms-group-toolbar">
                        <button class="cms-btn-icon" :class="{'diag':!allVisible}" @click.prevent="hideShowAll()"><span class="oi oi-eye"></span></button>
                        <button class="cms-btn-icon" @mouseenter="addHover" @mouseleave="addLeave"><span class="oi oi-plus"></span></button>
                    </div>
                </div>
                <div class="cms-group-body" :id="elPath" ref="groupBody">
                    <cms-group-option v-for="child in children"
                                      :field="child"
                                      :ref="child.ref"
                                      :key="child.ref"
                    v-on:option-delete="optionDelete"></cms-group-option>
                </div>

                <div class="cms-group-footer" :id="elPath+'-footer'">
                    <div class="cms-group-toolbar">
                        <button class="cms-btn-icon bottom" @mouseenter="addHover" @mouseleave="addLeave"><span class="oi oi-plus"></span></button>
                    </div>
                </div>

                <div class="cms-group-menu" :class="{'align-bottom':menuAlignBottom}" v-show="showMenu" @mouseenter="addHover" @mouseleave="addLeave">
                    <ul>
                        <li v-for="option in options">
                            <a @click.prevent="addOption(option.key)">{{option.label}}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ucword} from "../utils/string";
import fieldMixins from '../mixins/field'
import CmsGroupOption from './field-group-option'
import $ from 'jquery'
import Sortable from 'sortablejs';

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
}


export default {

    mixins : [fieldMixins],

    components : {
        CmsGroupOption
    },

    data () {
        return {
            optionCount:0,
            elPath:'group',
            output:'group',
            showMenu:false,
            hoverTo:null,
            menuAlignBottom:true,

            options : [
            ],

            children : [
            ],

            allVisible : true
        }
    },

    mounted () {
        // console.log(this.field);
        for (let option of this.field.spec.options) {
            let label = option.label ? option.label : ucword(option.id);
            this.options.push({key:option.id, label:label});
                // do stuff
        }
    },

    computed : {
    },

    methods : {

        loadData (data) {
            // console.log('Group->loadData');
            // console.log(data);

            for(let option of data.options) {
                this.addOption(option.id, option.data)
            }

            this.$nextTick(()=>{
                this.createSortable(this.$refs.groupBody);
            });
        },

        getData () {
            // console.log('Group->getData');
            let options = [];

            let data = fieldMixins.methods.getData.call(this);
            delete data.value;

            // console.log(data);

            for (let child of this.children) {
                let childComponenent = this.$refs[child.ref][0];
                let data = childComponenent.getData();
                options.push(data);
            }

            return Object.assign({},data,{
                options:options
            });
        },

        addHover (ev) {
            if (ev.target.tagName === 'A' || ev.target.tagName === 'BUTTON') {
                let $a = $(ev.target);
                this.menuAlignBottom = $a.hasClass('bottom');
            }

            this.showMenu = true;
            clearTimeout(this.hoverTo);
        },

        addLeave (ev) {
            this.hoverTo = setTimeout(() => {
                this.showMenu = false;
            },200)
        },

        hideShowAll () {
            this.allVisible = !this.allVisible;

            // for (let compKey in this.$refs) {
            //     console.log(compKey);
            //
            //     // let comp = this.$refs[compKey][0];
            //     // comp.visible = this.allVisible;
            // }
            for (let child of this.children) {
                let childComponenent = this.$refs[child.ref][0];
                childComponenent.visible = this.allVisible;
            }

        },

        optionDelete (option) {
            let i = this.findOptionIndex(option);

            if (i !== false) {
                this.children.splice(i, 1);
            }
        },

        findOptionIndex (option) {
            for (let i=0 ; i < this.children.length; i++) {
                if (this.children[i].ref === option.ref) {
                    console.log(option);
                    return i;
                }
            }

            return false;
        },

        addOption (id, data) {
            // console.log('Group->addOption '+id);
            let spec = this.getOption(id);

            if (spec) {
                let optionSpec = {
                    id: id,
                    ref: 'option' + this.optionCount,
                    spec: spec,
                    data: data
                };

                if (this.menuAlignBottom) {
                    this.children.push(optionSpec);
                } else {
                    this.children.unshift(optionSpec);
                }

                this.optionCount++;
            }
        },

        getOption (id)
        {
            for (let option of this.field.spec.options) {
                if (option.id === id) {
                    return option;
                }
            }
        },

        createSortable (el) {
            let _this = this;

            if (this.sortable) {
                this.sortable.destroy();
            }

            this.sortable = new Sortable(el, {
                handle: ".cms-group-option-handle",
                direction: 'horizontal',

                onEnd: function (/**Event*/evt) {
                    // console.log(evt);
                    // console.log(_this);
                    // var itemEl = evt.item;  // dragged HTMLElement
                    // evt.to;    // target list
                    // evt.from;  // previous list
                    // evt.oldIndex;  // element's old index within old parent
                    // evt.newIndex;  // element's new index within new parent
                    // console.log(evt.newIndex+':'+evt.oldIndex);
                    array_move(_this.children, evt.oldIndex, evt.newIndex);
                    // PageService.reorder(data);
                },
            });
        }
    }
}
</script>