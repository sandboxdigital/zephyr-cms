<?php
namespace Sandbox\Cms\Content\Models;

use Sandbox\Cms\Content\Events\CmsContentSaved;

use Illuminate\Database\Eloquent\Model;

class CmsContent extends Model
{
    protected $fillable = [
        'link_id',
        'link_type',
        'name',
        'content',
        'version',
    ];

    public static function boot()
    {
        parent::boot();

        static::saved(function($model){

            event(new CmsContentSaved($model));
        });
    }
}