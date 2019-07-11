<?php

namespace Sandbox\Cms\Controllers;

use Sandbox\Cms\Site\CmsPage;

class SitemapController extends AbstractController
{
    public function sitemap()
    {
        $sitemapTop = '<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';

        $sitemap = '';
        $sitemap .= $this->pages();

        $sitemapBottom = '</urlset>';

        $headers = [
            'Content-Type' => 'text/xml'
        ];

        return response($sitemapTop . $sitemap . $sitemapBottom, 200, $headers);
    }

    /**
     * @return string
     */
    private function pages(): string
    {
        $sitemap = '';

        $pages = CmsPage::with('template')
            ->defaultOrder()
            ->where('show_in_sitemap',1)
            ->get();

        foreach ($pages as $page) {
            $url =  $page->url == '/ROOT' ? '/' : $page->url;
            $date = $page->updated_at->format('c');
            //$date = '';
            $sitemap .= '<url><loc>' . url($url) . '</loc><lastmod>' . $date . '</lastmod><priority>0.80</priority></url>';
        }
        return $sitemap;
    }

}