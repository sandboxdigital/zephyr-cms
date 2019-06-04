<template>
    <li v-if="node" :class="{'selected' : isSelected, 'folder':hasChildren}">
        <label :class="{'open': open}" @click.prevent.stop="changeDirectory(node)">
          <a @click.prevent="toggle" class="toggle oi oi-folder" v-if="hasChildren"></a>
          <a class="toggle oi oi-folder" v-if="!hasChildren"></a>
          <a class="title">{{node.title}}</a>
        </label>

        <!--<a href="" @click.prevent.stop="changeDirectory(node)">{{node.title}}</a>-->
        <ul v-show="open" v-if="hasChildren" :class="{'open': open}">
            <child-menu v-for="item in node.children" :key="item.id" :node="item" @click="changeDirectory(item.id)"></child-menu>
        </ul>
    </li>
</template>
<script>
    import Events from '../../core/event-bus'

    export default {
        props: [
            'node',
            'initialState'
        ],

        data () {
            return {
                isSelected: false,
                open: false,
            }
        },

        computed: {
            hasChildren () {
                return this.node.children && this.node.children.length;
            }
        },

        mounted(){
            this.open = this.initialState === 'open';
            Events.$on('fm-change-directory', node => {
                if (this.node) {
                    this.isSelected = (this.node.id === node.id)
                }
            });
        },

        methods: {
            toggle () {
                if (this.hasChildren) {
                    this.open = !this.open;
                }
            },
            changeDirectory(node){
                Events.$emit('fm-change-directory', node)
            }
        },
    }
</script>