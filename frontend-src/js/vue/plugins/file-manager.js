
// import Vue from 'vue';
import FileManagerModal from '../components/file-manager/file-modal';
import ModalService from "../helpers/modal";

let fileModal = null;
let fileModalCallback = null;

const FileManager = {
    install (Vue, options) {
        // console.log('FileManager');

        Vue.showFileBrowser = function () {


        };

        Vue.prototype.$showFileManager = function () {
            return ModalService.createModal (FileManagerModal, Vue, this);
        };
    }
};




export default FileManager;