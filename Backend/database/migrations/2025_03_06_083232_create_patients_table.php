<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id(); // مفتاح رئيسي تلقائي (auto-incrementing) لجدول المرضى
            $table->string('identity_number'); // مفتاح أجنبي من جدول المستخدمين
            $table->string('name');
            $table->string('address')->nullable();
            $table->date('birth_date')->nullable();
            $table->integer('age')->nullable();
            $table->string('care_type')->nullable();
            $table->string('gender')->nullable();
            $table->timestamps();

            $table->foreign('identity_number')->references('identity_number')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
