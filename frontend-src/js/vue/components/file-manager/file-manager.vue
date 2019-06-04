<style>
    .VuePagination__count{
        display: none;
    }
</style>
<template>
    <div>
        <div class="zph-cms-row">
            <div class="zph-page-list" :class="{'list-hidden':!pageListVisible}">
                <h5 v-if="pageListVisible">Directories</h5>
                <div class="directory-actions" v-if="pageListVisible">
                    <a class="cms-btn-icon btn-cms-default float-left" href="#" @click.prevent="openCreateUpdateDirectory()"><i class="icon ion-md-folder"></i></a>
                    <a class="cms-btn-icon btn-cms-default float-left" href="#" @click.prevent="openCreateUpdateDirectory(true)"><i class="icon ion-md-create"></i></a>
                    <a class="cms-btn-icon btn-cms-default float-left" href="#" @click.prevent="openAddDirectoryPermissionsModal()"><i class="icon ion-md-people"></i></a>
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
                <div class="clearfix"></div>
                <table class="cms-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th class="controls"><button class="cms-btn btn-sm float-right" v-b-modal.upload-modal><i class="icon ion-md-cloud-upload"></i> Upload</button></th>
                        </tr>
                    </thead>
                    <tbody class="files" v-show="files && files.length && !loadingFiles">
                        <tr v-for="file in files" v-if="file">
                            <td>{{file.id}}</td>
                            <td v-if="file.type === 'file'"><img :src="file['url-thumbnail']" alt="" width="48px"> {{file.name}}</td>
                            <td v-if="file.type === 'link'"><a target="_blank" :href="file.link_url">{{file.link_url}}</a></td>
                            <td style="text-align: right">
                                <button class="cms-btn btn-sm" v-if="hasChoose" @click.prevent="chooseFile(file)">Choose</button>
                                <button class="cms-btn btn-sm" @click.prevent="deleteFile(file.id)"><i class="icon ion-md-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                    <span v-show="files && files.length === 0 && !loadingFiles" class="ml-3">There's no files</span>
                    <span v-show="loadingFiles">Loading...</span>

                </table>
                <pagination v-model="page" :records="recordsCount" :options="paginationOption" :per-page="100" @paginate="pageChanged"></pagination>
            </div>
        </div>
        <b-modal id="upload-modal" size="lg" ref="upload-modal" hide-footer>
            <div slot="modal-header">Upload file</div>
            <div class="row">
                <div class="col-6">
                    <b-form-group>
                        <vue-dropzone ref="myVueDropzone" id="dropzone"
                                      v-on:vdropzone-queue-complete="queueComplete"
                                      v-on:vdropzone-sending="sendingEvent"
                                      :options="dropzoneOptions">
                        </vue-dropzone>
                    </b-form-group>
                    <b-form-group>
                        <b-button @click="processQueue">Upload</b-button>
                    </b-form-group>
                </div>
                <div class="col-6 border-left">
                    <form @submit.prevent="createLink()">
                        <b-form-group>
                            <label>Enter Link</label>
                            <b-form-input
                                v-model="linkForm.url"
                                required
                                placeholder="Enter link"
                            ></b-form-input>
                        </b-form-group>
                        <b-form-group >
                            <b-button class="float-right" type="submit">Submit</b-button>
                        </b-form-group>
                    </form>
                </div>
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

        <b-modal size="lg" id="add-directory-permissions" ref="add-directory-permissions">
            <div slot="modal-header">Add/Update Permissions</div>
            <b-form-group>
                <b-form-checkbox
                    class="float-left"
                    v-model="areAllRolesSelected"
                    aria-describedby="flavours"
                    aria-controls="flavours"
                    @change="toggleSelectedRoles"
                    switch
                >
                    {{ areAllRolesSelected ? 'Un-select All' : 'Select All' }}
                </b-form-checkbox>
                <b-button class="float-right" @click="addDirectoryPermissions" variant="primary">{{savingPermission ? 'Saving' : 'Save'}}</b-button>

                <b-form-checkbox-group
                    v-model="selectedRoles"
                    name="selected_roles"
                    aria-label="Roles"
                    switches
                >
                    <b-table class="cms-table" :items="roles" :fields="['label', 'actions']">
                        <template slot="actions" slot-scope="row">
                            <b-form-checkbox :value="row.item.id"></b-form-checkbox>
                        </template>
                    </b-table>
                </b-form-checkbox-group>
            </b-form-group>
            <div slot="modal-footer">
                <b-button @click="addDirectoryPermissions" variant="primary">{{savingPermission ? 'Saving' : 'Save'}}</b-button>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import Vue from 'vue'
    import FileService from '../../services/file'
    import vue2Dropzone from 'vue2-dropzone'
    import 'vue2-dropzone/dist/vue2Dropzone.min.css'
    import Events from '../../core/event-bus'
    import $ from 'jquery'
    import _chunk from 'lodash/chunk'
    import RoleService from '../../services/roles'
    import _map from 'lodash/map'

    export default {
        components: {
            vueDropzone: vue2Dropzone,
        },
        props: {
            hasChoose: Boolean,
            dzOption: Object
        },
        data () {
            return {
                tree: [],
                files: [],
                recordsCount: 0,
                page: 1,
                savingPermission: false,
                selectedDirectoryNode: {
                    id: null,
                    title: null
                },
                directoryCreate: true,
                directoryPermissions: [],
                form : {
                    directory : {
                        title : null
                    }
                },
                linkForm: {
                    url: null
                },
                pageListVisible:true,
                loadingFiles: false,
                selectedRoles: [],
                roles : [],
                loadingRoles: false,
                areAllRolesSelected: false,
                paginationOption: { theme: 'bootstrap4'}
            }
        },
        computed: {
            dropzoneOptions(){
                let defaultOptions = {
                    url: '/cms-api/files/upload',
                    thumbnailWidth: 150,
                    autoProcessQueue: false,
                    headers: { 'X-CSRF-TOKEN' : $('meta[name="csrf-token"]').attr('content') },
                    uploadMultiple: true,
                    addRemoveLinks: true,
                    maxFiles: 5,
                    maxFilesize: 20
                }

                if(this.dzOption && typeof this.dzOption === 'object'){
                    return Object.assign({}, defaultOptions, this.dzOption)
                }

                return defaultOptions
            }
        },

        created () {


            Events.$on('fm-change-directory', node => {
                // console.log('Event: directory changed')
                this.getFiles(node.id)
                this.selectedDirectoryNode = node;
            })
            this.getTree(true)
            this.getRoles()
        },
        methods : {
            createLink(){
                let node = this.selectedDirectoryNode.id;
                this.linkForm.node = node;
                FileService.createLink(this.linkForm).then( response => {
                    this.linkForm.url = null
                    this.refreshFiles()
                    this.$refs['upload-modal'].hide()
                })
            },
            /* Directories */
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

            /* Files */
            chooseFile(file){
                this.$emit('change', file)
            },
            deleteFile(id){
                var r = confirm("Are you sure you want to delete this file?");
                if (r == true) {
                    FileService.deleteFile(id).then(response => {
                        this.refreshFiles()
                    })
                }
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

            /* Permissions */
            getDirectoryPermissions(){
                this.loadingRoles = true
                FileService.getDirectoryPermissions(this.selectedDirectoryNode.id).then(response => {
                    this.directoryPermissions = response.data.permissions;
                    this.selectedRoles = _map(this.directoryPermissions, 'id')
                    this.loadingRoles = false
                })
            },
            openAddDirectoryPermissionsModal() {
                this.$refs['add-directory-permissions'].show()
                this.getDirectoryPermissions()
            },
            addDirectoryPermissions() {
                this.savingPermission = true;
                FileService.addDirectoryPermissions(this.selectedDirectoryNode.id, this.selectedRoles).then(response => {
                    this.getDirectoryPermissions()
                    this.savingPermission = false
                    this.$refs['add-directory-permissions'].hide()
                })
            },

            /* Roles */
            getRoles() {
                RoleService.getRoles().then((response) => {
                    this.roles = response.data
                })
            },
            toggleSelectedRoles(checked) {
                console.log(checked     )
                this.selectedRoles = checked ? _map(this.roles, 'id') : []
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
        max-width: 250px;
        flex: 0 0 25%;
        overflow-x: scroll;
    }
    .zph-page-form {
        max-width: 75%;
        flex: 0 0 75%;
    }

</style>