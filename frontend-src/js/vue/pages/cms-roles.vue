
<template>
    <div>
        <div class="zph-cms-row mt-2">
            <div id="role-table-container" class="zph-page-form">
                <div class="clearfix">

                </div>
                <table class="cms-table">
                    <thead>
                    <tr>
                        <th>Value</th>
                        <th>Label</th>
                        <th class="controls"><button class="cms-btn btn-sm float-right" @click="createUpdateRole()"><i class="icon ion-md-cloud-upload"></i> Add</button></th>
                    </tr>
                    </thead>
                    <tbody v-show="roles && roles.length">
                    <tr v-for="role in roles" v-if="role">
                        <td>{{role.value}}</td>
                        <td>{{role.label}}</td>
                        <td style="text-align: right">
                            <button class="cms-btn btn-sm" @click.prevent="createUpdateRole(role)"><i class="icon ion-md-create"></i></button>
                            <button class="cms-btn btn-sm" @click.prevent="deleteRole(role.id)"><i class="icon ion-md-trash"></i></button>
                        </td>
                    </tr>
                    </tbody>
                    <span v-show="loading">Loading...</span>

                </table>
                <pagination v-model="page" :records="recordsCount" :per-page="100" @paginate="pageChanged"></pagination>
            </div>
        </div>
        <b-modal id="create-update-role" ref="create-update-role">
            <div slot="modal-header">{{roleCreate ? "Create Role" : "Update Role"}}</div>
                <b-form-input
                    class="mb-1"
                    name="value"
                    v-model="form.value"
                    v-validate="'required'"
                    placeholder="Value"
                ></b-form-input>
                <p class="text-danger">{{ veeErrors.first('value') }}</p>
                <b-form-input
                    class="mb-1"
                    name="label"
                    v-model="form.label"
                    v-validate="'required'"
                    placeholder="Label"
                ></b-form-input>
                <p class="text-danger">{{ veeErrors.first('label') }}</p>
            <div slot="modal-footer">
                <b-button @click="saveRole" variant="primary">Save</b-button>
            </div>
        </b-modal>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Pagination from 'vue-pagination-2';
    import Events from '../core/event-bus'
    import $ from 'jquery'
    import _chunk from 'lodash/chunk'
    import RoleService from '../services/roles'

    export default {
        components: {
            pagination: Pagination
        },
        data () {
            return {
                roles: [],
                recordsCount: 0,
                roleCreate: true,
                page: 1,
                form : {
                    value : null,
                    label : null
                },
                loading: false
            }
        },
        mounted(){
            this.getRoles()
        },
        methods : {
            getRoles(){
                this.loading = true;
                RoleService.getRoles().then(response => {
                    this.roles = response.data;
                    this.paginate(response.data);
                    this.loading = false;
                })
            },
            createUpdateRole(data){
                if(data){
                    this.form = data
                }else {
                    this.form = { value : null, label : null }
                }

                this.$refs['create-update-role'].show()
            },
            saveRole(){
                this.$validator.validate().then(valid => {
                    if (valid) {
                        RoleService.createUpdateRole(this.form).then(() => {
                            this.$refs['create-update-role'].hide()
                            this.getRoles()
                        }).catch(err => {
                            this.$setLaravelValidationErrorsFromResponse(err.response.data);
                        })

                    }
                })
            },
            deleteRole(id){
                RoleService.deleteRole(id).then(() => {
                    this.getRoles()
                })
            },
            paginate(results){
                this.page = 1;
                this.recordsCount = results.length;
                this.results = _chunk(results, 100);
                this.roles = this.results[this.page - 1];
            },
            pageChanged() {
                this.roles = this.results[this.page - 1];
                let top = $("#role-table-container").offset().top;
                $('html,body').animate({ scrollTop: top}, 500);
            },
        }
    }
</script>