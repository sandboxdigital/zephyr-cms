<?php

namespace Sandbox\Cms;

use Illuminate\Support\ServiceProvider;
use Sandbox\Cms\Commands\DemoPages;
use Sandbox\Cms\Commands\InitMenus;
use Sandbox\Cms\Commands\InitPages;

class ZephyrServiceProvider extends ServiceProvider {

    protected $commands = [
        InitPages::class,
        InitMenus::class,
    ];

    public function register() {
    }

    public function boot () {
        if ($this->app->runningInConsole()) {
            $this->commands($this->commands);
        }

        $this->loadMigrationsFrom(__DIR__.'/resources/migrations');
        $this->loadViewsFrom(__DIR__.'/resources/views', 'zephyr');
        $this->loadRoutesFrom(__DIR__.'/routes.php');

        $this->publishes([
            __DIR__.'/../frontend' => public_path('vendor/zephyr'),
        ], 'public');

        $this->publishes([
            __DIR__.'/resources/views' => resource_path('views/vendor/zephyr'),
        ], 'views');
        $this->publishes([
            __DIR__.'/resources/cms-templates' => resource_path('cms-templates'),
        ], 'views');
    }
}