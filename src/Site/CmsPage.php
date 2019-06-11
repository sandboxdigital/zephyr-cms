<?php
namespace Sandbox\Cms\Site;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\View;
use Kalnoy\Nestedset\NodeTrait;
use Sandbox\Cms\Content\Content;
use Sandbox\Cms\Content\Model\CmsContent;
use Sandbox\Cms\Site\Events\CmsPageSaved;

/**
 * Class CmsPage
 * @package Sandbox\Cms\Site
 *
 * @property int id
 * @property int parent_id
 * @property string name
 * @property string meta_description
 * @property string path
 * @property string url
 *
 * @property  CmsPage[] ancestors
 */
class CmsPage extends Model
{
    use NodeTrait;

    protected $table = 'cms_pages';

    protected $fillable = [
        'name',
        'path',
        'meta_title',
        'meta_description',
        'page_template_id',
        'cms_page_template_id',
    ];

    protected $appends = [
        'url'
    ];

    public function template ()
    {
        return $this->belongsTo('\Sandbox\Cms\Site\CmsPageTemplate', 'cms_page_template_id');
    }

    public function getUrlAttribute()
    {
        $parentPages = $this->ancestors;
        $paths = [];

        foreach ($parentPages as $pp) {
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

    public function getIndexableContent()
    {
        $index = [];

        if ($content = CmsContent::whereLinkType('PAGE')
            ->whereLinkId($this->id)
            ->orderBy('version','DESC')
            ->first()) {

            $contentJson = json_decode($content->content);

            foreach ($contentJson->data as $field) {
                if ($field->type == 'html') {
                    $index[] =  strip_tags($field->value);
                }
            }
        }

        return implode(' ',$index);
    }

    public static function boot()
    {
        parent::boot();

        static::saved(function($model){
            event(new CmsPageSaved($model));
        });
    }

    public static function findByPath($path)
    {
        return self::wherePath($path)->first();
    }
}