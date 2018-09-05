<?php
namespace Sandbox\Site;

use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;

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

//    public function getUrlAttribute()
//    {
//        $parentPages = $this->ancestors;
//        $paths = [];
//        foreach($parentPages as $pp) {
//            $paths[] = $pp->path;
//        }
//        if (count($paths)>0) {
//            $root = implode('/', $paths);
//            return '/' . $root . '/' . $this->path;
//        } else {
//            return '/' . $this->path;
//        }
//    }
}