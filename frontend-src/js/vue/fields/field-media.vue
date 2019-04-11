<template>
    <div class="cms-row cms-row-text">
        <div class="cms-label"><label>{{label}}</label></div>
        <div class="cms-field">
            <table>
              <tr>
                <td class="fileUploadThumbnail"><img :src="value.url" /></td>
                <td class="fileUploadName">{{value.name}}</td>
              </tr>
            </table>
            <button  type="button" class="cms-btn" v-b-modal.choose-media-file>Select file</button>
        </div>
        <b-modal id="choose-media-file" ref="choose-media-file" size="lg">
            <file-manager @change="fileChanged" :has-choose="true"></file-manager>
            <div slot="modal-footer"></div>
        </b-modal>
    </div>
</template>

<script>
    import fieldMixins from '../mixins/field'
    import FileService from '../services/file'

    export default {

        mixins : [fieldMixins],

        data () {
            return {
                value:'',
            }
        },

        created () {

        },

        mounted () {
            if (this.field.data) {
                this.loadData(this.field.data)
            }
        },

        methods : {
            loadData (data) {
                this.value = data.value;
            },
            fileChanged(file){
                console.log(file)
                this.value = file
                this.$refs['choose-media-file'].hide()
            },
        }
    }
</script>