<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

/**
 * Migration auto-generated by Sequel Pro Laravel Export (1.4.1)
 * @see https://github.com/cviebrock/sequel-pro-laravel-export
 */
class CreateCmsTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('cms_content_templates')) {
            Schema::create('cms_content_templates', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name', 255);
                $table->string('type', 255);
                $table->string('file', 255);
                $table->longText('spec');
                $table->nullableTimestamps();
                $table->softDeletes();
            });
        }


        if (!Schema::hasTable('cms_contents')) {
            Schema::create('cms_contents', function (Blueprint $table) {
                $table->increments('id');
                $table->integer('link_id');
                $table->string('link_type', 50);
                $table->string('name', 255);
                $table->longText('content');
                $table->unsignedInteger('version');
                $table->nullableTimestamps();
                $table->softDeletes();

                $table->index(['link_type', 'link_id', 'version'], 'link_type');
            });
        }

        if (!Schema::hasTable('cms_files')) {
            Schema::create('cms_files', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name', 255);
                $table->nullableTimestamps();
                $table->softDeletes();
            });
        }


        if (!Schema::hasTable('cms_menus')) {
            Schema::create('cms_menus', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name', 191)->default('');
                $table->string('path', 191)->default('');
                $table->enum('type', ['page', 'url']);
                $table->string('url', 191)->default('');
                $table->string('open_in', 50)->nullable()->default('');
                $table->integer('cms_page_id')->default(0);
                $table->nullableTimestamps();
                $table->softDeletes();
                $table->unsignedInteger('_lft')->default(0);
                $table->unsignedInteger('_rgt')->default(0);
                $table->unsignedInteger('parent_id')->nullable();

                $table->index(['_lft', '_rgt', 'parent_id'], 'cms_menus__lft__rgt_parent_id_index');
            });
        }

        if (!Schema::hasTable('cms_page_templates')) {
            Schema::create('cms_page_templates', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name', 191)->default('');
                $table->string('route_action', 191)->default('');
                $table->integer('cms_content_template_id')->default(0);
                $table->nullableTimestamps();
                $table->softDeletes();
            });
        }


        if (!Schema::hasTable('cms_pages')) {
            Schema::create('cms_pages', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name', 255);
                $table->string('path', 255)->default('');
                $table->string('meta_title', 255)->nullable();
                $table->text('meta_description')->nullable();
                $table->nullableTimestamps();
                $table->softDeletes();
                $table->unsignedInteger('_lft')->default(0);
                $table->unsignedInteger('_rgt')->default(0);
                $table->unsignedInteger('parent_id')->nullable();
                $table->integer('content_template_id')->default(0);
                $table->integer('cms_page_template_id')->default(0);

                $table->index(['_lft', '_rgt', 'parent_id'], 'cms_pages__lft__rgt_parent_id_index');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cms_content_templates');
        Schema::dropIfExists('cms_contents');
        Schema::dropIfExists('cms_files');
        Schema::dropIfExists('cms_menus');
        Schema::dropIfExists('cms_page_templates');
        Schema::dropIfExists('cms_pages');
    }
}
