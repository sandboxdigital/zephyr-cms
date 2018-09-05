<template>
    <li :class="{'folder':isFolder}" :data-id="model.id">
        <label :class="{'open': open}" @click="pageItemClick">
            <a @click.prevent="toggle" class="toggle folder" v-if="isFolder"></a>
            <a class="toggle file" v-if="!isFolder"></a>
            <a>{{ model.name }}</a>
            <!--<span v-if="isFolder">{{ isFolder ? model.children.length : '' }}</span>-->
            <!--<a class="cms-btn-icon"><span class="oi oi-ellipses"></span></a>-->
        </label>
        <ul v-show="open" v-if="isFolder" class="sortable" :class="{'open': open}">
            <cms-page-list-item
                    v-for="(model, index) in model.children"
                    :key="index"
                    :model="model"
                    v-on:page-selected="pageSelect">
            </cms-page-list-item>
            <!--<li class="add" @click="addChild"><label>Add New Item</label></li>-->
        </ul>
    </li>
</template>

<script>
    import axios from 'axios';
    import FormHelper from '../helpers/form'
    import Events from '../core/event-bus'

    export default {

        props: {
            model: Object
        },
        data () {
            return {
                open: false,
            };
        },
        computed: {
            isFolder () {
                return this.model.children && this.model.children.length;
            }
        },
        created () {
            this.open = this.model.path === 'ROOT'
        },
        methods: {
            toggle () {
                if (this.isFolder) {
                    this.open = !this.open;
                }
            },

            changeType () {
                if (!this.isFolder) {
                    Vue.set(this.model, "children", []);
                    this.addChild();
                    this.open = true;
                }
            },

            addChild () {
                this.model.children.push({
                    name: "New Item"
                });
            },

            pageItemClick () {
                console.log(this.model.id);
                this.$emit('page-selected', this.model);
            },

            pageSelect (page) {
                // bubble down
                this.$emit('page-selected', page);
            },
        }
    }
</script>