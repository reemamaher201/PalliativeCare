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
        // في ملف migration
        Schema::table('patients', function (Blueprint $table) {
            $table->tinyInteger('delete_status')->default(0); // 0: لا يوجد طلب حذف, 1: طلب حذف معلق, 2: طلب حذف مرفوض
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            //
        });
    }
};
