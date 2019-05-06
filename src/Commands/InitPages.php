<?php

namespace Sandbox\Cms\Commands;

use Illuminate\Console\Command;
use Sandbox\Cms\Site\CmsPage;
use Sandbox\Cms\Site\CmsPageTemplate;

class InitPages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'zephyr:init-pages';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create CMS pages';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        //

        $homeTemplate = CmsPageTemplate::create([
            'name'=>'Home'
        ]);

        $generalTemplate = CmsPageTemplate::create([
            'name'=>'General'
        ]);

        $blogTemplate = CmsPageTemplate::create([
            'name'=>'Blog'
        ]);

        $node = CmsPage::create([
            'name' => 'Homepage',
            'path' => 'ROOT',
            'cms_page_template_id'=>$homeTemplate->id,

            'children' => [
                [
                    'name' => 'About',
                    'path' => 'about',
                    'cms_page_template_id'=>$generalTemplate->id,
                ],
                [
                    'name' => 'Services',
                    'path' => 'services',
                    'cms_page_template_id'=>$generalTemplate->id,
                ],
                [
                    'name' => 'Blog',
                    'path' => 'blog',
                    'cms_page_template_id'=>$blogTemplate->id,
                ],
            ],
        ]);


        $node = CmsPage::create([
            'name' => 'Admin Homepage',
            'path' => 'ADMIN',
            'cms_page_template_id'=>$homeTemplate->id,

            'children' => [
                [
                    'name' => 'Pages',
                    'path' => 'cms-pages',
                    'cms_page_template_id'=>0,
                ],
                [
                    'name' => 'Menus',
                    'path' => 'cms-menus',
                    'cms_page_template_id'=>0,
                ],
                [
                    'name' => 'Files',
                    'path' => 'cms-files',
                    'cms_page_template_id'=>0,
                ]
            ],
        ]);
    }
}
