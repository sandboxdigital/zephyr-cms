<?php
 
namespace Sandbox\Cms\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Sandbox\Cms\Site\CmsFile;
use Sandbox\Cms\Site\CmsFileFolder;
use Sandbox\Cms\Site\CmsFileFolderFile;

class FileController extends AbstractController {
    public function getFile($id)
    {
        $file = CmsFile::find($id);
        return response()->json(compact('file'));
    }
    public function files(CmsFileFolder $node) {
        $files = CmsFile::whereHas('folders', function($query) use ($node){
            $query->where('cms_file_folders.id', $node->id);
        })->orderBy('fullname')->get();
        return $files;
    }

    public function tree() {
        $tree = CmsFileFolder::get()->toTree();
        return response()->json(compact('tree'), 200);
    }

    public function createDirectory(Request $request, CmsFileFolder $node)
    {
        $request->validate([ 'title' => 'required' ]);
        $new = new CmsFileFolder;
        $new->title = $request->title;
        $new->save();

        $node->appendNode($new);
        return $node;
    }

    public function updateDirectory(Request $request, CmsFileFolder $node)
    {
        $request->validate([ 'title' => 'required' ]);
        $node->title = $request->title;
        $node->save();
        return $node;
    }

    public function deleteDirectory(Request $request, CmsFileFolder $node){
        $node->delete();
        return response()->json(['success' => true]);
    }

    public function uploadFiles(Request $request)
    {
        $photos = $request->file;
        $node = CmsFileFolder::find($request->node);

        $uploadedPhotos = [];
        foreach ($photos as $photo){
            $identifier = uniqid();
            $extension = $photo->extension();
            $name = $photo->getClientOriginalName();
            $filename =  substr($name, 0, strrpos($name, ".")) . '_' . $identifier . '.' . $extension;

            $cmsFile = new CmsFile;
            $cmsFile->name = $name ;
            $cmsFile->fullname = $filename;
            $cmsFile->identifier = $identifier;
            $cmsFile->save();

            $cmsFileFolderFile = new CmsFileFolderFile;
            $cmsFileFolderFile->folder_id = $node->id;
            $cmsFileFolderFile->file_id = $cmsFile->id;
            $cmsFileFolderFile->save();
            $uploadedPhotos[] = $photo->storeAs(config('zephyr.files_path'), $filename, 'public');
        }

        return response()->json($uploadedPhotos);
    }

    public function deleteFile(Request $request, $fileId){
        $file = CmsFile::find($fileId);
        Storage::delete('public' . config('zephyr.files_path') . '/' . $file->fullname);

        $file->delete();
        return response()->json(['success' => true]);
    }

    public function upload (Request $request)
    {
        if ($request->file('file')->isValid()) {
            $path = $request->file->path();
            $name = $request->file->getClientOriginalName();
            $path = $request->file->store('public');
            $extension = $request->file->extension();
            $url = asset($path);
            $url = str_replace('public','storage',$url);

            return [
                'url' => $url,
                'name' => $name,
                'extension' => $extension,
            ];
        } else {
            return response()->json(['message'=>'File failed to upload'],422);
        }
    }

    public function viewFile($file){
        $filePath = CmsFile::files_path($file);

        if(is_file($filePath))
            return redirect($filePath);

        try{
            $cmsFile = CmsFile::getFile($file);
            $filePath = $cmsFile->getPath(); /* original path without size */
            if($cmsFile){

                $size = $cmsFile->size;

                if($size == 'original' || $size == ''){
                    if(!is_file($filePath)){
                        throw new \Exception('file not found');
                    }
                } else if(in_array($size, array_keys(config('zephyr.imageSizes', [])))) {
                    $width = config('zephyr.imageSizes.' . $size . '.width', null);
                    $height = config('zephyr.imageSizes.' . $size . '.height', null);

                    if (!$width || !$height) {
                        throw new \Exception('invalid size');
                    }
                }else {
                    if(preg_match('/(\d+)x(\d+)/', $size, $matches) && count($matches) == 3){
                        $width = $matches[1];
                        $height = $matches[2];
                    } else {
                        throw new \Exception('invalid size');
                    }
                }

                $img = Image::make($filePath)->resize($width, $height);
                $newFilePath = CmsFile::files_path($cmsFile->addSize($size));
                $img->save($newFilePath);
                return redirect($newFilePath);
            }else {
                throw new \Exception('file not found');
            }


            return redirect($filePath);
        } catch (\Exception $e){
            return $e->getMessage();
            return abort(404);
        }
    }
}