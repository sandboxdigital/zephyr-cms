<template>
    <div>
        <!--<div v-if="page.id || page.parent_id">-->
        <div>
            <div class="cms-form">
                <cms-field-row label="Page Title">
                    <input name="name" type="text" id="title"  v-model="page.meta_title" class="cms-text">
                </cms-field-row>

                <cms-field-row label="Meta Description">
                    <textarea name="meta_description" type="text" id="meta_description"  v-model="page.meta_description" class="cms-text"></textarea>
                </cms-field-row>

                <cms-field-row label="Meta Canonical">
                    <input name="canonical" type="text" id="canonical" v-model="page.meta_canonical" class="cms-text">
                </cms-field-row>

                <cms-field-row label="Show in sitemap">
                    <input name="show_in_sitemap"
                           type="checkbox"
                           id="show_in_sitemap"
                           v-model="page.show_in_sitemap"
                           class="cms-text"
                           true-value="1"
                           false-value="0">
                </cms-field-row>

                <cms-field-row label="Meta NOINDEX">
                    <input name="meta_noindex"
                           type="checkbox"
                           id="meta_noindex"
                           v-model="page.meta_noindex"
                           class="cms-text"
                           true-value="1"
                           false-value="0">
                </cms-field-row>

                <div class="cms-row-buttons-fixed" v-fixed-in-parent>
                    <div class="cms-row cms-row-buttons">
                        <button class="cms-btn" @click.prevent="update">Save</button>
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
                page:{}
            }
        },

        created () {

        },

        mounted () {
            Events.$on('page-item', (model) => {
                this.loadPage(model);
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
            }
        }
    }
</script>