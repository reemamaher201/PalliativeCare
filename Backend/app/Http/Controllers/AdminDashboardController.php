<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\LandingPage;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdminDashboardController extends Controller {

    // جلب بيانات الصفحة
    public function show() {
        try {
            // التحقق من التوكن وجلب المستخدم
            $authUser = JWTAuth::parseToken()->authenticate();

            // التحقق من نوع المستخدم (يجب أن يكون 3)
            if ($authUser->user_type !== User::USER_TYPE_ADMIN) {
                return response()->json(['message' => 'غير مصرح لك بعرض بيانات صفحة الهبوط'], 403);
            }

            // إنشاء سجل جديد إذا لم يكن موجودًا
            $landingPage = LandingPage::firstOrCreate([]);

            return response()->json($landingPage);

        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token is Expired'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong'], 500);
        }
    }


    // تحديث بيانات الصفحة
    public function update(Request $request) {

        try {
            // التحقق من التوكن وجلب المستخدم
            $authUser = JWTAuth::parseToken()->authenticate();

            // التحقق من نوع المستخدم (يجب أن يكون 3)
            if ($authUser->user_type !== User::USER_TYPE_ADMIN) {
                return response()->json(['message' => 'غير مصرح لك بتعديل صفحة الهبوط'], 403);
            }

            $request->validate([
                'navbar' => 'nullable|array',
                'about' => 'nullable|string',
                'features' => 'nullable|array',
                'services' => 'nullable|array',
                'blogs' => 'nullable|array',
                'footer' => 'nullable|array',
                'colors' => 'nullable|array',
            ]);

            // إنشاء سجل جديد إذا لم يكن موجودًا
            $landingPage = LandingPage::firstOrCreate([]);

            $landingPage->update($request->all());
            return response()->json(['message' => 'تم تحديث صفحة الهبوط بنجاح', 'data' => $landingPage]);

        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token is Expired'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong'], 500);
        }
    }
}
