<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'identity_number' => '400045367',
            'name' => 'Reema Maher',
            'phoneNumber' => '595159730',
            'password' => Hash::make('12345678'), // قم بتغيير كلمة المرور إلى كلمة مرور آمنة
            'user_type' => 0, // عامل وزارة
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users')->insert([
            'identity_number' => '123456799',
            'name' => 'أحمد محمد',
            'phoneNumber' => '1234567899',
            'password' => Hash::make('12345678'), // تغيير كلمة المرور
            'user_type' => 0, // نوع مستخدم آخر
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('users')->insert([
            'identity_number' => '123456789',
            'name' => 'John Doe',
            'phoneNumber' => '1234567890',
            'password' => Hash::make('12345678'), // تغيير كلمة المرور
            'user_type' => 0, // نوع مستخدم آخر
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
