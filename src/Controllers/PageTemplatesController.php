<?php
 
namespace Sandbox\Cms\Controllers;

use Illuminate\Http\Request;
use Sandbox\Cms\Site\CmsPageTemplate;

class PageTemplatesController extends AbstractController {

    public function index()
    {
        return CmsPageTemplate::orderBy('name')->get();
    }

    public function add(Request $request)
    {
        \Log::debug('add');
        \Log::debug($request->all());

        $page = new CmsPageTemplate ($request->all());
        $page->save ();

        return $page;
    }

    public function get(Request $request, CmsPageTemplate $template)
    {
        $data = $template->toArray();

        if (empty($data['spec'])) {
            $file = app_path('content/'.$template->file);
            $data['spec'] = file_get_contents($file);

        }

        return $data;
    }
}