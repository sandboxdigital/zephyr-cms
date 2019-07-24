import Vue from 'vue';

import CmsPagePages from './pages/cms-pages';
import CmsPageMenus from './pages/cms-menus';
import CmsPageRoles from './pages/cms-roles';

Vue.component("cms-page-pages",CmsPagePages);
Vue.component("cms-page-menus",CmsPageMenus);
Vue.component("cms-roles", CmsPageRoles);