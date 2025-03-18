<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Cache;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'phoneNumber' => 'required|string|unique:users|regex:/^[0-9]+$/',
            'identity_number' => 'required|string|unique:users|regex:/^[0-9]+$/',
            'password' => 'required|string|min:8',
            'address' => 'required|string',
            'user_type' => 'required|integer|in:0,1,2,3',
        ]);

        $user = User::create([
            'name' => $request->name,
            'phoneNumber' => $request->phoneNumber,
            'identity_number' => $request->identity_number,
            'password' => Hash::make($request->password),
            'address' => $request->address,
            'user_type' => $request->user_type,
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('identity_number', 'password');

        // التحقق من عدد المحاولات الفاشلة
        $attempts = Cache::get("login_attempts_{$request->ip()}", 0);
        if ($attempts >= 5) {
            return response()->json(['error' => 'Too many login attempts. Please try again later.'], 429);
        }

        if (!$token = JWTAuth::attempt($credentials)) {
            // زيادة عدد المحاولات الفاشلة
            Cache::put("login_attempts_{$request->ip()}", $attempts + 1, 300); // 5 دقائق
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        // إعادة تعيين عدد المحاولات الفاشلة بعد تسجيل الدخول الناجح
        Cache::forget("login_attempts_{$request->ip()}");

        $user = JWTAuth::user();

        // التحقق من أن المستخدم نشط
        if ($user->is_active === 0) {
            return response()->json(['error' => 'Your account is inactive.'], 403);
        }

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function refreshToken(Request $request)
    {
        try {
            // التحقق من أن الـ Token الحالي صالح
            if (!auth()->check()) {
                return response()->json(['error' => 'Invalid token'], 401);
            }

            $newToken = auth()->refresh();
            return response()->json([
                'token' => $newToken,
                'expires_in' => auth()->factory()->getTTL() * 60
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to refresh token'], 401);
        }
    }

    public function logout()
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'User not logged in'], 400);
        }

        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json(['message' => 'Logout successful']);
    }
}
