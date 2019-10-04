<?php

namespace Sandbox\Cms\Controllers;


class AssetController extends AbstractController
{
    public function js()
    {
        $file = realpath(__DIR__.'/../../frontend/js/cms.js');
        $asset = file_get_contents($file);
        return response($asset,200,['Content-Type'=>'text/javascript']);
    }

    public function css()
    {
        $file = realpath(__DIR__.'/../../frontend/css/cms.css');
        $asset = file_get_contents($file);
        return response($asset,200,['Content-Type'=>'text/css']);
    }
}