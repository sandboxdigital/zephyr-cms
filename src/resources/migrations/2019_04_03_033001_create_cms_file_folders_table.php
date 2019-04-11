<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCmsFileFoldersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('cms_file_folders')) {

            Schema::create('cms_file_folders', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name')->nullable();
                $table->string('title')->nullable();
                $table->integer('_lft')->nullable();
                $table->integer('_rgt')->nullable();
                $table->integer('parent_id')->nullable();
                $table->timestamps();
            });
        }
        if (!Schema::hasTable('cms_file_folder_files')) {
            Schema::create('cms_file_folder_files', function (Blueprint $table) {
                $table->increments('id');
                $table->integer('folder_id')->nullable();
                $table->integer('file_id')->nullable();
                $table->string('name')->nullable();
                $table->timestamps();
            });
        }
        Schema::table('cms_files', function (Blueprint $table) {
            $table->string('identifier')->nullable()->after('name');
            $table->string('fullname')->nullable()->after('identifier');
            $table->string('type')->nullable()->after('fullname');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cms_file_folders');
        Schema::dropIfExists('cms_file_folder_files');
        Schema::table('cms_files', function (Blueprint $table) {
            $table->dropColumn(['identifier', 'fullname', 'type']);
        });
    }
}
