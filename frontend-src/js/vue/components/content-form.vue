<template>
    <div class="cms-form">
        <div v-for="child in fields" v-bind:is="child.component" v-bind:field="child" v-bind:ref="child.ref" :key="child.ref"></div>

        <div class="cms-row-buttons-fixed" v-fixed-in-parent>
            <div class="cms-row cms-row-buttons" v-if="link_id && !hideSave">
                <button class="cms-btn" @click="save">Save</button>
                <!--<button class="cms-btn cms-btn-secondary" @click="saveAndClose">Save &amp; Close</button>-->
                <span class="cms-message" v-if="message">{{message}}</span>
            </div>
        </div>
        <div v-if="!templateId">
            <p>No content template defined</p>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery'
    import FormHelper from '../helpers/form'
    import fieldWithChildrenMixins from '../mixins/field-with-children'
    import axios from 'axios';

    export default {
        mixins: [fieldWithChildrenMixins],

        data () {
            return {
                spec:{},

                fields: [],
                templateId:0,
                link_id:0,
                link_type:0,
                hideSave:false,
                message:''
            }
        },

        created () {

        },

        mounted () {
            let $el = $(this.$el);
            if ($el.data('content-template-id') && $el.data('link-id') && $el.data('link-type')) {
                this.loadTemplateId($el.data('content-template-id'), $el.data('link-type'), $el.data('link-id'));

                this.hideSave = true;

                let form = $el.parents('form');

                if (form.length) {
                    form.on('submit',()=>{
                        console.log('SUBMITTING!!!!');
                        this.save();
                    })
                }
            }
        },

        methods : {
            loadTemplateId (templateId, linkType, linkId) {
                this.templateId = templateId;
                this.link_id = linkId;
                this.link_type = linkType;
                this.fields = [];

                axios.get('/cms-api/content-templates/'+templateId)
                    .then(response => {
                        let template = response.data;
                        let spec = JSON.parse(template.spec);
                        this.spec = spec;

                        this.createFields (this.spec.fields);

                        // Make sure field components are created
                        // then load content
                        this.$nextTick(()=>{
                            axios.get('/cms-api/content/'+linkType+'/'+linkId)
                                .then(response => {
                                    let contentData = response.data;
                                    if (contentData && contentData.content) {
                                        let contentRecord = contentData.content;
                                        let content = JSON.parse(contentRecord.content);
                                        this.loadFieldsData(content.data);
                                    }
                                    // else {
                                    //     this.clearFieldsData();
                                    // }
                                });
                        });
                    }).catch(r => {
                        this.spec = {
                            fields:{}
                        };

                        this.createFields (this.spec.fields);
                    });
            },

            clearTemplate () {
                this.link_id = 0;
                this.link_type = '';
                this.fields = [];
            },

            loadJson (json) {
                // this.json = json;
                // this.children = json.elements;
            },

            save () {
                this.message = 'Saving ...';
                let data = [];
                let fields = this.spec.fields;
                for (let field of fields) {
                    let comp = this.getFieldComponent(field.id);

                    if (comp) {
                        data.push (comp.getData());
                    } else {
                        console.log('HMMMMM could not find '+field.id);
                    }
                }


                let formData = {data:data};
                let jsonString = JSON.stringify(formData);

                let contentRecord = {
                    link_id: this.link_id,
                    link_type: this.link_type,
                    content: jsonString
                };

                axios.post('/cms-api/content/save', contentRecord)
                    .then(response => {
                        console.log(response);
                        this.message = 'Saved';
                        setTimeout(() => {
                            this.message = '';
                        },2000);
                    })
            },

            saveAndClose () {

            },
            //
            // getChildComponent (key) {
            //     let comp = this.$refs[key];
            //
            //     if (comp) {
            //         return comp[0];
            //     }
            //     return null;
            // },

            getFieldSpec (key) {
                let fields = this.spec.fields;
                return fields[key];
            },

            createField (spec) {
                let id = spec.id;
                console.log('Form->createField '+id);
                let comp = FormHelper.getFieldComponent(spec.type);

                if (comp) {
                    let child = {
                        component: comp,
                        id: id,
                        ref: id,
                        spec: spec
                    };
                    this.fields.push(child);
                }
            },
        }
    }
</script>