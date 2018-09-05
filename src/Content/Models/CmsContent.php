<?php
namespace Sandbox\Content\Model;

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
}