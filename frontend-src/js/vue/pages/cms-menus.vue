<template>
    <div class="zph-cms-row">
        <div class="zph-page-list" :class="{'list-hidden':!listVisible}">
            <h5 v-if="listVisible">Menus</h5>
            <cms-menu-list
                    v-if="listVisible"
                    ref="menus"
                    v-on:menu-selected="menuSelected"></cms-menu-list>
            <a href="#" @click.prevent="toggleList" class="cms-btn-icon toggle-pages"><i class="icon" :class="{'ion-md-arrow-dropleft':listVisible,'ion-md-arrow-dropright':!listVisible}"></i></a>
        </div>
        <div class="zph-page-form" :class="{'list-hidden':!listVisible}">
            <div class="cms-content-container">
                <!--<h5><i class="fa fa-user-plus"></i> Content</h5>-->
                <cms-menu-form ref="form"></cms-menu-form>
            </div>
        </div>
    </div>
</template>

<script>
    import CmsMenuList from '../components/menu-list';
    import CmsMenuForm from '../components/menu-form';

    export default {
        components : {
            CmsMenuList,
            CmsMenuForm,
        },

        data () {
            return {
                currentMenu : {},
                listVisible:true
            }
        },

        created () {

        },

        mounted () {
        },

        methods : {
            menuSelected (menu) {
                this.$refs.form.loadMenu(menu);

                this.currentMenu = menu;
            },

            toggleList () {
                this.listVisible = !this.listVisible;
            }
        }
    }
</script>