<?php
namespace Sandbox\Site;

use Illuminate\Database\Eloquent\Model;

class CmsPageTemplate extends Model
{
    protected $table = 'cms_page_templates';

    protected $fillable = [
        'name',
        'route_action',
        'cms_content_template_id',
    ];


    public function contentTemplate()
    {
        return $this->belongsTo('\Sandbox\Content\Models\CmsContentTemplate');
    }
}