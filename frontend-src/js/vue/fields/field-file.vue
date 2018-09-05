<template>
    <div class="cms-row cms-row-text">
        <div class="cms-label"><label>{{label}}</label></div>

        <div class="cms-field">
            <div class="FormFile">
                <div class="FormFilePreviewTable">
                    <table>
                        <tr id="fileUploadRow" v-for="file in files">
                            <td class="fileUploadThumbnail"><img :src="file.url" /></td>
                            <td class="fileUploadName">{{file.name}}</td>
                            <td class="fileUploadDelete">
                                <a href="#" class="formFileUploadDelete" @click.prevent="deleteFile(file)">Remove this file</a>
                            </td>
                        </tr>
                    </table>
                </div>
                <div id="'+this.elPath + '_FormFileButtons" class="FormFileButtons" style="float:left;">
                    <div v-if="progressText">{{progressText}}</div>
                    <div>
                        <button id="btnSelect" type="button" class="cms-btn" @click.prevent="selectFile">Select file</button>
                        <button id="btnCancel" type="button" class="cms-btn" style="display:none;" @click.prevent="deleteFile">Cancel upload</button>
                    </div>
                </div>
                <input class="fileUpload" type="file" style="visibility: hidden">
            </div>
        </div>
    </div>
</template>

<script>
import jQuery from 'jquery'
import fieldMixins from '../mixins/field'
import FileHelper from '../helpers/file'

export default {

    mixins : [fieldMixins],

    data () {
        return {
            progressText:'',
            files:[]
        }
    },

    created () {

    },

    mounted () {

        let _this = this;
        this.$fileSelect = jQuery(this.$el).find('.fileUpload');

        this.$fileSelect.change(function () {
            console.log(this);
            FileHelper.selectFile (this, {
                onStart : _this.onStart.bind(_this),
                onProgress : _this.onProgress.bind(_this),
                onSelect: _this.onDone.bind(_this),
                onError: _this.onError.bind(_this),
            });
        });
    },

    computed : {
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
            this.$fileSelect.click();
        },

        deleteFile (file) {
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