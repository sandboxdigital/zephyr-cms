
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
