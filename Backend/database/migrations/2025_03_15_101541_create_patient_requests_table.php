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
        Schema::create('patient_requests', function (Blueprint $table) {
            $table->id();
            $table->string('identity_number');
            $table->string('name');
            $table->string('address')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('care_type')->nullable();
            $table->string('gender')->nullable();
            $table->string('phoneNumber');
            $table->unsignedBigInteger('provider_id');
            $table->timestamps();

            $table->foreign('provider_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_requests');
    }
};
