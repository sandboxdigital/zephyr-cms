<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCmsSearchTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('cms_search');

        Schema::create('cms_search', function (Blueprint $table) {
            $table->increments('id');
            $table->string('key')->unique();
            $table->string('name')->default('');
            $table->string('type')->default('');
            $table->string('description', 512)->default('');
            $table->string('thumbnail_url')->default('');
            $table->string('url')->default('');
            $table->boolean('rich_description')->default(false);
            $table->integer('weight')->default(0);
            $table->longText('index');

            $table->timestamps();
            $table->softDeletes();

            //$table->index('index');
        });

        // Full Text Index
        DB::statement('ALTER TABLE `cms_search` ADD FULLTEXT fulltext_index (`index`)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cms_search');
    }
}
