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
        Schema::create('med_requests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('address')->nullable();
            $table->date('delivery_date')->nullable();
            $table->string('type')->nullable();
            $table->string('quantity')->nullable();
            $table->text('description')->nullable();
            $table->unsignedBigInteger('provider_id');
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('provider_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('med_requests');
    }
};
