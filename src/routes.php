<?php

use Illuminate\Support\Facades\Route;

Route::namespace('Sandbox\Cms\Controllers')
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
    });