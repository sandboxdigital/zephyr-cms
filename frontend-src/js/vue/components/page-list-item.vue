<template>
    <li :class="{'folder':isFolder,'selected':isSelected}" :data-id="model.id">
        <label :class="{'open': open}" @click="pageItemClick">
            <a @click.prevent.stop="toggle()" class="toggle" v-if="isFolder">
                <i class=" icon ion-ios-folder-open" v-if="open"></i>
                <i class=" icon ion-ios-folder" v-if="!open"></i>
            </a>
            <span class="toggle" v-if="!isFolder"><i class="icon ion-ios-document"></i></span>
            <a class="title">{{ model.name }}</a>
            <!--<span v-if="isFolder">{{ isFolder ? model.children.length : '' }}</span>-->
            <!--<a class="cms-btn-icon"><span class="oi oi-ellipses"></span></a>-->
        </label>
        <ul v-show="open" v-if="isFolder" class="sortable" :class="{'open': open}">
            <cms-page-list-item
                    v-for="(model, index) in model.children"
                    :key="index"
                    :model="model"
                    :currentItem="currentItem"
                    v-on:page-selected="pageSelect">
            </cms-page-list-item>
            <!--<li class="add" @click="addChild"><label>Add New Item</label></li>-->
        </ul>
    </li>
</template>

<script>
    export default {

        props: {
            currentItem: {
                type:Object,
                defaultValue: {id: 0}
            },
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
            },

            isSelected () {
                if (this.currentItem) {
                    return this.model.id === this.currentItem.id;
                } else {
                    return false;
                }
            }
        },
        created () {
            this.open = this.model.path === 'ROOT'
        },
        methods: {
            toggle () {
                console.log('toggle');
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
                console.log('pageItemClick');
                this.$emit('page-selected', this.model);
                this.open = true;
            },

            pageSelect (page) {
                // bubble down
                this.$emit('page-selected', page);
            },
        }
    }
</script>