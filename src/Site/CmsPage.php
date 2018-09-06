<?php
namespace Sandbox\Cms\Site;

use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;

class CmsPage extends Model
{
    use NodeTrait;

    protected $table = 'cms_pages';

    protected $fillable = [
        'name',
        'path',
        'page_template_id',
        'cms_page_template_id',
    ];

    public static function findByPath($path)
    {
        return self::wherePath($path)->first();
    }

    public function getUrlAttribute()
    {
        $parentPages = $this->ancestors;
        $paths = [];

        foreach($parentPages as $pp) {
            if ($pp->path != 'ROOT') {
                $paths[] = $pp->path;
            }
        }

        if (count($paths) > 0) {
            $root = implode('/', $paths);
            return '/' . $root . '/' . $this->path;
        } else {
            return '/' . $this->path;
        }
    }

    public function template ()
    {
        return $this->belongsTo('\Sandbox\Cms\Site\CmsPageTemplate', 'cms_page_template_id');
    }
}