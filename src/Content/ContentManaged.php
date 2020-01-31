<?php
namespace Sandbox\Cms\Content;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Sandbox\Cms\Content\Model\CmsContent;
use Sandbox\Cms\Site\Site;

trait ContentManaged
{
    var $type;
    var $id;

    /**
     * @var Content $content
     */
    var $content;

    public function loadContent ($type, $id)
    {
        $this->type = $type;
        $this->id = $id;
        if ($content = CmsContent::whereLinkType($this->type)
            ->whereLinkId($this->id)
            ->orderBy('version','DESC')
            ->first()) {
            // Found content record - load

            $this->content = new Content();
            $this->content->loadJson($content->content);
            View::share('content', $this->content);
        } else {
            // Create blank content element
            $this->content = new Content();
            $this->content->loadJson('{"data":[]}');
            View::share('content', $this->content);
        }

        return $this->content;
    }

    public function loadContentForPage (Request $request)
    {
        $path  = $request->getPathInfo();

        return $this->loadContentForPath($path);
    }

    /**
     * @param $path
     * @return array
     * @throws Exception
     */
    protected function loadContentForPath($path): array
    {
        $content = '';
        $page = Site::findPage($path);

        if ($page) {
            $page = View::share('page', $page);
            $pageTitle = $page->meta_title ?? $page->name;
            View::share('cmsPageTitle', $pageTitle);
            $content = $this->loadContent('PAGE', $page->id);
        } else {
            abort(404, 'Could not find content for for ' . $path);
        }

        return [
            'page'    => $page,
            'content' => $content
        ];
    }
}