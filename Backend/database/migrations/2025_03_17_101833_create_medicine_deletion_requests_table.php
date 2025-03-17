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
        Schema::create('medicine_deletion_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('medicine_id'); // معرف الدواء المراد حذفه
            $table->unsignedBigInteger('provider_id'); // معرف المزود الذي أرسل الطلب
            $table->string('status')->default('pending'); // حالة الطلب (pending, approved, rejected)
            $table->timestamps();

            // Foreign keys
            $table->foreign('medicine_id')->references('id')->on('medicines')->onDelete('cascade');
            $table->foreign('provider_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicine_deletion_requests');
    }
};
