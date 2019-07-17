<?php
namespace Sandbox\Cms\Site;

use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;
use Sandbox\Cms\Site\CmsFile;

/**
 * Class CmsFileFolder
 * @package Sandbox\Cms\Site
 *
 * @property CmsFile[] $files
 */

class CmsFileFolder extends Model
{
    use NodeTrait;

    protected $fillable = [
        'title',
        'created_at',
        'updated_at',
    ];

    public function folderFiles()
    {
        return $this->hasMany(CmsFileFolderFile::class, 'folder_id');
    }

    public function files()
    {
        return $this->belongsToMany(CmsFile::class, 'cms_file_folder_files', 'folder_id', 'file_id');
    }

    public function permissions()
    {
        return $this->morphToMany(CmsRole::class,'permissible','cms_folder_file_permissions','permissible_id', 'role_id');
    }

    public function syncFilePermissions()
    {
        $permissions = $this->permissions->pluck('id');

        $this->files->each(function($item, $key) use ($permissions){
            $item->permissions()->sync($permissions);
        });
    }
}