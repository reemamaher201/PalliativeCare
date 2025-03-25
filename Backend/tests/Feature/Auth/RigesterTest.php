<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class RigesterTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_register()
    {

        $response = $this->post('/api/register', [
            'name' => 'John Doe',
            'phoneNumber'=>'2321322373',
            'identity_number' => '423426739',
            'password' => '12345678',
            'address' => 'Test Address',
            'user_type' => 2,
        ]);

        $response->assertStatus(201);
    }
}
