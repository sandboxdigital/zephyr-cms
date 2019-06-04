<template>
    <div class="zph-cms-row">
        <div class="zph-page-list" :class="{'list-hidden':!pageListVisible}">
            <h5 v-if="pageListVisible">Pages</h5>
            <cms-page-list
                    v-if="pageListVisible"
                    ref="pages"
                    v-on:page-selected="pageSelected"
                    :currentItem="currentPage"></cms-page-list>
            <a @click.prevent="togglePageList" class="cms-btn-icon toggle-pages"><i class="icon" :class="{'ion-md-arrow-dropleft':pageListVisible,'ion-md-arrow-dropright':!pageListVisible}"></i></a>
        </div>
        <div class="zph-page-form" :class="{'list-hidden':!pageListVisible}">
            <div class="cms-nav-tabs clearfix" >
                <ul class="nav nav-tabs float-left">
                    <li class="nav-item">
                        <a class="nav-link" :class="{active:tab==='page'}" href="#" @click.prevent="show('page')">Page</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" :class="{active:tab==='content'}" href="#" @click.prevent="show('content')">Content</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" :class="{active:tab==='meta'}" href="#" @click.prevent="show('meta')">Meta</a>
                    </li>
                </ul>
                <div class="float-right cms-nav-tabs-buttons">
                    <code>{{currentUrl}}</code>
                    <a :href="currentUrl" target="_blank" class="cms-btn-icon"><i class="oi oi-external-link"></i></a>
                </div>
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
            <div v-show="tab==='meta'">
                <div class="cms-content-container">
                    <!--<h5><i class="fa fa-user-plus"></i> Content</h5>-->
                    <cms-meta-form ref="meta"></cms-meta-form>
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

        computed : {
            currentUrl () {
                if (this.currentPage.url === '/ROOT') {
                    return '/'
                } else {
                    return this.currentPage.url;
                }

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
                    this.$refs.meta.loadPage(page);
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