<?php

use Illuminate\Support\Facades\Route;

Route::namespace('\Sandbox\Cms\Controllers')
    ->prefix('cms-files')
    ->middleware(['web'])
    ->group(function () {
        Route::get('/view/{filePath}', 'FileController@viewFile')
            ->where([
                'filePath'=>'[a-zA-Z0-9-_\./\s/]+'
            ]);
    });

Route::namespace('\Sandbox\Cms\Controllers')
    ->prefix('cms-assets')
    ->middleware(['web'])
    ->group(function () {
        Route::get('zephyr.js',  'AssetController@js');
        Route::get('zephyr.css', 'AssetController@css');
    });

Route::namespace('\Sandbox\Cms\Controllers')
    ->prefix('cms-api')
    ->middleware(['web','auth'])
    ->group(function () {
        // Pages
        Route::get   ('pages',              'PagesController@index');
        Route::post  ('pages',              'PagesController@add');
        Route::post  ('pages/reorder',      'PagesController@reorder');
        Route::post  ('pages/{page}',       'PagesController@update');
        Route::delete('pages/{page}',       'PagesController@delete');

        // Page Templates
        Route::get   ('page-templates',             'PageTemplatesController@index');
        Route::get   ('page-templates/{template}',  'PageTemplatesController@get');

        // Content
//        Route::get('content', 'TemplatesController@index');
        Route::get   ('content/{linkType}/{linkId}', 'ContentController@get');
        Route::post  ('content/save', 'ContentController@save');


        // Content Templates
        Route::get   ('content-templates',             'ContentTemplatesController@index');
        Route::get   ('content-templates/{template}',  'ContentTemplatesController@get');

        // File
        Route::get  ('file/upload',     'FileController@upload');
        Route::post ('file/upload',     'FileController@upload');


        // Menus
        Route::get   ('menus',           'MenusController@index');
        Route::post  ('menus',           'MenusController@add');
        Route::post  ('menus/reorder',   'MenusController@reorder');
        Route::post  ('menus/{menu}',    'MenusController@update');
        Route::delete('menus/{menu}',    'MenusController@delete');

        Route::prefix('files')->group(function(){
            Route::get('/file/{id}', 'FileController@getFile');
            Route::get ('/multiple-file/permissions', 'FileController@multipleFilePermissions');
            Route::post('/multiple-file/permissions', 'FileController@postMultipleFilePermissions');
            Route::get ('/get/{node}', 'FileController@files');
            Route::post('/delete/{fileId}', 'FileController@deleteFile');
            Route::get ('/tree', 'FileController@tree');
            Route::post('/directory/{node?}', 'FileController@createDirectory');
            Route::post('/directory/{node}/update', 'FileController@updateDirectory');
            Route::post('/directory/{node}/delete', 'FileController@deleteDirectory');
            Route::post('/upload', 'FileController@uploadFiles');
            Route::post('/create-link', 'FileController@createLink');

            Route::get('/directory/{node}/permissions', 'FileController@directoryPermissions');
            Route::post('/directory/{node}/permissions', 'FileController@syncDirectoryPermissions');

            Route::get('/file/{file}/permissions', 'FileController@filePermissions');
            Route::post('/file/{file}/permissions', 'FileController@syncFilePermissions');

        });

        Route::prefix('roles')->group(function(){
            Route::get('/', 'RolesController@index');
            Route::post('/create-update', 'RolesController@createUpdate');
            Route::post('/delete/{id}', 'RolesController@delete');
        });
    });