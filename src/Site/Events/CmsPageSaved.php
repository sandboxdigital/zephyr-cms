<?php

namespace Sandbox\Cms\Site\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;

class CmsPageSaved
{
    use Dispatchable, SerializesModels;

    public $cmsPage;

    public function __construct($cmsPage)
    {
        $this->cmsPage = $cmsPage;
    }
}
