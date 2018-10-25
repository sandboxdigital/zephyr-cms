<?php
 
namespace Sandbox\Cms\Controllers;

use Illuminate\Http\Request;
use Sandbox\Cms\Content\Model\CmsContentTemplate;

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
            $file = resource_path('cms-templates/'.$template->file);
            $data['spec'] = file_get_contents($file);

        }

        return $data;
    }
}