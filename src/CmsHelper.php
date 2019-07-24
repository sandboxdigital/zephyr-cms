<?php

namespace Sandbox\Cms;


class CmsHelper
{
    public static function js()
    {

        $js = '';
        $port = config('zephyr.cms.port');
        $jsFiles = config('zephyr.cms.jsFiles');
        $coreJs = config('zephyr.cms.coreJs', '/vendor/zephyr/js/cms.js');

        if (config('zephyr.cms.hot')){
            array_unshift($jsFiles, 'http://localhost:'.$port.$coreJs);
        } else {
            array_unshift($jsFiles, $coreJs);
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
        $coreCss = config('zephyr.cms.coreCss','/vendor/zephyr/css/cms.css');

        if (!config('zephyr.cms.hot')) {
            array_unshift($cssFiles, $coreCss);
        }
        foreach($cssFiles as $cssFile) {
            $css .= '<link rel="stylesheet" href="'.$cssFile.'" crossorigin="anonymous" />'."\n";
        }

        return $css;
    }
}