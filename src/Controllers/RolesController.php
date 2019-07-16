<?php
/**
 * Created by PhpStorm.
 * User: jesign
 * Date: 5/22/19
 * Time: 1:34 PM
 */

namespace Sandbox\Cms\Controllers;

use Illuminate\Http\Request;
use Sandbox\Cms\Site\CmsRole;

class RolesController extends AbstractController
{
    public function show($id)
    {
        $file = CmsRole::find($id);
        return response()->json(compact('file'));
    }

    public function index()
    {
        $files = CmsRole::orderBy('label')->get();
        return $files;
    }

    public function createUpdate(Request $request)
    {
        $request->validate([
            'value' => 'required|unique:cms_roles',
            'label' => 'required'
        ]);

        if ($request->id) {
            $permission = CmsRole::find($request->id);
        } else {
            $permission = new CmsRole;
        }

        $permission->fill($request->except('id'));
        $permission->save();

        return $permission;
    }

    public function delete($id)
    {
        return response()->json(['deleted' => CmsRole::findOrFail($id)->delete()]);
    }
}