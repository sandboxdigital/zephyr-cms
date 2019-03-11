<template>
    <div>
        <div class="slot-wrapper sr-only"><slot></slot></div>
        <textarea :name="name" id="" class="sr-only" v-model="content"></textarea>
        <div class="toolbar">
            <a href="#" class="cms-btn-icon" title="Hide" @click.prevent="toggleCode()"><i class="icon ion-md-code"></i></a>
        </div>
        <div id="editor-container" class="cms-field-html-editor" v-show="codeVisible" contenteditable ref="editor" @input="editorUpdate"></div>
        <div v-if="!codeVisible">
            <quill-editor class="quill-editor"
                 v-model="content"
                 @change="onEditorChange($event)"
                 :options="editorOption">
            </quill-editor>
        </div>
    </div>
</template>

<script>
    import quillLineBreak from '../quill/line-break'
    import quillDefaults from '../quill/defaults'
    import $ from 'jquery'

    let options = $.extend(true, {}, quillDefaults, quillLineBreak);

    export default {
        data() {
            return {
                codeVisible:false,
                content: '<p>example content</p>',
                editorOption: options
            }
        },

        props: [
            'name',
            'initialContent',
        ],

        computed: {
            editor() {
                return this.$refs.myQuillEditor.quill
            }
        },

        mounted() {
            //console.log('this is current quill instance object', this.editor)

            if (this.initialContent) {
                // console.log('this.initialContent');
                // console.log(this.initialContent);
                this.content = this.initialContent;
            } else {
                let html = this.$el.getElementsByClassName("slot-wrapper")[0].innerHTML;
                this.content = html;
            }
        },

        methods: {
            onEditorChange(event) {

            },

            toggleCode ()
            {
                this.codeVisible = !this.codeVisible;

                if (this.codeVisible) {
                    let code = this.content;

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
                this.content = event.target.innerText;
            }
        },
    }
</script>