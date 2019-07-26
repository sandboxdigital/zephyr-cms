<template>
    <cms-field-row :label="label" fieldClass="cms-field-html">
        <div class="toolbar">
            <a href="#" class="cms-btn-icon" title="Hide" @click.prevent="toggleCode()"><i class="icon ion-md-code"></i></a>
        </div>
        <div id="editor-container" class="cms-field-html-editor" v-show="codeVisible" contenteditable ref="editor" @input="editorUpdate"></div>
        <div v-if="!codeVisible">
            <quill-editor
                ref="quillEditor"
                v-model="value"
                :content="value"
                @change="onQuillEditorChange($event)"
                :options="editorOption" />
        </div>
    </cms-field-row>
</template>

<script>

import fieldMixins from '../mixins/field'
import quillDefaults from '../quill/defaults'
import quillLineBreaks from '../quill/line-break'
import $ from 'jquery'

let options = $.extend(true, {}, quillDefaults, quillLineBreaks);

export default {

    mixins : [fieldMixins],

    data () {
        return {
            value:'',
            codeVisible:false,
            editorOption: options
        }
    },

    created () {

    },

    mounted () {
        if (this.field.data) {
            this.loadData(this.field.data)
        }

        this.quill = this.$refs.quillEditor.quill;

        $(this.$el).find('.ql-picker-options .ql-picker-item').click(() => {
            this.format('header2', $(this).data('value'));
        });

        this.quill.getModule('toolbar').addHandler('image', () => {
            this.selectLocalImage();
        });
    },

    methods : {
        loadData(data) {
            this.value = data.value;
        },

        onQuillEditorChange({quill, html, text}) {
            // console.log('editor change!', quill, html, text)
            this.content = html
        },

        toggleCode() {
            this.codeVisible = !this.codeVisible;

            if (this.codeVisible) {
                let code = this.value;

                // NL after block
                code = code.replace(/<\/p></g, "</p>\n<");
                code = code.replace(/<\/h1></g, "</h1>\n<");
                code = code.replace(/<\/h2></g, "</h2>\n<");
                code = code.replace(/<\/h3></g, "</h3>\n<");
                code = code.replace(/<\/h4></g, "</h4>\n<");
                code = code.replace(/<\/h5></g, "</h5>\n<");
                code = code.replace(/<\/li></g, "</li>\n<");


                // NL before block
                code = code.replace(/><li>/g, ">\n<li>");
                code = code.replace(/><ol>/g, ">\n<ol>");

                this.$refs.editor.innerText = code;
            }
        },

        editorUpdate(event) {
            this.value = event.target.innerText;
        },

        selectLocalImage() {
            this.$showFileManager().then(response => {
                if (response.status === 'success') {
                    this.insertToEditor(response.data.url);
                }
            });
        },

        insertToEditor(url) {
            // push image url to rich editor.
            const range = this.quill.getSelection();
            this.quill.insertEmbed(range.index, 'image', url);
        }
    }
}
</script>