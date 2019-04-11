<?php
/**
 * Created by PhpStorm.
 * User: jesign
 * Date: 4/4/19
 * Time: 8:00 AM
 */

namespace Sandbox\Cms\Site;

use Illuminate\Database\Eloquent\Model;

class CmsFileFolderFile extends Model
{
    public $timestamps = false;

    public function file(){
        return $this->belongsTo(CmsFile::class, 'file_id');
    }
}