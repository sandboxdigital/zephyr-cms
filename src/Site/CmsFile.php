<?php

namespace Sandbox\Cms\Site;

use Illuminate\Database\Eloquent\Model;
use \Storage;

/**
 * Class CmsFile
 * @package Sandbox\Cms\Site
 *
 *
 * @property string size
 * @property string fullname
 */
class CmsFile extends Model
{
    protected $appends = [
        'url',
        'url-thumbnail'
    ];
    //public $timestamps = false;

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

    public function getPath()
    {
        return 'storage' . config('zephyr.files_path') . '/' . $this->fullname;
    }

    public function permissions() {
        return $this->morphToMany(CmsRole::class, 'permissible','cms_folder_file_permissions', 'permissible_id', 'role_id');
    }

    public function getAbsolutePath($size='')
    {
        $fullName = $this->fullname;
        if ($size) {
            $pathInfo = pathinfo($fullName);
            $fullName = $pathInfo['filename'] . '-' . $size . '.' . $pathInfo['extension'];
        }

        $path = trim(config('zephyr.files_path'), '/');
        return Storage::disk('public')->path($path . '/' . $fullName);
    }

    public function getUrl($size='')
    {
        $path = trim(config('zephyr.files_path'), '/');
        return Storage::disk('public')->url($path . '/' . $this->getName($size));
    }

    public function getName($size='')
    {
        if ($size) {
            $pathInfo = pathinfo($this->fullname);
            return $pathInfo['filename'] . '-' . $size . '.' . $pathInfo['extension'];
        } else {
            return $this->fullname;
        }
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

        if (isset($pathInfo['extension']))
            return $pathInfo['filename'] . '-' . $size . '.' . $pathInfo['extension'];
        else
            return $pathInfo['filename'] . '-' . $size;

    }

    public function setLinkUrlAttribute($value){
        $arrParsedUrl = parse_url($value);
        if (isset($arrParsedUrl['scheme']) && ($arrParsedUrl['scheme'] === "http" || $arrParsedUrl['scheme'] === "https")){
            $this->attributes['link_url'] = $value;
        } else{
            $this->attributes['link_url'] = 'https://' . $value;
        }
    }


    /* Helpers */
    public static function files_path($file){
        return 'storage' . config('zephyr.files_path') . '/' . $file;
    }

    /**
     * @param $file
     * @return CmsFile
     * @throws \Exception
     */
    public static function getFile($file)
    {
        $fileNameInfo = pathinfo($file);

        $parts = explode('_', $fileNameInfo['filename']);

        $identifierAndSize = $parts[count($parts) - 1];
        $size = substr($identifierAndSize, 14);
        $identifier = substr($identifierAndSize, 0, 13);

        if (strlen($identifier) == 13) {

            $file = CmsFile::where('identifier', $identifier)->first();

            if ($file) {
                if (strlen($size) > 0) {
                    $file->size = $size;
                }
            }

            return $file;

        } else
            throw new \Exception('Could not get identifier - wrong filename format');
    }
}