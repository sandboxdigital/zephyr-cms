# Zephyr CMS #

- Version: 0.0.2

## Overview

Zephyr CMS is a Content Management System build in PHP, Laravel and VueJS
 
As of version "1.0.0" it will be considered stable.


## Installation

You may use Composer to install Zephyr into your Laravel project:
   
`composer require sandboxdigital/zephyr-cms`
   
After installing Zephyr, publish its assets using the vendor:publish Artisan command:
   
`php artisan vendor:publish --provider="Sandbox\Cms\ZephyrServiceProvider"`

If you're updating use:

`php artisan vendor:publish --provider="Sandbox\Cms\ZephyrServiceProvider" --force`