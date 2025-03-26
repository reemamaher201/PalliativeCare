<?php

namespace Tests\Feature\Newsletter;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class SendEmailTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_subscribe()
    {
        $response = $this->post('api/subscribe', [
            'email' => 'rreemae@gmail.com',
        ]);

        $response->assertStatus(200);
    }
}
