<template>
  <div>
    <table>
      <tr>
        <td class="fileUploadThumbnail"><img :src="value.url" /></td>
        <td class="fileUploadName">{{value.name}}</td>
      </tr>
    </table>
    <input type="hidden" :name="name" v-model="value.id">
    <button  type="button" class="cms-btn" v-b-modal.choose-media-file>Select file</button>
    <b-modal id="choose-media-file" ref="choose-media-file" size="lg">
      <file-manager @change="fileChanged" has-choose="true"></file-manager>
      <div slot="modal-footer"></div>
    </b-modal>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        value:'',
      }
    },
    props: ['name'],
    methods : {
      fileChanged(file){
        this.value = file
        this.$refs['choose-media-file'].hide()
      },
    }
  }
</script>