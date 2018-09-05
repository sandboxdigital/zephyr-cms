<?php
 
namespace Sandbox\Controllers;

use Illuminate\Http\Request;
use Sandbox\Content\Model\CmsContentTemplate;

class ContentTemplatesController extends AbstractController {

    public function index()
    {
        return CmsContentTemplate::get();
    }

    public function add(Request $request)
    {
        \Log::debug('add');
        \Log::debug($request->all());

        $page = new CmsContentTemplate ($request->all());
        $page->save ();

        return $page;
    }

    public function get(Request $request, CmsContentTemplate $template)
    {
        $data = $template->toArray();

        if (empty($data['spec'])) {
            $file = app_path('content/'.$template->file);
            $data['spec'] = file_get_contents($file);

        }

        return $data;
    }
}