
<template>
    <b-modal class="cms-file-modal" v-model="modalVisible" @hide="onModalHide()" size="lg" title="Files" no-enforce-focus hide-footer >
        <file-manager @change="onFileManagerFileChanged"
                      :has-choose="true"
                      :show-permissions="false"></file-manager>
    </b-modal>
</template>

<script>
    import ModalMixins from "../../mixins/modal";

    export default {
        mixins:[ModalMixins],

        methods : {
            onFileManagerFileChanged (file) {
                this.modalReturn (file);
            }
        }
    }
</script>