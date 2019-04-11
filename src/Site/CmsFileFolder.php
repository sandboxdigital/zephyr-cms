<?php
namespace Sandbox\Cms\Site;

use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;
use Sandbox\Cms\Site\CmsFile;

class CmsFileFolder extends Model
{
    use NodeTrait;

    public function folderFiles(){
        return $this->hasMany(CmsFileFolderFile::class, 'folder_id');
    }
}