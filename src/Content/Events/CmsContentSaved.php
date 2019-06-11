<?php

namespace Sandbox\Cms\Content\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Sandbox\Cms\Content\Model\CmsContent;

class CmsContentSaved
{
    use Dispatchable, SerializesModels;

    /** @var CmsContent */
    public $cmsContent;

    public function __construct($cmsContent)
    {
        $this->cmsContent = $cmsContent;
    }
}
