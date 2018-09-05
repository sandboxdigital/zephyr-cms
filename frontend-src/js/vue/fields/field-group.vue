<template>
    <div class="cms-row cms-field-group">
        <!--<div class="cms-label"><label>{{label}}</label></div>-->

        <div class="cms-field">
            <div :id="elPath+'-group'" class="CMSGroup">
                <div class="cms-group-title" :id="elPath+'-title'">
                    <label>{{label}}</label>
                <!--<a href="#" class="CMSGroupAddTop CMSIconAdd">Add</a>-->
                <!--<a href="#" class="CMSGroupCollapse CMSIconHide">Collapse all</a>-->
                <!--<a href="#" class="CMSGroupExpand CMSIconShow">Expand all</a>-->
                           <!--<a href="#" class="CMSGroupPaste CMSIconPaste">Paste</a>-->
                               <!--<a href="#" class="CMSGroupCopy CMSIconCopy">Copy</a>-->
                    <div class="cms-group-toolbar">
                        <a href="" class="cms-btn-icon" @click.prevent @mouseenter="addHover" @mouseleave="addLeave"><span class="oi oi-plus"></span></a>
                    </div>
                </div>
                <div class="cms-group-body" :id="elPath">
                    <cms-group-option v-for="child in children"
                                      :field="child"
                                      :ref="child.ref"
                                      :key="child.ref"
                    v-on:option-delete="optionDelete"></cms-group-option>
                </div>

                <div class="cms-group-footer" :id="elPath+'-footer'">
                    <!--<div class="left"> &gt; {{label}}</div>-->
                    <div class="cms-group-toolbar">
                        <a class="cms-btn-icon bottom" @mouseenter="addHover" @mouseleave="addLeave"><span class="oi oi-plus"></span></a>
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
            ]
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

        loadData (data) {
            console.log('Group->loadData');
            console.log(data);

            for(let option of data.options) {
                this.addOption(option.id, option.data)
            }
        },

        addHover (ev) {

            if (ev.target.tagName === 'A') {
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

        optionDelete (option) {
            let i = this.findOptionIndex(option);

            if (i !== false) {
                this.children.splice(i, 1);
            }
        },

        findOptionIndex (option) {
            for (let i=0;i<this.children.length;i++) {
                if (this.children[i].ref === option.ref) {
                    console.log(option);
                    return i;
                }
            }

            return fallse;
        },

        addOption (id, data) {
            console.log('Group->addOption '+id);
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
    }
}
</script>