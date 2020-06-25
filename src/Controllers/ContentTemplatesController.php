<?php
 
namespace Sandbox\Cms\Controllers;

use Illuminate\Http\Request;
use Sandbox\Cms\Content\Models\CmsContentTemplate;

class ContentTemplatesController extends AbstractController {

    public function index()
    {
        return CmsContentTemplate::get();
    }

    public function add(Request $request)
    {
        $page = new CmsContentTemplate ($request->all());
        $page->save ();

        return $page;
    }

    public function get(Request $request, CmsContentTemplate $template)
    {
        $data = $template->toArray();

        if (empty($data['spec'])) {
            $contentPath = config('zephyr.cms.jsonTemplatePath');
            $file = $contentPath.'/'.$template->file;
            $data['spec'] = file_get_contents($file);
        }

        return $data;
    }
}