<?php
/**
 * Created by PhpStorm.
 * User: jesign
 * Date: 4/4/19
 * Time: 8:01 AM
 */

namespace Sandbox\Cms\Site;

use Illuminate\Database\Eloquent\Model;
class CmsFile extends Model
{
    protected $appends = ['url'];
    public $timestamps = false;

    public function getUrlAttribute()
    {
        return '/storage' . config('zephyr.files_path') . '/' . $this->fullname;
    }
}