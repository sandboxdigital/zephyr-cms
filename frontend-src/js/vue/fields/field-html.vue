<template>
    <cms-field-row :label="label" fieldClass="cms-field-html">
        <!--<input type="text" name="field2" id="field1" class="text" v-model="value" />-->
        <div class="toolbar">
            <a href="#" class="cms-btn-icon" title="Hide" @click.prevent="toggleCode()"><i class="icon ion-md-code"></i></a>
        </div>
        <div class="cms-field-html-editor" v-show="codeVisible" contenteditable ref="editor" @input="editorUpdate"></div>
        <div v-if="!codeVisible">
            <rich-text-editor
                v-model="value"
                :options="editorOption" />
        </div>
    </cms-field-row>
</template>

<script>
import fieldMixins from '../mixins/field'

export default {

    mixins : [fieldMixins],

    data () {
        return {
            value:'',
            codeVisible:false,

            editorOption: {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline','blockquote'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' },{ 'align': [] }],
                        ['clean','link'],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                    ]
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
    },

    computed : {
    },

    methods : {
        loadData (data) {
            this.value = data.value;
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