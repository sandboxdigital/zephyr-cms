<?php
 
namespace Sandbox\Cms\Controllers\Admin;

use Illuminate\Routing\Controller as BaseController;

use Illuminate\Http\Request;
use Sandbox\Cms\Site\CmsPage;

class PagesController extends BaseController {

    public function index(Request $request)
    {
        return view ('zephyr::pages');
    }
}