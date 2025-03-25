<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LoginTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_login()
    {
//        $response = $this->get('/api/login');

        $response = $this->post('/api/login', [
            'identity_number' => '123456799',
            'password' => '12345678',
        ]);

        $response->assertStatus(200);
    }

}
