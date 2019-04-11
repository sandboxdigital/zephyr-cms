<?php
 
namespace Sandbox\Cms\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
        return $node->folderFiles()->with('file')->get()->pluck('file');
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
}