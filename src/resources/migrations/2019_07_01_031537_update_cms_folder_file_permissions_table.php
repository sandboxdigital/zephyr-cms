<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCmsFolderFilePermissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cms_folder_file_permissions', function (Blueprint $table) {
            $table->renameColumn('folder_id','permissible_id');
            $table->dropColumn('file_id');
        });
        Schema::table('cms_folder_file_permissions', function (Blueprint $table) {
            $table->string('permissible_type')->after('permissible_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cms_folder_file_permissions', function (Blueprint $table) {
            $table->renameColumn('permissible_id', 'folder_id');
            $table->integer('file_id');
            $table->dropColumn('permissible_type');
        });
    }
}
