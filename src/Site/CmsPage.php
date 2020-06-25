<?php
namespace Sandbox\Cms\Site;

use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;
use Sandbox\Cms\Content\Models\CmsContent;
use Sandbox\Cms\Site\Events\CmsPageSaved;

/**
 * Class CmsPage
 * @package Sandbox\Cms\Site
 *
 * AR Methods
 * @method self wherePath($path)
 * @method self first()
 *
 * @property int id
 * @property int parent_id
 * @property string name
 * @property string path
 * @property string url
 * @property string show_in_sitemap
 * @property string meta_description
 * @property string meta_noindex
 * @property string meta_canonical
 *
 * @property  CmsPage[] ancestors
 * @property  CmsPage[] children
 * @property  CmsPage parent
 */
class CmsPage extends Model
{
    use NodeTrait;

    protected $table = 'cms_pages';

    protected $fillable = [
        'cms_page_template_id',
        'name',
        'path',
        'meta_title',
        'meta_description',
        'page_template_id',
        'meta_canonical',
        'meta_noindex',
        'show_in_sitemap',
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
        return  $this->getUrl();
    }

    public function getUrl()
    {
        // don't use $this->ancestors as it doesn't seem to get set by CmsPage::get()->toTree();
        // looping through parents to create ancestors array..

        $parentPages = [];
        $current = $this;
        while ($current->parent)
        {
            $parentPages[] = $current->parent;
            $current = $current->parent;
        }

        $parentPages = array_reverse($parentPages);

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
            if ($this->path == 'ROOT') {
                return '/';
            }
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