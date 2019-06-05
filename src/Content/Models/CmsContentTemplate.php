<?php
namespace Sandbox\Cms\Content\Model;

use Illuminate\Database\Eloquent\Model;

/**
 * Class CmsContentTemplate
 * @package Sandbox\Cms\Content\Model
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