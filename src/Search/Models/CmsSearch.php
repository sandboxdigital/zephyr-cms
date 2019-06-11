<?php


namespace Sandbox\Cms\Search\Models;

use Illuminate\Database\Eloquent\Model;
use Sandbox\Cms\Search\Traits\FullTextSearch;

/**
 * Class CmsSearch
 * @package Sandbox\Cms\Search\Models
 *
 *
 * @property string key
 * @property string url
 * @property string name
 * @property string index
 * @property string description
 * @property string thumbnail_url
 * @property bool rich_description
 */
class CmsSearch extends Model
{
    use FullTextSearch;

    protected $table = 'cms_search';

    protected $searchable = [
        'index',
    ];

    public static function findByKey ($key)
    {
        return self::whereKey($key)->first ();
    }
    
    public static function findByKeyOrNew ($key)
    {
        $sql = self::where('key',$key);
        $index = self::where('key',$key)->first ();

        if (!$index) {
            $index = new self();
            $index->key = $key;
        } 
        
        return $index;
    }

    public function thumbnailUrl()
    {
        if ($this->thumbnail_url) {
            return $this->thumbnail_url;
        } else {
            return config ('zephyr.search.defaultThumbnail');
        }
    }
}