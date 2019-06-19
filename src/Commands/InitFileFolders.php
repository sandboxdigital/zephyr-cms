<?php

namespace Sandbox\Cms\Commands;

use Illuminate\Console\Command;
use Sandbox\Cms\Site\CmsFileFolder;

class InitFileFolders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'zephyr:init-file-folders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create CMS Root file folders';

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
        $node = CmsFileFolder::create([
            'title' => 'Root',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
