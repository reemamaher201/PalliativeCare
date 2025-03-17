<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('medicines', function (Blueprint $table) {
            $table->boolean('delete_request_pending')->default(false); // قيمة افتراضية false
        });
    }

    public function down()
    {
        Schema::table('medicines', function (Blueprint $table) {
            $table->dropColumn('delete_request_pending');
        });
    }
};
