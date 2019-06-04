<?php
 
namespace Sandbox\Cms\Controllers;

use Illuminate\Http\Request;
use Sandbox\Cms\Site\CmsPage;

class PagesController extends AbstractController {

    public function index(Request $request)
    {
        $tree = CmsPage::with('template')->defaultOrder()->get()->toTree();

        return $tree;
    }

    public function add(Request $request)
    {
        $page = new CmsPage ($request->all());
        $page->parent_id = $request->get('parent_id');
        $page->path = str_slug($request->get('name'));
        $page->save ();

        return $page;
    }

    public function update(Request $request, CmsPage $page)
    {
        $data = $request->only([
            'name',
            'path',
            'meta_title',
            'meta_description',
            'cms_page_template_id',
            'page_template_id',
        ]);

        $page->fill($data);
        $page->save();

        return $page;
    }

    public function delete(Request $request, CmsPage $page)
    {
        \Log::debug('delete');
//        \Log::debug($request->only(['name','path']));

        $page->delete();

        return [
            'success' => 'true',
            'message' => 'Page deleted'
        ];
    }

    public function reorder (Request $request)
    {
        $reorder = $request->orderData;
        CmsPage::rebuildTree ($reorder);
        return [
            'success'=>true
        ];
    }



    /**
     * @return array
     */
    private function _addDefault()
    {
        $rootPages = CmsPage::whereIsRoot()->get();

        $foundCouncil = false;
        foreach ($rootPages as $page) {
            if ($page->path == 'council') {
                $foundCouncil = true;
            }
        }

        if (!$foundCouncil) {
            $node = CmsPage::create([
                'name' => 'Council Homepage',
                'path' => 'council',

                'children' => [
                    [
                        'name' => 'Resources',
                        'path' => 'resources',
                    ],
                ],
            ]);
        }

        if (!$foundCouncil) {
            // reload root pages
            $rootPages = CmsPage::whereIsRoot()->get();
        }
        return $rootPages;
    }
}