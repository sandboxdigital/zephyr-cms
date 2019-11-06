<?php

return [
    'cms'        => [
        'hot'  => env('CMS_WEBPACK_HOT', false),
        'port' => env('CMS_WEBPACK_PORT', '8081'),
    ],
    'google_map' => [
        'api_key' => env('ZEPHYR_GMAP_API_KEY', null)
    ],
    'files_path' => env('ZEPHYR_CMS_FILE_PATH', storage_path('app/public/files')),
    'files_url'  => env('ZEPHYR_CMS_FILE_URL', '/storage/files'),

    'imageSizes' => [
        'thumbnail' => [
            'width'  => 48,
            'height' => 48
        ]
    ],

    'file' => [
        'max_upload_size'    => 20,
        'redirect_to_static' => env('ZEPHYR_CMS_FILE_REDIRECT_TO_STATIC', true)
    ],

    'search' => [
        'defaultThumbnail' => '/images/default.png'
    ]
];
