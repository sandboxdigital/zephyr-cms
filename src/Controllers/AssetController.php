<?php

namespace Sandbox\Cms\Controllers;


class AssetController extends AbstractController
{
    public function coreJs()
    {
        $fileName = 'cms.js';
        return $this->loadJs($fileName);
    }

    public function coreCss()
    {
        return $this->loadCss('cms.css');
    }

    public function bootstrapCss()
    {
        return $this->loadCss('bootstrap.min.css');
    }

    public function bootstrapJs()
    {
        return $this->loadJs('bootstrap.min.js');
    }

    public function jqueryJs()
    {
        return $this->loadJs('jquery.min.js');
    }

    public function popperJs()
    {
        return $this->loadJs('popper.min.js');
    }

    /**
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
     */
    protected function loadCss($fileName)
    {
        $file = realpath(__DIR__ . '/../../frontend/css/'.$fileName);
        $asset = file_get_contents($file);
        return response($asset, 200, ['Content-Type' => 'text/css']);
    }

    /**
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
     */
    protected function loadJs($fileName)
    {
        $file = realpath(__DIR__ . '/../../frontend/js/'.$fileName);
        $asset = file_get_contents($file);
        return response($asset, 200, ['Content-Type' => 'text/javascript']);
    }
}