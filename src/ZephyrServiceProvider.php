<?php

namespace Sandbox\Cms;

use Illuminate\Support\Arr;
use Illuminate\Support\ServiceProvider;
use Intervention\Image\ImageServiceProvider;
use Sandbox\Cms\Commands\DemoPages;
use Sandbox\Cms\Commands\InitMenus;
use Sandbox\Cms\Commands\InitPages;
use Sandbox\Cms\Commands\InitFileFolders;

class ZephyrServiceProvider extends ServiceProvider {

    protected $commands = [
        InitPages::class,
        InitMenus::class,
        InitFileFolders::class
    ];

    public function register() {
        /*
        * Register the service provider for the dependency.
        */

        $this->app->register(ImageServiceProvider::class );
        /*
         * Create aliases for the dependency.
         */
        $loader = \Illuminate\Foundation\AliasLoader::getInstance();
        $loader->alias('Image', 'Intervention\Image\Facades\Image::class');
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

        $this->publishes([
            __DIR__.'/config.php' => config_path('zephyr.php'),
        ]);

        $this->mergeConfigFrom(__DIR__.'/config-defaults.php', 'zephyr');

        $diskConfig = [
            'driver' => 'local',
            'root'   => app()->config['zephyr.files_path'],
            'url'    => app()->config['zephyr.files_url'],
        ];

        app()->config["filesystems.disks.zephyrFiles"] = $diskConfig;
    }

    /**
     * Merge the given configuration with the existing configuration.
     * This overrides the default mergeConfigFrom that doesn't support deep merging / multi-dimensional arrays
     *
     * @param  string  $path
     * @param  string  $key
     * @return void
     */
    protected function mergeConfigFrom($path, $key)
    {
        $config = $this->app['config']->get($key, []);
        $this->app['config']->set($key, $this->mergeConfig(require $path, $config));
    }

    /**
     * Merges the configs together and takes multi-dimensional arrays into account.
     *
     * @param  array  $original
     * @param  array  $merging
     * @return array
     */
    protected function mergeConfig(array $original, array $merging)
    {
        // Don't merge jsFiles and cssFiles otherwise we get duplicates
        $ignoreKeys = [
            'cssFiles',
            'jsFiles',
        ];

        $array = array_merge($original, $merging);
        foreach ($original as $key => $value) {
            if (! is_array($value)) {
                continue;
            }
            if (! Arr::exists($merging, $key)) {
                continue;
            }
            if (is_numeric($key)) {
                continue;
            }
            if (in_array($key, $ignoreKeys)) {
                //dd($key);
                //dd($array);
                continue;
            }

            $array[$key] = $this->mergeConfig($value, $merging[$key]);
        }
        return $array;
    }
}