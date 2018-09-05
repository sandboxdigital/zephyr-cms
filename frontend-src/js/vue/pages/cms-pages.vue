<template>
    <div class="zph-cms-row">
        <div class="zph-page-list" :class="{'list-hidden':!pageListVisible}">
            <h5 v-if="pageListVisible">Pages</h5>
            <cms-page-list
                    v-if="pageListVisible"
                    ref="pages"
                    v-on:page-selected="pageSelected"></cms-page-list>
            <a href="#" @click.prevent="togglePageList" class="cms-btn-icon toggle-pages"><i class="icon" :class="{'ion-md-arrow-dropleft':pageListVisible,'ion-md-arrow-dropright':!pageListVisible}"></i></a>
        </div>
        <div class="zph-page-form" :class="{'list-hidden':!pageListVisible}">
            <div>
                <ul class="nav nav-tabs cms-nav-tabs">
                    <li class="nav-item">
                        <a class="nav-link" :class="{active:tab==='page'}" href="#" @click.prevent="show('page')">Page</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" :class="{active:tab==='content'}" href="#" @click.prevent="show('content')">Content</a>
                    </li>
                </ul>
            </div>
            <div v-show="tab==='page'" >
                <div class="cms-form-container">
                    <!--<h5><i class="fa fa-user-plus"></i> Page</h5>-->
                    <cms-page-form ref="page"></cms-page-form>
                </div>
            </div>
            <div v-show="tab==='content'">
                <div class="cms-content-container">
                    <!--<h5><i class="fa fa-user-plus"></i> Content</h5>-->
                    <cms-content-form ref="content"></cms-content-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data () {
            return {
                tab : 'page',
                currentPage : {},
                pageListVisible:true
            }
        },

        created () {

        },

        mounted () {
        },

        methods : {
            pageSelected (page) {

                // if (this.tab === 'page') {
                    this.$refs.page.loadPage(page);
                // } else {
                if (page.template && page.template.cms_content_template_id) {
                    this.$refs.content.loadTemplateId(page.template.cms_content_template_id, 'PAGE', page.id);
                } else {
                    this.$refs.content.clearTemplate();
                }
                // }

                this.currentPage = page;
            },

            show (tab) {
                this.tab = tab;
            },

            togglePageList () {
                this.pageListVisible = !this.pageListVisible;
            }
        }
    }
</script>