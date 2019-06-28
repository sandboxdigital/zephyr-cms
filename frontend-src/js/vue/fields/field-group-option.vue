<template>
    <div class="cms-group-option CMSGroupoption">
        <div class="cms-group-option-title">
            <label class="cms-group-option-handle">{{label}} <span class="not-bold">{{subLabel}}</span></label>
        </div>
        <div class="cms-group-option-body" v-show="visible">
            <div v-for="child in fields" v-bind:is="child.component" v-bind:field="child" :ref="child.ref" :key="child.ref"></div>
            <div class="cms-row" v-if="fields.length === 0">
                <div class="cms-label cms-label"><label style="font-weight: normal;text-transform: none">This option has no fields</label></div>
                <!--<div class="cms-field cms-field cms-field-html"></div>-->
            </div>
        </div>
        <div class="cms-toolbar" id="">
            <div>
                <nobr>
                    <a href="#" class="cms-btn-icon" title="Hide" @click.prevent="toggle()"><span class="oi oi-eye"></span></a>
                    <!--<a href="#" class="cms-btn" title="Move"><span class="oi oi-move"></span></a>-->
                    <a href="#" class="cms-btn-icon" title="Delete" @click.prevent="deleteOption()"><span class="oi oi-trash"></span></a>
                </nobr>
            </div>
        </div>
    </div>
</template>

<script>
import FormHelper from '../helpers/form';
import fieldMixins from '../mixins/field';
import fieldWithChildrenMixins from '../mixins/field-with-children';
import find from 'lodash-es/find';

export default {

    mixins : [fieldMixins, fieldWithChildrenMixins],

    data () {
        return {
            hello:'ba1',
            elPath:'group',
            output:'group',
            visible:true,

            options : [],

            fields : []
        }
    },

    created () {

    },

    mounted () {

        this.createFields (this.field.spec.fields);

        if (this.field.data) {
            this.$nextTick(()=> {
                this.loadFieldsData(this.field.data);
            });
        }
    },

    computed : {
        subLabel () {
            if (this.field.spec.sublabelField) {
                let field = find(this.field.data, {id:this.field.spec.sublabelField});
                if (field) {
                    return ' - ' + field.value
                }
            }

            return ''
        }
    },

    methods : {

        getData () {
            let childData = [];
            let fields = this.field.spec.fields;
            for (let field of fields) {
                let comp = this.getFieldComponent(field.id);

                if (comp) {
                    childData.push(comp.getData());
                }
            }

            let data = fieldMixins.methods.getData.call(this);
            delete data.value;
            data.type = 'option';

            return Object.assign({}, data, {
                data:childData
            });
        },

        createField (spec) {
            let comp = FormHelper.getFieldComponent(spec.type);

            if (comp) {
                let child = {
                    component: comp,
                    id: spec.id,
                    ref: spec.id,
                    spec: spec
                };
                this.fields.push(child);
            }
        },

        deleteOption () {
            this.$emit('option-delete', this.field);
        },

        toggle () {
            this.visible = !this.visible;
        }
    }
}
</script>