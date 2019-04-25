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
    protected $appends = ['url', 'url-thumbnail'];
    public $timestamps = false;

    public function folders()
    {
        return $this->belongsToMany(CmsFileFolder::class, 'cms_file_folder_files', 'file_id', 'folder_id');
    }

    public function getUrlAttribute()
    {
        return '/cms-files/view/' . $this->fullname;
    }

    public function getUrlThumbnailAttribute()
    {
        return '/cms-files/view/' . $this->addSize('thumbnail') ;
    }

    public function getPath(){
        return 'storage' . config('zephyr.files_path') . '/' . $this->fullname;
    }

    public function isImage()
    {
        $image_info = getimagesize($this->getPath());
        if($image_info[2] < 1 || $image_info[2] > 3) {
            return false;
        }
        else {
            return true;
        }
    }

    public function getImageSize ($name = null)
    {
        if(!$name){
            $name = $this->fullname;
        }

        $fileNameInfo = pathinfo($name);
        $parts = explode ('_',$fileNameInfo['filename']);

        $identifier = $parts[count($parts)-1];
        $size = substr($identifier,14);
        $identifier = substr($identifier,0,13);

        return $size;
    }

    public function getExtension () {
        $pathinfo = pathinfo($this->fullname);

        if (isset($pathinfo['extension']))
            return strtolower($pathinfo['extension']);
        else
            return '';
    }

    public function addSize($size){
        $pathInfo = pathinfo($this->fullname);
        return $pathInfo['filename'] . '-' . $size . '.' . $pathInfo['extension'];
    }


    /* Helpers */
    public static function files_path($file){
        return 'storage' . config('zephyr.files_path') . '/' . $file;
    }

    public static function getFile($file){
        $fileNameInfo = pathinfo($file);

        $parts = explode ('_',$fileNameInfo['filename']);

        $identifier = $parts[count($parts)-1];
        $size = substr($identifier,14);
        $identifier = substr($identifier,0,13);

        if (strlen($identifier)==13) {

            $file = CmsFile::where('identifier', $identifier)->first();

            if ($file) {
                if (strlen($size)>0) {
                    $file->size = $size;
                }
            }

            return $file;

        } else
            throw new \Exception('Could not get identifier - wrong filename format');
    }
}