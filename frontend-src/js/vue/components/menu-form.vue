<template>
    <div>
        <div v-if="menu.id || menu.parent_id">
            <div class="cms-form">
                <cms-field-row label="Name">
                    <input name="name" type="text" id="name"  v-model="menu.name" class="cms-text">
                </cms-field-row>

                <!--<cms-field-row label="Path">
                    <input name="path" type="text" id="path"  v-model="menu.path" class="cms-text">
                </cms-field-row>-->

                <cms-field-row label="Url">
                    <input name="url" type="text" id="url"  v-model="menu.url" class="cms-text">
                </cms-field-row>

                <cms-field-row label="Open in">
                    <div class="cms-select-c">
                    <select name="template" type="text" id="open_in" v-model="menu.open_in" class="cms-select">
                        <option v-for="item in openOptions" :value="item.id" :key="item.id">{{item.name}}</option>
                    </select>
                    </div>
                </cms-field-row>

                <!--<cms-field-row label="Template">
                    <div class="cms-select-c">
                    <select name="template" type="text" id="template" v-model="menu.content_template_id" class="cms-select">
                        <option v-for="template in templates" :value="template.id" :key="template.id">{{template.name}}</option>
                    </select>
                    </div>
                </cms-field-row>-->
                <div class="cms-row cms-row-buttons">
                    <button class="cms-btn" @click.prevent="update">Save</button>
                    <button class="cms-btn cms-btn-secondary" @click.prevent="remove" v-if="menu.id">Delete</button>
                    <button class="cms-btn float-right" @click.prevent="submenu()" v-if="menu.id">Add sub-menu</button>
                </div>
            </div>
        </div>
        <div v-if="!menu.id && !menu.parent_id">
            <p>Select a menu</p>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Events from '../core/event-bus'
    import MenuService from "../services/menu";

    export default {
        data () {
            return {
                menu : {},
                openOptions : [
                    {id:'',name:'Current tab'},
                    {id:'_blank',name:'New tab'},
                ]
            }
        },

        created () {

        },

        mounted () {
            Events.$on('menu-item', (model) => {
                this.loadPage(model);
            });
        },

        methods : {
            loadMenu (model) {
                this.menu = model;
            },

            update () {
                MenuService.save(this.menu).then (menu => {
                    this.menu = menu;
                });
            },

            remove () {
                if (this.menu.id) {
                    
                    if (this.menu.path.toLowerCase() === 'main') {
                        alert('MAIN menu cannot be deleted!');
                        return false;
                    }

                    if (confirm('Are you sure you want to delete this menu?')) {
                        axios.delete('/cms-api/menus/' + this.menu.id)
                            .then(response => {
                                this.menu = {};
                                Events.$emit('menus-refresh');
                            });
                    }
                }
            },

            submenu () {
                let id = this.menu.id;
                this.menu = {
                    parent_id : id
                }
            }
        }
    }
</script>