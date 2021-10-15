<?php
namespace Sandbox\Cms\Site;

use Illuminate\Support\Facades\Route;
use Log;

class Site
{
    private static $rootPages = null;
    private static $rootMenus = null;

    /**
     * @param bool $forceRun
     * @throws \Exception
     */
    public static function routes($forceRun = false)
    {
        if (!app()->runningInConsole() || $forceRun == true) {
            // don't run in console because db might not be set up yet
            // Set up CMS routes
            // Note these can be overridden by adding routes below this statement
            $homepage = self::findPage('/');

            if ($homepage) {
                self::mapRoutes($homepage->children, '/ROOT');
            }
        }
    }

    /**
     * @param $path
     * @param string $rootPath
     * @return CmsPage
     * @throws \Exception
     */
    public static function findPage ($path, $rootPath = 'ROOT')
    {
//        echo ($path).'<br>';
        if (\Str::startsWith($path,'/')) {
            // first char is /
            $path = substr($path, 1);
        }
        if (strrpos($path,'/') == strlen($path)-1) {
            // last char is /
            $path = substr($path,0,-1);
        }
        $pathParts = explode('/', $path);

        if ($rootPage = self::findRootPage($rootPath)) {
            if (count($pathParts) == 1 && empty($pathParts[0])) {
                return $rootPage;
            }

            $page = self::_findPage($rootPage->children, $pathParts);

            return $page;
        } else {
            throw new \Exception('Could not find root page with path '.$rootPath);
        }
    }

    public static function findMenu ($name)
    {
        if (!self::$rootMenus) {
            self::$rootMenus = CmsMenu::defaultOrder()->get()->toTree();
        }

        foreach(self::$rootMenus as  $menu)
        {
            if ($menu->path == $name) {
                return $menu;
            }
        }

        return null;
    }

    private static function _findPage($pages, $pathParts)
    {
        foreach($pages as  $page)
        {
            if ($page->path == $pathParts[0]) {
                if (count($pathParts) > 1) {
                    array_shift($pathParts);
                    return self::_findPage($page->children, $pathParts);
                } else {
                    return $page;
                }
            }
        }

        return null;
    }

    public static function isActivePage (CmsPage $page, $exact = false)
    {
        $path = \Request::getPathInfo ();

        if ($exact){
            return $path == $page->url;
        }
        else {
            return \Str::startsWith($path, $page->url);
        }
    }

    public static function mapRoutes ($pages, $prefixToRemove = '/ROOT')
    {
        // Set up CMS routes
        foreach ($pages as $page) {
            $url = $page->url;
            //\Log::debug($url);

            if (\Str::startsWith($url, $prefixToRemove)) {
                $url = substr($url, strlen($prefixToRemove));
            }
            if ($page->template && $page->template->route_action) {
//                dd($url . ':' . $page->template->route_action);
                Route::get($url, $page->template->route_action);
//                \Log::debug('Route for '.$url);
            } else {
//                \Log::debug('No route for '.$url);
            }
            if (count($page->children) > 0) {
                self::mapRoutes($page->children, $prefixToRemove);
            }
            //dd($page->children);
        }
    }

    /**
     * @param $rootPath
     * @return CmsPage
     */
    public static function findRootPage($rootPath)
    {
        if (!self::$rootPages) {
            $rootPages = CmsPage::with('template')
                ->defaultOrder()
                ->get()
                ->toTree();

            self::$rootPages = $rootPages;
        }

        foreach (self::$rootPages as $rootPage) {
            if ($rootPath == $rootPage->path) {
                return $rootPage;
            }
        }

        return null;
    }
}
