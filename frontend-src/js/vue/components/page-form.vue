<template>
    <div>
        <div v-if="page.id || page.parent_id">
            <div class="cms-form">
                <cms-field-row label="Name">
                    <input name="name" type="text" id="name"  v-model="page.name" class="cms-text">
                </cms-field-row>

                <cms-field-row label="Path">
                    <input name="path" type="text" id="path"  v-model="page.path" class="cms-text">
                </cms-field-row>

                <cms-field-row label="Template">
                    <div class="cms-select-c">
                    <select name="template" type="text" id="template" v-model="page.cms_page_template_id" class="cms-select">
                        <option v-for="template in templates" :value="template.id" :key="template.id">{{template.name}}</option>
                    </select>
                    </div>
                </cms-field-row>

                <div class="cms-row-buttons-fixed" v-fixed-in-parent>
                    <div class="cms-row cms-row-buttons">
                        <button class="cms-btn" @click.prevent="update">Save</button>
                        <button class="cms-btn cms-btn-secondary" @click.prevent="remove" v-if="page.id">Delete</button>
                        <button class="cms-btn float-right" @click.prevent="subpage()" v-if="page.id">Add sub-page</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!page.id && !page.parent_id">
            <p>Select a page</p>
        </div>
    </div>
</template>

<script>
    import PageService from '../services/page';
    import FormHelper from '../helpers/form';
    import axios from 'axios';
    import Events from '../core/event-bus'

    export default {
        data () {
            return {
                page:{},
                templates : []
            }
        },

        created () {

        },

        mounted () {
            Events.$on('page-item', (model) => {
                this.loadPage(model);

            });

            PageService.loadTemplates().then(response => {
                    this.templates = response.data;
                });
        },

        methods : {
            loadPage (model) {
                this.page = model;
            },

            update () {
                if (this.page.id) {
                    // console.log(this.page.id);
                    axios.post('/cms-api/pages/'+this.page.id, this.page)
                        .then(response => {
                            // console.log(response.data);
                            this.page = response.data;
                            Events.$emit('pages-refresh', this.page.id);
                        });
                } else {
                    // console.log('/cms-api/pages/');
                    axios.post('/cms-api/pages', this.page)
                        .then(response => {
                            // console.log(response.data);
                            this.page = response.data;
                            Events.$emit('pages-refresh', this.page.id);
                        });
                }
            },

            remove () {
                if (this.page.id) {
                    if (this.page.path.toLowerCase() === 'root') {
                        alert('Homepage cannot be deleted!');
                        return false;
                    }

                    if (confirm('Are you sure you want to delete this page?')) {
                        axios.delete('/cms-api/pages/' + this.page.id)
                            .then(response => {
                                this.page = {};
                                Events.$emit('pages-refresh');
                            });
                    }
                }
            },

            subpage () {
                let id = this.page.id;
                this.page = {
                    parent_id : id
                }
            }
        }
    }
</script>