<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->insert([
            'identity_number' => '123123123',
            'phoneNumber' => '966512345678',
            'name' => 'Admin',
            'phoneNumber_verified_at' => now(),
            'password' => Hash::make('12345678'),
            'user_type' => 3,
            'address' => 'غزة',
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
