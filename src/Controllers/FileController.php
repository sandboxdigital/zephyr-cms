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

    public function files(Request $request, CmsFileFolder $node) {


        $files = CmsFile::whereHas('folders', function($query) use ($node){
            $query->where('cms_file_folders.id', $node->id);
        });
        $roleId = $request->role_id;
        if ($roleId){
            $files = $files->whereHas('permissions', function($query) use ($roleId) {
                $query->where('cms_folder_file_permissions.role_id', $roleId);
            });
        }

        $files = $files->orderBy('name')->get();

        return $files;
    }

    public function tree() {
        $tree = CmsFileFolder::orderBy('title')->get()->toTree();
        return response()->json(compact('tree'), 200);
    }

    public function createDirectory(Request $request, CmsFileFolder $node = null)
    {
        $request->validate([ 'title' => 'required' ]);
        if(!$node){
            $node = new CmsFileFolder();
            $node->title = 'Root';
            $node->save();
        }

        $new = new CmsFileFolder;
        $new->title = $request->title;
        $new->save();

        $node->appendNode($new);

        $parentPermissions = $node->permissions->pluck('id');
        $new->permissions()->sync($parentPermissions);

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

        $cmsFileIds = [];
        $permissions = $node->permissions->pluck('id');

        foreach ($photos as $photo){
            $identifier = uniqid();
            $extension = $photo->getClientOriginalExtension();
            $name = $photo->getClientOriginalName();
            $filename =  substr($name, 0, strrpos($name, ".")) . '_' . $identifier . '.' . $extension;

            $cmsFile = new CmsFile;
            $cmsFile->name = $name ;
            $cmsFile->fullname = $filename;
            $cmsFile->identifier = $identifier;
            $cmsFile->save();

            $cmsFile->permissions()->sync($permissions);

            $cmsFileIds[] = $cmsFile->id;
            $uploadedPhotos[] = $photo->storeAs(config('zephyr.files_path'), $filename, 'public');
        }

        $node->files()->attach($cmsFileIds);

        return response()->json($uploadedPhotos);
    }

    public function deleteFile(Request $request, $fileId){
        $file = CmsFile::find($fileId);
        if($file->type === 'file'){
            Storage::delete('public' . config('zephyr.files_path') . '/' . $file->fullname);
        }

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

    public function viewFile($file)
    {
        $filePath = CmsFile::files_path($file);

        if (is_file($filePath))
            return redirect($filePath);

        try {
            $cmsFile = CmsFile::getFile($file);

            if ($cmsFile) {
                $filePath = $cmsFile->getAbsolutePath(); /* original path without size */

                $size = $cmsFile->size;

                if ($size == 'original' || $size == '') {
                    if (!is_file($filePath)) {
                        throw new \Exception('file not found');
                    }
                } else if (in_array($size, array_keys(config('zephyr.imageSizes', [])))) {
                    $width = config('zephyr.imageSizes.' . $size . '.width', null);
                    $height = config('zephyr.imageSizes.' . $size . '.height', null);

                    if (!$width || !$height) {
                        throw new \Exception('Size ['.$size.'] found - width or height missing');
                    }
                } else {
                    if (preg_match('/(\d+)x(\d+)/', $size, $matches) && count($matches) == 3) {
                        $width = $matches[1];
                        $height = $matches[2];
                    } else {
                        throw new \Exception('Invalid size - ['.$size.'] not found');
                    }
                }
                $filePathWithSize = $cmsFile->getAbsolutePath($cmsFile->size);
                $urlWithSize = $cmsFile->getUrl($cmsFile->size);

                $img = Image::make($filePath)->resize($width, $height);
                $img->save($filePathWithSize);
                return redirect($urlWithSize);
            } else {
                throw new \Exception('file not found');
            }

            return redirect($filePath);
        } catch (\Exception $e) {
            return $e->getMessage();
            return abort(404);
        }
    }

    public function syncFilePermissions(Request $request, CmsFile $file)
    {
        $permissions = $request->permissions;
        $file->permissions()->sync($permissions);

        return response()->json(compact('permissions'));
    }

    public function filePermissions(CmsFile $file)
    {
        $permissions = $file->permissions;
        return response()->json(compact('permissions'));
    }

    public function deleteFilePermission(CmsFile $file, $permission)
    {
        $result = $file->permissions()->detach($permission);
        return response()->json(compact('result'));
    }


    public function syncDirectoryPermissions(Request $request, CmsFileFolder $node)
    {
        $permissions = $request->permissions;

        $node->permissions()->sync($permissions);
        $node->syncFilePermissions();

        return response()->json(compact('permissions'));
    }

    public function directoryPermissions(CmsFileFolder $node)
    {
        $permissions = $node->permissions;
        return response()->json(compact('permissions'));
    }

    public function syncMultipleFilePermissions(Request $request)
    {
        $ids = $request->ids;
        $permissions = $request->permissions;

        $files = CmsFile::whereIn('id', $ids)->get();
        foreach ($files as $file) {
            $file->permissions()->sync($permissions);
        }

        return response()->json(compact('permissions'));
    }

    public function multipleFilePermissions(Request $request)
    {
        $ids = $request->ids;

        if (!$ids) {
            return response()->json(['permissions' => []]);
        }

        $filesPermission = CmsFile::whereIn('id', $ids)->with('permissions')->get()->pluck('permissions');
        $mergedIds = [];
        foreach ($filesPermission as $permission) {
            $mergedIds = array_merge($mergedIds, $permission->toArray());
        }
        $permissions = collect($mergedIds)->unique('id');
        return response()->json(compact('permissions'));
    }

    public function createLink(Request $request)
    {
        $request->validate([ 'url' => 'required' , 'node' => 'required']);

        $node = CmsFileFolder::find($request->node);

        $cmsFile = new CmsFile;
        $cmsFile->link_url = $request->url ;
        $cmsFile->type = 'link';

        $cmsFile->save();

        $cmsFileFolderFile = new CmsFileFolderFile;
        $cmsFileFolderFile->folder_id = $node->id;
        $cmsFileFolderFile->file_id = $cmsFile->id;
        $cmsFileFolderFile->save();

        return response()->json(['success' => true]);
    }
}