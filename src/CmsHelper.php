<?php

namespace Sandbox\Cms;


use Sandbox\Cms\Site\CmsPage;

class CmsHelper
{
    public static function js()
    {

        $js = '';
        $port = config('zephyr.cms.port');
        $jsFiles = config('zephyr.cms.jsFiles');
        $coreJs = config('zephyr.cms.coreJs', '/vendor/zephyr/js/cms.js');

        if (!empty($coreJs)) {
            if (config('zephyr.cms.hot')){
                array_push($jsFiles, 'http://localhost:'.$port.$coreJs);
            } else {
                array_push($jsFiles, $coreJs);
            }
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

        if (!empty($coreCss)) {
            if (!config('zephyr.cms.hot')) {
                array_push($cssFiles, $coreCss);
            }
        }
        foreach($cssFiles as $cssFile) {
            $css .= '<link rel="stylesheet" href="'.$cssFile.'" crossorigin="anonymous" />'."\n";
        }

        return $css;
    }

    public static function metaRobots(CmsPage $page)
    {
        if ($page->meta_noindex) {
            return '<meta name="robots" content="noindex">';
        }

        return '';
    }

    public static function metaCanonical(CmsPage $page)
    {
        if ($page->meta_canonical) {
            return '<link rel="canonical" href="'.$page->meta_canonical.'">';
        }

        return '';
    }
}