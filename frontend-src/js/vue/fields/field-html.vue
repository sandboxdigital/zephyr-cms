<template>
    <cms-field-row :label="label" fieldClass="cms-field-html">
        <!--<input type="text" name="field2" id="field1" class="text" v-model="value" />-->
        <div class="toolbar">
            <a href="#" class="cms-btn-icon" title="Hide" @click.prevent="toggleCode()"><i class="icon ion-md-code"></i></a>
        </div>
        <div id="editor-container" class="cms-field-html-editor" v-show="codeVisible" contenteditable ref="editor" @input="editorUpdate"></div>
        <div v-if="!codeVisible">
            <rich-text-editor
                ref="quillEditor"
                v-model="value"
                :content="value"
                @change="onQuillEditorChange($event)"
                :options="editorOption" />
        </div>
    </cms-field-row>
</template>

<script>

import Quill from 'quill'
import fieldMixins from '../mixins/field'
import LinkArrowBlot from  '../quill-custom-toolbars/LinkArrowBlot'
import $ from 'jquery'

let icons = Quill.import('ui/icons');
icons['link-arrow'] = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M 12 2 C 6.477 2 2 6.477 2 12 C 2 17.523 6.477 22 12 22 C 17.523 22 22 17.523 22 12 C 22 6.477 17.523 2 12 2 z M 12 4 C 16.418 4 20 7.582 20 12 C 20 16.418 16.418 20 12 20 C 7.582 20 4 16.418 4 12 C 4 7.582 7.582 4 12 4 z M 11 6.9296875 L 9.5 8.4296875 L 13.070312 12 L 9.5 15.570312 L 11 17.070312 L 16.070312 12 L 11 6.9296875 z"></path> </svg>'


export default {

    mixins : [fieldMixins],

    data () {
        return {
            value:'',
            codeVisible:false,

            editorOption: {
                modules: {
                    toolbar: {
                        container: [
                            ['bold', 'italic', 'underline','blockquote'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' },{ 'align': [] }],
                            ['clean','link', 'link-arrow'],
                            [{ 'size': ['small', false, 'large', 'huge'] }],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'align': [] }],
                        ],
                        handlers: {
                            'link-arrow' : function(value){
                                if (value === true) {
                                    value = prompt('Enter link URL:'); // eslint-disable-line no-alert
                                }
                                this.quill.format('link-arrow', value, Quill.sources.USER);
                            }
                        }
                    }

                },
                placeholder: 'Compose something epic...',
                theme: 'snow'  // or 'bubble'
            }
        }
    },

    created () {

    },

    mounted () {
        if (this.field.data) {
            this.loadData(this.field.data)
        }

        Quill.register(LinkArrowBlot);
        console.log('asd');
        let quill = this.$refs.quillEditor.quill

        // $( this.$el ).find( 'button.ql-link-arrow').click(function() {
        //     let value = prompt('Enter link URL');
        //     quill.format('link-arrow', value);
        // });

        $( this.$el ).find( '.ql-picker-options .ql-picker-item').click(function() {
            quill.format('header2', $(this).data('value'));
        });
    },

    computed : {
    },

    methods : {
        loadData (data) {
            this.value = data.value;
        },

        onQuillEditorChange({ quill, html, text }) {
            console.log('editor change!', quill, html, text)
            this.content = html
        },

        toggleCode ()
        {
            this.codeVisible = !this.codeVisible;

            if (this.codeVisible) {
                let code = this.value;

                // NL after block
                code = code.replace(/<\/p></g,"</p>\n<");
                code = code.replace(/<\/h1></g,"</h1>\n<");
                code = code.replace(/<\/h2></g,"</h2>\n<");
                code = code.replace(/<\/h3></g,"</h3>\n<");
                code = code.replace(/<\/h4></g,"</h4>\n<");
                code = code.replace(/<\/h5></g,"</h5>\n<");
                code = code.replace(/<\/li></g,"</li>\n<");


                // NL before block
                code = code.replace(/><li>/g,">\n<li>");
                code = code.replace(/><ol>/g,">\n<ol>");

                this.$refs.editor.innerText = code;
            }
        },

        editorUpdate (event) {
            this.value = event.target.innerText;
        }
    }
}
</script>