<?php


function meta_noindex ($page) {
    return \Sandbox\Cms\CmsHelper::metaRobots($page);
}

function meta_robots ($page) {
    return \Sandbox\Cms\CmsHelper::metaRobots($page);
}

function meta_canonical ($page) {
    return \Sandbox\Cms\CmsHelper::metaCanonical($page);
}

function str_start($haystack,$needle) {
    return strpos( $haystack , $needle ) === 0;
}
