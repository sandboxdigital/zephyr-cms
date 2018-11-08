
import jQuery from 'jquery';
import Vue from 'vue';


// Quill Rich Text Editor
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';

Vue.component('rich-text-editor', quillEditor);

import CmsContentForm from './vue/components/content-form';
import CmsPageForm from './vue/components/page-form';
import CmsPageList from './vue/components/page-list';
import CmsPageListItem from './vue/components/page-list-item';
import CmsMenuListItem from './vue/components/menu-list-item';
import CmsFieldRow from './vue/fields/field-row';

import CmsPagePages from './vue/pages/cms-pages';
import CmsPageMenus from './vue/pages/cms-menus';

import SSREditor from './vue/components/ssr-editor';
import GoogleMap from './vue/components/google-map';

Vue.component("cms-content-form",CmsContentForm);
Vue.component("cms-page-form",CmsPageForm);
Vue.component("cms-page-list",CmsPageList);
Vue.component("cms-page-list-item",CmsPageListItem);
Vue.component("cms-menu-list-item",CmsMenuListItem);
Vue.component("cms-field-row", CmsFieldRow);

if (process.browser) {
    const VueQuillEditor = require('vue-quill-editor/dist/ssr')
    Vue.use(VueQuillEditor, /* { default global options } */)
}

Vue.component("ssr-editor", SSREditor);
Vue.component("google-map", GoogleMap);


if (jQuery('#cms').length) {
    let app = new Vue({
        el: '#cms',

        components: {
            CmsPagePages,
            CmsPageMenus,
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