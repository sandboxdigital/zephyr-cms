<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFileTypesInCmsFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cms_files', function (Blueprint $table) {
            $table->renameColumn('type', 'file_type');
        });
        Schema::table('cms_files', function (Blueprint $table) {
            $table->string('name', 255)->nullable()->change();
            $table->enum('type', ['file', 'link'])->after('fullname')->default('file');
            $table->string('link_url')->after('fullname')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cms_files', function (Blueprint $table) {
            $table->dropColumn('type');
            $table->dropColumn('link_url');
            $table->string('name', 255)->change();
        });
        Schema::table('cms_files', function (Blueprint $table) {
            $table->renameColumn('file_type', 'type');
        });
    }
}
