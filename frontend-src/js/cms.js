import Vue from 'vue';
import jQuery from 'jquery';

import merge from 'lodash-es/merge';
import defaultConfig from './config/cms';

import './vue/components-vendor';
import './vue/components';
import './vue/pages';
import './vue/directives/index';

import App from './vue/app';

let config = (window.ZephyrCMSConfig) ? merge ({}, defaultConfig, window.ZephyrCMSConfig) : merge ({}, defaultConfig);

window.$ = jQuery;
window.jQuery = jQuery;

window.ZephyrCMS = {
    App : App,
    Vue : Vue,
    jQuery : jQuery,
    run () {
        App.run();
    }
};

if (config.autoRun) {
    window.ZephyrCMS.run();
}