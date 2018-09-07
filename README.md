# Zephyr CMS #

- Version: 0.0.2

## Overview

Zephyr CMS is a Content Management System build in PHP, Laravel and VueJS
 
As of version "1.0.0" it will be considered stable.


## Installation

1) Use Composer to install Zephyr into your Laravel project:
   
   `composer require sandboxdigital/zephyr-cms`
   
2) Add  `Sandbox\Cms\ZephyrServiceProvider::class,` to the `providers` array in `config/app.php`

3) Publish it's assets using the `vendor:publish` Artisan command:
   
   `php artisan vendor:publish --provider="Sandbox\Cms\ZephyrServiceProvider"`

   If you're updating use:

   `php artisan vendor:publish --provider="Sandbox\Cms\ZephyrServiceProvider" --force`
   
4) Run `php artisan migrate` to create CMS DB tables