<template>
    <li :class="{'folder':isFolder}" :data-id="model.id">
        <label :class="{'open': open}" @click="menuItemClick">
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
            <cms-menu-list-item
                    v-for="(model, index) in model.children"
                    :key="index"
                    :model="model"
                    v-on:menu-selected="menuSelect">
            </cms-menu-list-item>
            <!--<li class="add" @click="addChild"><label>Add New Item</label></li>-->
        </ul>
    </li>
</template>

<script>
    export default {

        props: {
            model: Object
        },
        data () {
            return {
                open: true
            };
        },
        computed: {
            isFolder () {
                return this.model.children && this.model.children.length;
            }
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

            menuItemClick () {
                console.log(this.model.id);
                this.$emit('menu-selected', this.model);
            },

            menuSelect (menu) {
                // bubble down
                this.$emit('menu-selected', menu);
            },
        }
    }
</script>