<?php
namespace Sandbox\Cms\Site;

use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;
use Sandbox\Cms\Site\CmsFile;

class CmsFileFolder extends Model
{
    use NodeTrait;

    protected $fillable = [
        'title',
        'created_at',
        'updated_at',
    ];

    public function folderFiles(){
        return $this->hasMany(CmsFileFolderFile::class, 'folder_id');
    }

    public function files() {
        return $this->belongsToMany(\Sandbox\Cms\Site\CmsFile::class, 'cms_file_folder_files', 'folder_id', 'file_id');
    }

    public function permissions() {
        return $this->morphToMany(CmsRole::class,'permissible','cms_folder_file_permissions','permissible_id', 'role_id');
    }
}