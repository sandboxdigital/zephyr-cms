
import jQuery from 'jquery';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

// Quill Rich Text Editor
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import VueQuillEditor from 'vue-quill-editor';

import VeeValidate from 'vee-validate';

import VeeValidateLaravel from 'vee-validate-laravel';


Vue.use(VueQuillEditor);
Vue.use(BootstrapVue);
Vue.use(VeeValidate,{
    errorBagName: 'veeErrors',
    fieldsBagName: 'veeFields'
});
Vue.use(VeeValidateLaravel);

import Pagination from 'vue-pagination-2';
Vue.component('pagination', Pagination);

import 'bootstrap-vue/dist/bootstrap-vue.css';

import CmsContentForm from './vue/components/content-form';
import CmsPageForm from './vue/components/page-form';
import CmsMetaForm from './vue/components/meta-form';
import CmsPageList from './vue/components/page-list';
import CmsPageListItem from './vue/components/page-list-item';
import CmsMenuListItem from './vue/components/menu-list-item';
import CmsFieldRow from './vue/fields/field-row';
import FilePicker from './vue/components/file-picker';

import CmsPagePages from './vue/pages/cms-pages';
import CmsPageMenus from './vue/pages/cms-menus';
import CmsPageRoles from './vue/pages/cms-roles';

import RichTextEditor from './vue/components/rich-text-editor';
import GoogleMap from './vue/components/google-map';

Vue.component("cms-content-form",CmsContentForm);
Vue.component("cms-page-form",CmsPageForm);
Vue.component("cms-meta-form",CmsMetaForm);
Vue.component("cms-page-list",CmsPageList);
Vue.component("cms-page-list-item",CmsPageListItem);
Vue.component("cms-menu-list-item",CmsMenuListItem);
Vue.component("cms-field-row", CmsFieldRow);
Vue.component("cms-field-row", CmsFieldRow);
Vue.component("file-picker", FilePicker);

/* File Manager */
import ChildMenu from './vue/components/file-manager/child-menu';
import FileManager from './vue/components/file-manager/file-manager';

Vue.component("cms-roles", CmsPageRoles);

Vue.component("file-manager", FileManager);
Vue.component("child-menu", ChildMenu);

// if (process.browser) {
//     const VueQuillEditor = require('vue-quill-editor/dist/ssr')
// }

Vue.component("rich-text-editor", RichTextEditor);
Vue.component("google-map", GoogleMap);

import FileManagerPlug from './vue/plugins/file-manager';
Vue.use(FileManagerPlug);

import './vue/directives/index';


if (jQuery('#cms').length) {
    let app = new Vue({
        el: '#cms',

        components: {
            CmsPagePages,
            CmsPageMenus
        },

        methods: {
            loadJson(jsonString) {

                if (this.$refs) {
                    let json = JSON.parse(jsonString);
                    this.$refs.form.loadJson(json);
                }
            }
        }
    });
}