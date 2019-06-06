<template>
    <li v-if="node" :class="{'selected' : isSelected, 'folder':hasChildren}">
        <label :class="{'open': open}" @click.prevent.stop="changeDirectory(node)">
          <a @click.prevent="toggle" class="toggle" v-if="hasChildren">
              <i class=" icon ion-ios-folder-open" v-if="open"></i>
              <i class=" icon ion-ios-folder" v-if="!open"></i>
          </a>
          <span class="toggle" v-if="!hasChildren"><i class=" icon ion-ios-folder"></i></span>
          <a class="title">{{node.title}}</a>
        </label>

        <!--<a href="" @click.prevent.stop="changeDirectory(node)">{{node.title}}</a>-->
        <ul v-show="open" v-if="hasChildren" :class="{'open': open}">
            <file-manager-child v-for="item in node.children" :key="item.id" :node="item" @click="changeDirectory(item.id)"></file-manager-child>
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
                this.open = !this.open;
            },
            changeDirectory(node){
                Events.$emit('fm-change-directory', node);

                // this.open = true;
            }
        },
    }
</script>