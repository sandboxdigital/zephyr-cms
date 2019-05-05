<?php
 
namespace Sandbox\Cms\Controllers\Admin;

use Illuminate\Routing\Controller as BaseController;

use Illuminate\Http\Request;

class FilesController extends BaseController {

    public function index(Request $request)
    {
        return view('zephyr::file-manager.index');
    }
}