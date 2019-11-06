<?php

return [
    'cms' => [
        'cssFiles' => [
            'https://cdnjs.cloudflare.com/ajax/libs/open-iconic/1.1.1/font/css/open-iconic-bootstrap.min.css',
            'https://unpkg.com/ionicons@4.2.0/dist/css/ionicons.min.css',
            '/cms-assets/bootstrap.css',
        ],
        'jsFiles' => [
            "/cms-assets/jquery.js",
            "/cms-assets/popper.js",
            "/cms-assets/bootstrap.js",
        ],

        'jsonTemplatePath' => resource_path('cms-templates')
    ],

    'search' => [
        'defaultThumbnail' => '/images/default.png'
    ],

    'file' => [
        'max_upload_size' => 2,
        'redirect_to_static' => env('ZEPHYR_CMS_FILE_REDIRECT_TO_STATIC', true)
    ],

    'files_path' => env('ZEPHYR_CMS_FILE_PATH', storage_path('app/public/files')),
    'files_url' => env('ZEPHYR_CMS_FILE_URL', '/storage/files'),
];
