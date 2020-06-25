<?php
 
namespace Sandbox\Cms\Controllers;

use Illuminate\Http\Request;
use Sandbox\Cms\Content\Models\CmsContent;

class ContentController extends AbstractController {


    public function get(Request $request, $linkType, $linkId)
    {
//        $linkId = $request->get('linkId');
//        $linkType = $request->get('linkType');

        $content = CmsContent::whereLinkType($linkType)
            ->whereLinkId($linkId)
            ->orderBy('version','DESC')
            ->first();


        return [
            'content' => $content
        ];
    }

    public function save(Request $request)
    {
        $data = $request->all();
        $version = 1;

        if ($content = CmsContent::whereLinkType($data['link_type'])
            ->whereLinkId($data['link_id'])
            ->orderBy('version','DESC')
            ->first()) {
            $version = $content->version + 1;
        }

        if (empty($data['name'])) {
            $data['name'] = $data['link_type'].':'.$data['link_id'];
        }

        $content = new CmsContent($data);
        $content->version = $version;
        $content->save();
//        $linkId = $request->get('linkId');
//        $linkType = $request->get('linkType');


        return [
            'content' => $content
            ];
    }
}