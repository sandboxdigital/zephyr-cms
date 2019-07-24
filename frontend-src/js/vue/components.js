
import Vue from 'vue';

import CmsContentForm from './components/content-form';
import CmsPageForm from './components/page-form';
import CmsMetaForm from './components/meta-form';
import CmsPageList from './components/page-list';
import CmsPageListItem from './components/page-list-item';
import CmsMenuListItem from './components/menu-list-item';
import CmsFieldRow from './fields/field-row';
import FilePicker from './components/file-picker';

Vue.component("cms-content-form",CmsContentForm);
Vue.component("cms-page-form",CmsPageForm);
Vue.component("cms-meta-form",CmsMetaForm);
Vue.component("cms-page-list",CmsPageList);
Vue.component("cms-page-list-item",CmsPageListItem);
Vue.component("cms-menu-list-item",CmsMenuListItem);
Vue.component("cms-field-row", CmsFieldRow);
Vue.component("cms-field-row", CmsFieldRow);
Vue.component("file-picker", FilePicker);

import RichTextEditor from './components/rich-text-editor';
import GoogleMap from './components/google-map';

Vue.component("rich-text-editor", RichTextEditor);
Vue.component("google-map", GoogleMap);

/* File Manager */
import FileManagerChild from './components/file-manager/child-menu';
import FileManager from './components/file-manager/file-manager';

Vue.component("file-manager", FileManager);
Vue.component("file-manager-child", FileManagerChild);

import FileManagerPlug from './plugins/file-manager';
Vue.use(FileManagerPlug);

