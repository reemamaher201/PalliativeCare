<?php

namespace App\Http\Controllers;

use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdminDashboardController extends Controller {

    // جلب بيانات الصفحة
    public function show() {
        try {
            // التحقق من التوكن وجلب المستخدم
            $authUser = JWTAuth::parseToken()->authenticate();

            // التحقق من نوع المستخدم (يجب أن يكون 3)
            if ($authUser->user_type !== User::USER_TYPE_ADMIN){
                return response()->json(['message' => 'غير مصرح لك بعرض بيانات صفحة الهبوط'], 403);
            }

            return response()->json(['message' => 'Landing page data retrieved successfully'], 200);


        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token is Expired'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}
