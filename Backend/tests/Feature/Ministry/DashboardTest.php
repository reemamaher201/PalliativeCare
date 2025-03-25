<?php

namespace Tests\Feature\Ministry;

use Tests\TestCase;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboardM_requires_authentication()
    {
        $response = $this->getJson('/api/dashboardM');
        dd($response);
        $response->assertStatus(401)->assertJson(['error' => 'Token not provided or invalid']);
    }

    public function test_dashboardM_with_valid_token()
    {
        // إنشاء مستخدم من نوع الوزارة
        $user = User::factory()->create([
            'user_type' => User::USER_TYPE_MINISTRY,
        ]);

        // إنشاء توكن JWT للمستخدم
        $token = JWTAuth::fromUser($user);

        // إرسال الطلب مع التوكن في الهيدر
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->getJson('/api/dashboardM');

        // التحقق من أن الطلب تم بنجاح
        $response->assertStatus(200)
            ->assertJsonStructure([
                'registeredPatientsCount',
                'min',
            ]);
    }
}
