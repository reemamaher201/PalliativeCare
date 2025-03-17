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
        Schema::create('patient_modification_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id'); // معرف المريض
            $table->string('type'); // نوع الطلب: update أو delete
            $table->json('data')->nullable(); // بيانات التعديل (في حالة التعديل)
            $table->string('status')->default('pending'); // حالة الطلب: pending, approved, rejected
            $table->unsignedBigInteger('requested_by'); // المستخدم الذي أرسل الطلب
            $table->timestamps();

            // العلاقات
            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
            $table->foreign('requested_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_modification_requests');
    }
};
