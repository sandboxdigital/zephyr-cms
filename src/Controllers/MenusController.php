<?php
 
namespace Sandbox\Cms\Controllers;

use Illuminate\Http\Request;
use Sandbox\Cms\Site\CmsMenu;

class MenusController extends AbstractController {

    public function index(Request $request)
    {
        $tree = CmsMenu::defaultOrder()->get()->toTree();

        if(count($tree)==0) {
            $tree = $this->_addDefaultMenus();
            $tree = [$tree]; // expects an array
        }

        return $tree;
    }

    /**
     * @param Request $request
     * @return CmsMenu
     */
    public function add(Request $request)
    {
        \Log::debug('add');
        \Log::debug($request->all());

        $menu = new CmsMenu ($request->all());
        $menu->parent_id = $request->get('parent_id');
        $menu->path = str_slug($request->get('name'));
        $menu->save ();

        return $menu;
    }

    /**
     * @param Request $request
     * @param CmsMenu $menu
     * @return CmsMenu
     */
    public function update(Request $request, CmsMenu $menu)
    {
        $data = $request->only([
            'name',
            'path',
            'type',
            'page_id',
            'url',
            'open_in',
        ]);


        $menu->fill($data);
        $menu->save();

        return $menu;
    }

    /**
     * @param Request $request
     * @param CmsMenu $menu
     * @return array
     * @throws \Exception
     */
    public function delete(Request $request, CmsMenu $menu)
    {
        if (strtolower($menu->path) == 'main') {
            return;
        }

        \Log::debug('delete');

        $menu->delete();

        return [
            'success' => 'true',
            'message' => 'Menu deleted'
        ];
    }

    public function reorder (Request $request)
    {
        $reorder = $request->orderData;
        CmsMenu::rebuildTree ($reorder);
        return [
            'success'=>true
        ];
    }

    private function _addDefaultMenus()
    {
        $rootPage = CmsMenu::create([
            'name' => 'Main menu',
            'path' => 'MAIN',

            'children' => [
                [
                    'name' => 'About',
                    'path' => 'about',
                    'type' => 'url',
                    'url' => '/about',
                ],
                [
                    'name' => 'Blog',
                    'path' => 'blog',
                    'type' => 'url',
                    'url' => '/blog',
                ],
            ],
        ]);
        return $rootPage;
    }
}