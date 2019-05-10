
<template>
    <div>
        <div class="row">

            <div class="col">
                <div style="display:inline-block;position: relative">
                    <file-preview v-model="value" show-delete="true" v-on:delete="deleteFile()"></file-preview>
                </div>
            </div>
            <div class="col">
                <button type="button" class="cms-btn" @click="selectFile()">Select file</button>
            </div>
        </div>
        <input type="hidden" :name="name" v-model="value.id">
    </div>
</template>

<script>
    import FileService from '../services/file'
    import FilePreview from './file-preview'

    export default {
        components:{
            'file-preview':FilePreview
        },

        data() {
            return {
                useFileBrowser : true,
                value: {
                    id: 0,
                    url : ''
                },
            }
        },
        computed : {
            hasFile () {
                return (this.value && this.value.id !== 0);
            }
        },
        props: ['name', 'initialValue'],
        methods: {
            fileChanged(file) {
                this.value = file;
                this.$refs['choose-media-file'].hide()
            },

            selectFile () {
                if (this.useFileBrowser) {
                    this.$showFileManager().then(response => {
                        if (response.status === 'success') {
                            this.value = response.data;
                        }
                    });
                } else {
                    this.$fileSelect.click();
                }
            },

            deleteFile () {
                console.log('deleteFile');
                this.value = {
                    id:0
                };
            }
        },
        mounted() {
            if (!!this.initialValue) {
                FileService.getFile(this.initialValue).then((response) => {
                    if (response.data.file) {
                        this.value = response.data.file;
                    }
                });
            }
        }
    }
</script>
<style>
    #choose-media-file .modal-body {
        height: 80vh;
        overflow: scroll;
    }
</style>