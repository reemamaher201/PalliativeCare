<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('logo')->nullable();
            $table->string('imgabout')->nullable();
            $table->string('main_heading_ar')->nullable();
            $table->string('main_heading_en')->nullable();
            $table->text('main_text_ar')->nullable();
            $table->text('main_text_en')->nullable();
            $table->string('footer_text_ar')->nullable();
            $table->string('footer_text_en')->nullable();
            $table->string('background_color')->nullable();
            $table->string('button_color')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
