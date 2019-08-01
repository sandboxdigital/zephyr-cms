<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterCmsPageAddMoreSeoFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::table('cms_pages', function (Blueprint $table) {
            $table->boolean('meta_noindex')->default(false)->after('show_in_sitemap');
            $table->string('meta_canonical')->nullable()->default('')->after('meta_noindex');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cms_pages', function (Blueprint $table) {
            $table->dropColumn('meta_noindex');
            $table->dropColumn('meta_canonical');
        });
    }
}
