<?php
namespace Sandbox\Cms\Content\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class CmsContentTemplate
 * @package Sandbox\Cms\Content\Models
 *
 * @method self[] get
 *
 * @property string file
 * @property string spec
 * @property string name
 */
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