<?php
 
namespace Sandbox\Cms\Controllers\Admin;

use Illuminate\Routing\Controller as BaseController;

use Illuminate\Http\Request;

class MenusController extends BaseController {

    public function index(Request $request)
    {
        return view ('zephyr::menus');
    }
}