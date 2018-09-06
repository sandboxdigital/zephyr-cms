<?php
namespace Sandbox\Cms\Content\Model;

use Illuminate\Database\Eloquent\Model;

class CmsContentTemplate extends Model
{
    protected $table = 'cms_content_templates';

    protected $fillable = [
        'name',
        'path',
        'spec',
        'file',
    ];
}