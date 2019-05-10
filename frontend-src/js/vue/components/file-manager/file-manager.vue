
<template>
    <div>
        <div class="zph-cms-row">
            <div class="zph-page-list" :class="{'list-hidden':!pageListVisible}">
                <h5 v-if="pageListVisible">Directories</h5>
                <div class="directory-actions" v-if="pageListVisible">
                    <a class="cms-btn-icon btn-cms-default float-left" href="#" @click.prevent="openCreateUpdateDirectory()"><i class="icon ion-md-folder"></i></a>
                    <a class="cms-btn-icon btn-cms-default float-left" href="#" @click.prevent="openCreateUpdateDirectory(true)"><i class="icon ion-md-create"></i></a>
                    <a class="cms-btn-icon btn-cms-default float-left" href="#" @click.prevent="deleteDirectory()"><i class="icon ion-md-trash"></i></a>
                </div>
                <div class="lists" v-if="pageListVisible">
                    <ul class="list-accordion" id="sortable">
                        <child-menu :node="tree[0]" initial-state="open"></child-menu>
                    </ul>
                </div>
                <a @click.prevent="pageListVisible = !pageListVisible;" class="cms-btn-icon toggle-pages"><i class="icon" :class="{'ion-md-arrow-dropleft':pageListVisible,'ion-md-arrow-dropright':!pageListVisible}"></i></a>
            </div>
            <div id="files-table-container" class="zph-page-form" :class="{'list-hidden':!pageListVisible}">
                <div class="clearfix">

                </div>
                <table class="cms-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th class="controls"><button class="cms-btn btn-sm float-right" v-b-modal.upload-modal><i class="icon ion-md-cloud-upload"></i> Upload</button></th>
                        </tr>
                    </thead>
                    <tbody class="files" v-show="files.length && !loadingFiles">
                        <tr v-for="file in files" v-if="file">
                            <td>{{file.id}}</td>
                            <td><img :src="file['url-thumbnail']" alt="" width="48px"> {{file.fullname}}</td>
                            <td style="text-align: right">
                                <button class="cms-btn btn-sm" v-if="hasChoose" @click.prevent="chooseFile(file)">Choose</button>
                                <button class="cms-btn btn-sm" @click.prevent="deleteFile(file.id)"><i class="icon ion-md-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                    <span v-show="files.length === 0 && !loadingFiles" class="ml-3">There's no files</span>
                    <span v-show="loadingFiles">Loading...</span>

                </table>
                <pagination v-model="page" :records="recordsCount" :per-page="100" @paginate="pageChanged"></pagination>
            </div>
        </div>
        <b-modal id="upload-modal" ref="upload-modal">
            <div slot="modal-header">Drop files</div>
            <vue-dropzone ref="myVueDropzone" id="dropzone"
                          v-on:vdropzone-queue-complete="queueComplete"
                          v-on:vdropzone-sending="sendingEvent"
                          :options="dropzoneOptions">
            </vue-dropzone>
            <div slot="modal-footer">
                <b-button @click="processQueue">Upload</b-button>
            </div>
        </b-modal>

        <b-modal id="create-update-directory" ref="create-update-directory">
            <div slot="modal-header">{{directoryCreate ? "Create Directory" : "Update Directory"}}</div>
            <b-form-group
                    label="Name"
            >
                <b-form-input
                        v-model="form.directory.title"
                        required
                        placeholder="Enter name"
                ></b-form-input>
            </b-form-group>
            <div slot="modal-footer">
                <b-button v-if="directoryCreate" @click="createUpdateDirectory" variant="primary">Save</b-button>
                <b-button v-if="!directoryCreate" @click="createUpdateDirectory" variant="primary">Save</b-button>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import Vue from 'vue'
    import FileService from '../../services/file'
    import vue2Dropzone from 'vue2-dropzone'
    import Pagination from 'vue-pagination-2';
    import 'vue2-dropzone/dist/vue2Dropzone.min.css'
    import Events from '../../core/event-bus'
    import $ from 'jquery'
    import _chunk from 'lodash/chunk'

    export default {
        components: {
            vueDropzone: vue2Dropzone,
            pagination: Pagination
        },
        props: {
            hasChoose: Boolean
        },
        data () {
            return {
                tree: [],
                files: [],
                recordsCount: 0,
                page: 1,
                selectedDirectoryNode: {
                    id: null,
                    title: null
                },
                directoryCreate: true,
                form : {
                    directory : {
                        title : null
                    }
                },
                pageListVisible:true,
                loadingFiles: false
            }
        },
        computed: {
            dropzoneOptions(){
                return {
                    url: '/cms-api/files/upload',
                    thumbnailWidth: 150,
                    maxFilesize: 0.5,
                    autoProcessQueue: false,
                    headers: { 'X-CSRF-TOKEN' : $('meta[name="csrf-token"]').attr('content') },
                    uploadMultiple: true,
                    addRemoveLinks: true,
                    maxFiles: 5,
                    maxFilesize: 10
                }
            }
        },

        created () {


            Events.$on('fm-change-directory', node => {
                console.log('Event: directory changed')
                this.getFiles(node.id)
                this.selectedDirectoryNode = node;
            })
            this.getTree(true)
        },
        methods : {
            openCreateUpdateDirectory(update = false){
                this.directoryCreate = !update;
                this.$refs['create-update-directory'].show()
            },
            createUpdateDirectory(){
                this.$refs['create-update-directory'].hide()
                FileService.createUpdateDirectory(this.selectedDirectoryNode.id, this.directoryCreate , this.form.directory).then(response => {
                    this.getTree();
                    this.form.directory.title = '';
                })
            },
            deleteDirectory(){
                var r = confirm("Are you sure you want to delete?");
                if (r == true) {
                    FileService.deleteDirectory(this.selectedDirectoryNode.id).then(response => {
                        this.getTree();
                    })
                }
            },
            chooseFile(file){
                this.$emit('change', file)
            },
            deleteFile(id){
                FileService.deleteFile(id).then(response => {
                    this.refreshFiles()
                })
            },
            getFiles(id){
                this.loadingFiles = true;
                FileService.getFiles(id).then(response => {
                    this.files = response.data;
                    this.paginate(response.data);
                    this.loadingFiles = false;
                })
            },
            refreshFiles(){
                this.getFiles(this.selectedDirectoryNode.id);
            },
            getTree(goBackToRoot = false) {
                FileService.getTree().then(response => {
                    this.tree = response.data.tree;
                    if(goBackToRoot){
                        Vue.nextTick(() => {
                            Events.$emit('fm-change-directory', this.tree[0]);
                        })
                    }

                })
            },
            /* Dropzone methods */
            processQueue(){
                this.$refs.myVueDropzone.processQueue()
            },
            sendingEvent(file, xhr, formData) {
                formData.append('node', this.selectedDirectoryNode.id);
            },
            resetUpload(){
                this.$refs.myVueDropzone.removeAllFiles();
            },
            queueComplete (file, response){
                console.log('queue complete');
                this.$refs['upload-modal'].hide()
                this.refreshFiles()
                setTimeout(() =>{
                    this.resetUpload();
                }, 1000)
            },
            paginate(results){
                this.page = 1;
                this.recordsCount = results.length;
                this.results = _chunk(results, 100);
                this.files = this.results[this.page - 1];
            },
            pageChanged() {
                this.files = this.results[this.page - 1];
                let top = $("#files-table-container").offset().top;
                $('html,body').animate({ scrollTop: top}, 500);
            },
        }
    }
</script>
<style lang="scss" scoped>
    .directory-actions{
        display: block;
        width: 100%;
        min-height: 30px;
        a {
            margin-right: 3px;
        }
    }
    .lists{
        display: block;
    }
    .files {
        td {
            height: 45px;
            font-size: 14px;
            max-height: 75px;
            max-width: 500px;
            text-overflow: ellipsis;
            img {
                max-height: 50px;
            }
        }
    }
    .cms-btn{
        box-shadow: 0px 0px 1px 0px #a5a0a0;
        margin: 3px 0;
        color: #666;
        display: inline-block;

        &.btn-sm {
            padding: 4px 8px !important;
        }
    }

    .zph-page-list{
        max-width: 200px;
        flex: 0 0 25%;

    }
    .zph-page-form {
        max-width: 75%;
        flex: 0 0 75%;
    }

</style>