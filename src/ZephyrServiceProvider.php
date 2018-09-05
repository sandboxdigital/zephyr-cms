<?php

namespace Sandbox\Cms;

use Illuminate\Support\ServiceProvider;

class ZephyrServiceProvider extends ServiceProvider {

    protected $commands = [

    ];

    public function register() {
    }

    public function boot () {
        if ($this->app->runningInConsole()) {
            $this->commands($this->commands);
        }

        $this->loadMigrationsFrom(__DIR__.'/resources/migrations');
        $this->loadViewsFrom(__DIR__.'/resources/views', 'curator');
        $this->loadRoutesFrom(__DIR__.'/routes.php');
    }
}