<template>
    <div class="cms-row cms-row-file">

        <div class="cms-label"><label>{{label}}</label></div>

        <div class="cms-field">
            <div class="row">
                <div class="col">
                    <div style="display:inline-block;position: relative">
                        <file-preview v-model="file" show-delete="true" v-on:delete="deleteFile()"></file-preview>
                    </div>
                </div>
                <div class="col">
                    <div v-if="progressText">{{progressText}}</div>
                    <button type="button" class="cms-btn" @click.prevent="selectFile">Select file</button>
                    <button type="button" class="cms-btn" style="display:none;" @click.prevent="deleteFile">Cancel upload</button>
                    <input class="fileUpload" type="file" style="visibility: hidden;width: 100px">
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import jQuery from 'jquery'
import fieldMixins from '../mixins/field'
import FileHelper from '../helpers/file'
import FilePreview from '../components/file-preview'

export default {
    components: {
        FilePreview
    },

    mixins : [fieldMixins],

    data () {
        return {
            progressText:'',
            files:[],
            useFileBrowser: true
        }
    },

    created () {

    },

    computed : {
        file () {
            if (this.files.length > 0) {
                return this.files[0];
            } else {
                return {
                    id:0,
                    url:''
                };
            }
        },

        hasFile () {
            return (this.file && this.file.id !== 0);
        }
    },

    mounted () {

        let _this = this;
        this.$fileSelect = jQuery(this.$el).find('.fileUpload');

        this.$fileSelect.change(function () {
            FileHelper.selectFile (this, {
                onStart : _this.onStart.bind(_this),
                onProgress : _this.onProgress.bind(_this),
                onSelect: _this.onDone.bind(_this),
                onError: _this.onError.bind(_this),
            });
        });
    },

    methods : {
        loadData (data) {
            this.files = data.files;
        },

        getData () {
            let data = fieldMixins.methods.getData.call(this);
            delete data.value;

            Object.assign(data, {files:this.files});

            return data;
        },

        selectFile () {
            if (this.useFileBrowser) {
                this.$showFileManager().then(response => {
                    if (response.status === 'success') {
                        this.files.push(response.data);
                    }
                });
            } else {
                this.$fileSelect.click();
            }
        },

        deleteFile () {
            let file = this.file;
            let i = this.findOptionIndex(file);

            if (i !== false) {
                this.files.splice(i, 1);
            }
        },

        findOptionIndex (file) {
            for (let i=0;i<this.files.length;i++) {
                if (this.files[i].url === file.url) {
                    return i;
                }
            }

            return fallse;
        },

        onStart () {

        },

        onError (error) {
            window.alert(error.message);
        },

        onProgress (p) {
            console.log(p);
            this.progressText = p+'%';

        },

        onDone (file) {
            this.progressText = '';
            // file = {
            //    id:'',
            //    url:'',
            //    thumbnailUrl: ''
            //    name:''
            // }

            this.files.push(file);

            let url = file.url;

            let ext = FileHelper.getExtension(url);

            if (ext !== "jpg" && ext !== "jpeg" && ext !== "png" && ext !== "gif") {
                // TODO - this path should be set via config
                url = "/core/images/fileicons/" + ext + ".png";
            }
        }
    }
}
</script>