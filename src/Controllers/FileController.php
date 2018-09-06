<?php
 
namespace Sandbox\Cms\Controllers;

use Illuminate\Http\Request;

class FileController extends AbstractController {

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

    public function get ($fileName)
    {
        asset($fileName);
    }
}