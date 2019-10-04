<style>
    .VuePagination__count{
        display: none;
    }

    .file-filter-role {
        width: 150px !important;
        margin-top: 2px;
    }
</style>
<template>
    <div>
        <div class="zph-cms-row zph-file-manager">
            <div class="zph-page-list" :class="{'list-hidden':!pageListVisible}">
                <h5 v-if="pageListVisible">Directories</h5>
                <div class="directory-actions" v-if="pageListVisible">
                    <a class="cms-btn-icon btn-cms-default float-left" href="#" @click.prevent="openCreateUpdateDirectory()"><i class="icon ion-md-folder"></i></a>
                    <a class="cms-btn-icon btn-cms-default float-left" href="#" @click.prevent="openCreateUpdateDirectory(true)"><i class="icon ion-md-create"></i></a>
                    <a class="cms-btn-icon btn-cms-default float-left cms-btn-dir-permissions" href="#" v-if="showPermissions" @click.prevent="openAddDirectoryPermissionsModal()"><i class="icon ion-md-people"></i></a>
                    <a class="cms-btn-icon btn-cms-default float-left" href="#" @click.prevent="deleteDirectory()"><i class="icon ion-md-trash"></i></a>
                </div>
                <div class="lists" v-if="pageListVisible">
                    <ul class="list-accordion" id="sortable">
                        <file-manager-child :node="tree[0]" initial-state="open"></file-manager-child>
                    </ul>
                </div>
                <a @click.prevent="pageListVisible = !pageListVisible" class="cms-btn-icon toggle-pages"><i class="icon" :class="{'ion-md-arrow-dropleft':pageListVisible,'ion-md-arrow-dropright':!pageListVisible}"></i></a>
            </div>
            <div id="files-table-container" class="zph-page-form pt-1" :class="{'list-hidden':!pageListVisible}">
                <button type="button" class="cms-btn btn-sm ml-2 float-left cms-btn-group-permissions" v-if="showPermissions" @click="openMultipleFilePermission"><i class="icon ion-md-people"></i> Permissions</button>
                <b-select class="file-filter-role float-left ml-2" v-if="showPermissions" :options="[{id: 0, 'label': 'Select role'}].concat(roles)" text-field="label" value-field="id" v-model="fileFilterRole" size="sm"></b-select>
                <button type="button" class="cms-btn btn-sm mr-2 float-right" v-b-modal.upload-modal><i class="icon ion-md-cloud-upload"></i> Upload</button>
                <table class="cms-table">
                    <thead>
                        <tr>
                            <th class="file-checkbox"><b-checkbox v-model="areAllFilesSelected" @change="toggleSelectAllFiles"></b-checkbox></th>
<!--                            <th>Id</th>-->
                            <th>
<!--                                <span class="float-left">File</span>-->
                                <div class="input-group input-group-sm float-left" style="width: 200px;">
                                    <input v-model="fileName" placeholder="Filter files" class="form-control" />
                                    <div class="input-group-append" v-if="fileName !== ''">
                                        <button class="btn btn-outline-secondary" @click="fileName=''"><i class="icon ion-md-close"></i></button>
                                    </div>
                                </div>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody class="files">
                        <tr v-for="file in files" v-if="file" :key="file.id">
                            <td class="file-checkbox" style="width: 20px;"><b-checkbox v-model="selectedFiles" :value="file.id"></b-checkbox></td>
<!--                            <td>{{file.id}}</td>-->
                            <td v-if="file.type === 'file' && showThumbnail"><img onerror="this.style.display='none'" :src="file['url-thumbnail']" alt="" width="48px"></td>
                            <td v-if="file.type === 'link' && showThumbnail">-</td>
                            <td v-if="file.type === 'file'" class="file-name">{{file.name}}</td>
                            <td v-if="file.type === 'link'" class="file-name"><a target="_blank" :href="file.link_url">{{file.link_url}}</a></td>
                            <td class="file-controls">
                                <button class="cms-btn btn-sm" v-if="hasChoose" @click.prevent="chooseFile(file)">Choose</button>
                                <button class="cms-btn-icon btn-cms-default cms-btn-permissions" v-if="showPermissions" @click.prevent="openFilePermission(file.id)"><i class="icon ion-md-people"></i></button>
                                <button class="cms-btn-icon btn-cms-default" @click.prevent="deleteFile(file.id)"><i class="icon ion-md-trash"></i></button>
                            </td>
                        </tr>
                        <tr v-if="files && files.length === 0 && !loadingFiles">
                            <td colspan="4">There are no files</td>
                        </tr>
                        <tr v-if="loadingFiles">
                            <td colspan="4">Loading...</td>
                        </tr>
                    </tbody>

                </table>
                <div>
                    <div class="float-left">
                        <pagination v-model="page"
                                    :records="recordsCount"
                                    :options="paginationOption"
                                    :per-page="recordsPerPage"
                                    @paginate="pageChanged"></pagination>
                    </div>
                    <div class="float-right" style="margin-right: 10px;">
                        {{pageFirstRecord}} to {{pageLastRecord}} of {{recordsCount}}
                    </div>
                </div>

            </div>
        </div>
        <b-modal id="upload-modal" size="lg" ref="upload-modal" hide-footer title="Upload file">
            <div slot="modal-header" slot-scope="{ close }">
                <button type="button" aria-label="Close" class="close" @click.prevent="close()">×</button>
            </div>
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

            <form @submit.prevent="createUpdateDirectory()">
                <b-form-group label="Name">
                    <b-form-input
                            v-model="form.directory.title"
                            required
                            placeholder="Enter name"
                    ></b-form-input>
                </b-form-group>
            </form>
            <div slot="modal-footer">
                <b-button v-if="directoryCreate" @click="createUpdateDirectory" variant="primary">Save</b-button>
                <b-button v-if="!directoryCreate" @click="createUpdateDirectory" variant="primary">Save</b-button>
            </div>
        </b-modal>

        <b-modal size="lg" id="add-directory-permissions" ref="add-directory-permissions" @hide="onModalPermissionsHide">
            <div slot="modal-header" style="width: 100%">
                <div class="float-left">
                    Add/Update Permissions
                </div>
                <div class="float-right">
                    <b-button @click="updateFileDirectoryPermissions(true)" variant="primary">{{savingPermission ? 'Saving' : 'Save and close'}}</b-button>
                </div>
            </div>

            <b-form-checkbox-group
                    v-model="selectedRoles"
                    name="selected_roles"
                    aria-label="Roles"
                    switches>
            <table class="table">
                <thead>
                    <tr>
                        <th>
                            <div class="input-group">
                                <input v-model="filterRole" placeholder="Filter roles" class="form-control" />
                                <div class="input-group-append" v-if="filterRole !== ''">
                                    <button class="btn btn-outline-secondary" @click="filterRole=''"><i class="icon ion-md-close"></i></button>
                                </div>
                            </div>
                        </th>
                        <th class="text-right">
                            <span style="margin: 9px 10px 0 0;">Select</span>
                            <div class="btn-group">
                                <button @click="toggleSelectedRoles(true)" class="btn btn-outline-secondary">All</button> <button @click="toggleSelectedRoles(false)" class="btn btn-outline-secondary">None</button>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="role in roleOptions">
                        <td>{{role.label}}</td>
                        <td class="text-right"><b-form-checkbox :value="role.id"></b-form-checkbox></td>
                    </tr>
                </tbody>

            </table>
            </b-form-checkbox-group>

            <div slot="modal-footer">
                <b-button @click="updateFileDirectoryPermissions(true)" variant="primary">{{savingPermission ? 'Saving' : 'Save and close'}}</b-button>
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
    import _union from 'lodash/union'
    import _difference from 'lodash/difference'
    import _filter from 'lodash/filter'

    export default {
        components: {
            vueDropzone: vue2Dropzone,
        },
        props: {
            hasChoose: Boolean,
            dzOption: {},
            showPermissions: {
                type:Boolean,
                default:true
            },
            showThumbnail: {
                type:Boolean,
                default:false
            },
        },
        data () {
            return {
                tree: [],
                filesAll: [],

                fileName:'',
                recordsCount: 0,
                page: 1,
                recordsPerPage:1000,
                paginationOption: { theme: 'bootstrap4'},

                savingPermission: false,
                selectedFileId: null,
                selectedDirectoryNode: {
                    id: null,
                    title: null
                },
                directoryCreate: true,
                permissions: [],
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

                filterRole: '',
                selectedRoles: [],
                roles : [],
                loadingRoles: false,
                areAllRolesSelected: false,

                multipleFilePermission: false,
                selectedFiles: [],
                areAllFilesSelected: false,

                fileFilterRole: null
            }
        },
        watch: {
            fileFilterRole() {
                if(this.selectedDirectoryNode){
                    this.getFiles(this.selectedDirectoryNode.id)
                }
            }
        },
        computed: {
            files () {
                let all = this.filesAll;

                if (this.fileName) {
                    let filter = this.fileName.toLowerCase();
                    all = _filter(all,(item) => {
                        // console.log(item);
                        let label = item.name ? item.name.toLowerCase() : item.link_url.toLowerCase();
                        return label.indexOf(filter)>-1;
                    });
                }

                return all;
            },
            pageFirstRecord () {
                return ((this.page-1) * this.recordsPerPage) + 1;
            },
            pageLastRecord () {
                let max =  (this.page) * this.recordsPerPage;

                return max < this.recordsCount ? max : this.recordsCount;
            },
            roleOptions() {
                let results = _filter(this.roles,(item) => {
                    let label = item.label.toLowerCase();
                    let filter = this.filterRole.toLowerCase();
                    return label.indexOf(filter)>-1;
                });

                this.areAllRolesSelected = !_difference(_map(results, 'id'), this.selectedRoles).length;

                return results;
            },
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
                };

                let options = {};

                if (this.dzOption && typeof this.dzOption === 'object') {
                    options = this.dzOption;
                } else if (this.dzOption && typeof this.dzOption === 'string') {
                    options = JSON.parse(this.dzOption);
                }

                return Object.assign({}, defaultOptions, options);
            }
        },

        created () {
            Events.$on('fm-change-directory', node => {
                // console.log('Event: directory changed')
                if (node) {
                    this.getFiles(node.id);
                    this.selectedDirectoryNode = node;
                }
                
            });
            
            this.getTree(true);
            this.getRoles()
        },

        methods : {
            createLink(){
                let node = this.selectedDirectoryNode.id;
                this.linkForm.node = node;
                FileService.createLink(this.linkForm).then( response => {
                    this.linkForm.url = null;
                    this.refreshFiles();
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


                this.form.directory.title = update ?  this.selectedDirectoryNode.title : '';


                this.$refs['create-update-directory'].show()
            },
            createUpdateDirectory(){
                this.$refs['create-update-directory'].hide();
                FileService.createUpdateDirectory(this.selectedDirectoryNode.id, this.directoryCreate , this.form.directory).then(response => {
                    this.getTree();
                    this.form.directory.title = '';
                })
            },
            deleteDirectory(){
                var r = confirm("Are you sure you want to delete?");
                if (r === true) {
                    FileService.deleteDirectory(this.selectedDirectoryNode.id).then(response => {
                        this.getTree(true);
                    })
                }
            },

            /* Files */
            chooseFile(file){
                this.$emit('change', file)
            },
            deleteFile(id){
                var r = confirm("Are you sure you want to delete this file?");
                if (r === true) {
                    FileService.deleteFile(id).then(response => {
                        this.refreshFiles()
                    })
                }
            },
            getFiles(id){
                this.loadingFiles = true;
                // this.files = [];

                let params = this.fileFilterRole ? {role_id: this.fileFilterRole} : {};

                FileService.getFiles(id, params).then(response => {
                    this.filesAll = response.data;
                    this.paginate(response.data);
                    this.loadingFiles = false;
                })
            },

            refreshFiles()
            {
                this.getFiles(this.selectedDirectoryNode.id);
            },

            /* Permissions */
            getDirectoryPermissions(){
                this.loadingRoles = true;
                FileService.getDirectoryPermissions(this.selectedDirectoryNode.id).then(response => {
                    this.permissions = response.data.permissions;
                    this.selectedRoles = _map(this.permissions, 'id');
                    this.loadingRoles = false
                })
            },
            getFilePermissions(){
                this.loadingRoles = true;
                FileService.getFilePermissions(this.selectedFileId).then(response => {
                    this.permissions = response.data.permissions;
                    this.selectedRoles = _map(this.permissions, 'id');
                    this.loadingRoles = false
                })
            },

            getMultipleFilePermission(){
                FileService.getMultipleFilePermissions(this.selectedFiles).then(response => {
                    this.permissions = response.data.permissions;
                    this.selectedRoles = _map(this.permissions, 'id');
                    this.loadingRoles = false;
                })
            },

            openAddDirectoryPermissionsModal() {
                this.$refs['add-directory-permissions'].show();
                this.getDirectoryPermissions()
            },

            openMultipleFilePermission(){
                this.multipleFilePermission = true;
                this.$refs['add-directory-permissions'].show();
                this.getMultipleFilePermission();
            },

            onModalPermissionsHide ()
            {
                this.selectedFileId = null;
                this.multipleFilePermission = false;
                this.filterRole = '';
            },

            openFilePermission(id) {
                this.selectedFileId = id;
                this.$refs['add-directory-permissions'].show();
                this.getFilePermissions()
            },

            updateFileDirectoryPermissions(close)
            {
                this.savingPermission = true;

                if (this.multipleFilePermission){
                    // multiple files
                    FileService.syncMultipleFilePermissions(this.selectedFiles, this.selectedRoles).then(response => {
                        // this.getFilePermissions();
                        this.multipleFilePermission = false;
                        this.savingPermission = false;

                        this.refreshFiles();

                        this.$refs['add-directory-permissions'].hide();
                    });
                } else if (this.selectedFileId) {
                    // single file
                    FileService.syncFilePermissions(this.selectedFileId, this.selectedRoles).then(response => {
                        this.getFilePermissions();
                        this.savingPermission = false;

                        this.$refs['add-directory-permissions'].hide();
                    })
                } else {
                    // directory
                    FileService.syncDirectoryPermissions(this.selectedDirectoryNode.id, this.selectedRoles).then(response => {
                        this.getDirectoryPermissions();
                        this.savingPermission = false;

                        this.$refs['add-directory-permissions'].hide();
                    })
                }
            },

            /* Roles */
            getRoles() {
                RoleService.getRoles().then((response) => {
                    this.roles = response.data
                })
            },
            toggleSelectedRoles(checked) {
                if (!this.roleOptions) {
                    return;
                }

                let options = _map(this.roleOptions, 'id');
                if (checked) {
                    this.selectedRoles = this.filterRole ? _union(this.selectedRoles, options) : options
                } else {
                    this.selectedRoles = this.filterRole ? _difference(this.selectedRoles, options) : []
                }
            },

            toggleSelectAllFiles(checked){
                if(checked){
                    this.selectedFiles = _map(this.files, 'id')
                } else {
                    this.selectedFiles = []
                }
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
                this.$refs['upload-modal'].hide();
                this.refreshFiles();
                setTimeout(() =>{
                    this.resetUpload();
                }, 1000)
            },

            paginate(results){
                // this.filesAll = results;
                this.page = 1;
                this.recordsCount = results.length;
                this.results = _chunk(results, this.recordsPerPage);

                // let files = this.results[this.page - 1];
                // if (files) {
                //     this.files = files;
                // } else {
                //     this.files = [];
                // }
            },

            pageChanged() {
                // this.files = this.results[this.page - 1];
                let top = $("#files-table-container").offset().top;
                $('html,body').animate({ scrollTop: top}, 500);
            },
        }
    }
</script>