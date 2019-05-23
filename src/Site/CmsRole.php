<?php
/**
 * Created by PhpStorm.
 * User: jesign
 * Date: 4/4/19
 * Time: 8:00 AM
 */

namespace Sandbox\Cms\Site;

use Illuminate\Database\Eloquent\Model;

class CmsRole extends Model
{
    public $timestamps = false;

    protected $fillable = ['value', 'label'];

    public function folders() {
        return $this->belongsToMany(CmsRole::class, 'cms_folder_file_permissions', 'folder_id', 'role_id');
    }
}