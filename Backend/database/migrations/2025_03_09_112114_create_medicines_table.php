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
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable(); // أو "موصوف لمرضى"
            $table->integer('distributed_quantity')->default(0); // أو "الكمية الموزعة"
            $table->integer('required_quantity')->default(0); // أو "الكمية المطلوبة"
            $table->text('locations')->nullable(); // أو "أماكن التواجد"
            $table->date('next_distribution_date')->nullable(); // أو "تاريخ التوزيع القادم"
            $table->timestamps(); // created_at و updated_at
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};
