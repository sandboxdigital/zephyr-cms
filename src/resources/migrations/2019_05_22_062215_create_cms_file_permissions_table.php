<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCmsFilePermissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('cms_roles')) {
            Schema::create('cms_roles', function (Blueprint $table) {
                $table->increments('id');
                $table->string('value')->unique();
                $table->string('label');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('cms_folder_file_permissions')) {
            Schema::create('cms_folder_file_permissions', function (Blueprint $table) {
                $table->increments('id');
                $table->integer('folder_id')->nullable()->index();
                $table->integer('file_id')->nullable()->index();
                $table->integer('role_id')->index();

                $table->timestamps();
            });
        }

        if (!Schema::hasTable('cms_user_roles')) {
            Schema::create('cms_user_roles', function (Blueprint $table) {
                $table->increments('id');
                $table->integer('user_id')->index();
                $table->integer('role_id')->index();

                $table->timestamps();
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
        Schema::dropIfExists('cms_roles');
        Schema::dropIfExists('cms_folder_file_permissions');
        Schema::dropIfExists('cms_user_roles');
    }
}
