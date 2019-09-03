<?php
namespace Sandbox\Cms\Site;

use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;

/**
 * Class CmsMenu
 * @package Sandbox\Cms\Site
 *
 * @property int parent_id
 * @property string name
 * @property string path
 * @property string url
 */
class CmsMenu extends Model
{
    use NodeTrait;

    protected $table = 'cms_menus';

    protected $fillable = [
        'name',
        'path',
        'type',
        'url',
        'cms_page_id',
        'open_in',
    ];

    public static function findByPath($path)
    {
        return self::wherePath($path)->first();
    }

    public function fill(array $attributes)
    {
        if (empty($attributes['url'])) {
            $attributes['url'] = '';
        }
        if (empty($attributes['open_in'])) {
            $attributes['open_in'] = '';
        }

        return parent::fill($attributes);

    }
}