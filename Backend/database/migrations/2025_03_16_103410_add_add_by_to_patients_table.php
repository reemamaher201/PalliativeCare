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
        Schema::table('patients', function (Blueprint $table) {
            // إضافة العمود add_by كـ foreign key
            $table->unsignedBigInteger('add_by')->nullable(); // يمكن أن يكون nullable مؤقتًا
            $table->foreign('add_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            // حذف العلاقة ثم العمود
            $table->dropForeign(['add_by']); // حذف العلاقة
            $table->dropColumn('add_by'); // حذف العمود
        });
    }
};
