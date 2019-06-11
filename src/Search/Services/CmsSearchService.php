<?php


namespace Sandbox\Cms\Search\Services;


class CmsSearchService
{
    public static function truncateWord($str, $length = 200){
        $str = strip_tags($str);
        $str = str_limit($str, $length, $end='...');
        $str = explode(' ', $str);
        $str[count($str) -1] = '...';
        return implode(' ', $str);
    }
}