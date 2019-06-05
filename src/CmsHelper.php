<?php

namespace Sandbox\Cms;


class CmsHelper
{
    public static function js()
    {

        $js = '';
        $port = config('zephyr.cms.port');
        $jsFiles = config('zephyr.cms.jsFiles');

        if (config('zephyr.cms.hot')){
            array_unshift($jsFiles, 'http://localhost:'.$port.'/vendor/zephyr/js/cms.js');
        } else {
            array_unshift($jsFiles, '/vendor/zephyr/js/cms.js');
        }

        foreach($jsFiles as $jsFile) {
            $js .= '<script src="'.$jsFile.'" type="text/javascript"></script>'."\n";
        }

        return $js;
    }

    public static function css()
    {
        $css = '';
        $cssFiles = config('zephyr.cms.cssFiles');

        if (!config('zephyr.cms.hot')) {
            array_unshift($cssFiles, '/vendor/zephyr/css/cms.css');
        }
        foreach($cssFiles as $cssFile) {
            $css .= '<link rel="stylesheet" href="'.$cssFile.'" crossorigin="anonymous" />'."\n";
        }

        return $css;
    }
}