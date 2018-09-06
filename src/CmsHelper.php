<?php

namespace Sandbox\Cms;

use \Exception;
use Sandbox\Cms\Content\Field\AbstractField;
use Sandbox\Cms\Content\Field\Placeholder;


class CmsHelper
{
    public static function js()
    {
        $port = config('sandbox.cms.port');
        if (config('sandbox.cms.hot')){
            return '<script src="http://localhost:'.$port.'/cms-assets/js/cms.js" type="text/javascript" ></script>';
        } else {
            return '<script src="/cms-assets/js/cms.js" type="text/javascript"></script>';
        }
    }

    public static function css()
    {
        $port = config('sandbox.cms.port');
        $css = '';

        if (!config('sandbox.cms.hot')) {
            $css .= '<link href = "/cms-assets/css/cms.css" rel = "stylesheet" type = "text/css" >';
        }
        $css .= '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/open-iconic/1.1.1/font/css/open-iconic-bootstrap.min.css" integrity="sha256-BJ/G+e+y7bQdrYkS2RBTyNfBHpA9IuGaPmf9htub5MQ=" crossorigin="anonymous" />';
        $css .= '<link href="https://unpkg.com/ionicons@4.2.0/dist/css/ionicons.min.css" rel="stylesheet">';

        return $css;
    }
}