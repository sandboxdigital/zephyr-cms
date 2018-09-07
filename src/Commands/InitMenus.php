<?php

namespace Sandbox\Cms\Commands;

use Illuminate\Console\Command;
use Sandbox\Cms\Site\CmsMenu;
use Sandbox\Cms\Site\CmsPage;
use Sandbox\Cms\Site\CmsPageTemplate;

class InitMenus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'zephyr:init-menus';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create CMS menues';

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

        $node = CmsMenu::create([
            'name' => 'Main menu',
            'path' => 'MAIN',
            'type' => 'url',
            'url' => '/',

            'children' => [
                [
                    'name' => 'About',
                    'path' => 'about',
                    'type' => 'url',
                    'url' => '/about',
                ],
                [
                    'name' => 'Services',
                    'path' => 'services',
                    'type' => 'url',
                    'url' => '/services',
                ],
                [
                    'name' => 'Blog',
                    'path' => 'blog',
                    'type' => 'url',
                    'url' => '/blog',
                ],
            ],
        ]);
    }
}
