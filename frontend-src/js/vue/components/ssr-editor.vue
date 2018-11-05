<!-- You can custom the "myQuillEditor" name used to find the quill instance in current component -->
<template>
    <div>
    <!-- bidirectional data binding（双向数据绑定） -->
    <!--<div class="quill-editor"-->
         <!--v-model="content"-->
         <!--v-quill:myQuillEditor="editorOption">-->
    <!--</div>-->

    <!-- Or manually control the data synchronization（手动控制数据流）  -->
        <div class="slot-wrapper sr-only"><slot></slot></div>
        <textarea :name="name" id="" class="sr-only" v-model="content"></textarea>
        <div class="quill-editor"
             v-model="content"

             @change="onEditorChange($event)"
             v-quill:myQuillEditor="editorOption">
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                content: '<p>example content</p>',
                editorOption: { /* quill options */ }
            }
        },
        props: ['name', 'initialContent'],
        mounted() {
            let html = this.$el.getElementsByClassName("slot-wrapper")[0].innerHTML;
            this.content = html;
        },
        methods: {
            onEditorChange(event) {

            }
        },
        // Omit the same parts as in the following component sample code
        // ...
    }
</script>