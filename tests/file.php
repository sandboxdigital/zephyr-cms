<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//$file = [
//    'name' => 'test.pdf'
//];
//
//
//echo json_encode($file);

if ( isset($_FILES['file']) ) {
    $filename = basename($_FILES['file']['name']);
    $error = true;

    // Only upload if on my home win dev machine
//    if ( isset($_SERVER['WINDIR']) ) {
//        $path = 'uploads/'.$filename;
//        $error = !move_uploaded_file($_FILES['file']['tmp_name'], $path);
//    }

    $rsp = array(
        'error' => $error, // Used in JS
        'id'    => '1',
        'name'  => $filename,
        'url'   => '/tests/uploads/' . $filename, // Web accessible
//        'thumbnailUrl' => '/tests/uploads/' . $filename, // Web accessible
    );
    echo json_encode($rsp);
    exit;
}
