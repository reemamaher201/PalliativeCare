<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

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
            'birth_date' => 'required|date',
            'care_type' => 'required|string',
            'gender' => 'required|string|in:male,female',
            'user_type' => 'integer|in:0,1,2,3',
            'added_by' => 'nullable|integer',
        ]);

        // حساب العمر من تاريخ الميلاد
        $birthDate = new \Carbon\Carbon($request->birth_date);
        $age = $birthDate->diffInYears(\Carbon\Carbon::now());

        // إنشاء المستخدم
        $user = User::create([
            'name' => $request->name,
            'phoneNumber' => $request->phoneNumber,
            'identity_number' => $request->identity_number,
            'password' => Hash::make($request->password),
            'address' => $request->address,
            'user_type' => User::USER_TYPE_PATIENT,
        ]);

        // إضافة بيانات المريض في جدول المرضى
        Patient::create([
            'identity_number' => $request->identity_number,
            'name' => $request->name,
            'phoneNumber' => $request->phoneNumber,
            'address' => $request->address,
            'birth_date' => $request->birth_date,
            'age' => $age, // يتم حساب العمر هنا
            'care_type' => $request->care_type,
            'gender' => $request->gender,
            'add_by' => $user->id,
        ]);

        // إنشاء توكن JWT
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }
    public function login(Request $request)
    {
        $request->validate([
            'identity_number' => 'required|string|regex:/^[0-9]+$/',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('identity_number', 'password');

        // Check failed attempts
        $attempts = Cache::get("login_attempts_{$request->ip()}", 0);
        if ($attempts >= 5) {
            return response()->json(['error' => 'Too many login attempts. Please try again later.'], 429);
        }

        if (!$token = JWTAuth::attempt($credentials)) {
            // Increase the number of failed attempts
            Cache::put("login_attempts_{$request->ip()}", $attempts + 1, 300); // 5 minutes
            Log::error('Login failed: Invalid credentials for identity_number: ' . $request->identity_number); // تسجيل الخطأ
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        // Reset attempts after successful login
        Cache::forget("login_attempts_{$request->ip()}");

        $user = JWTAuth::user();

        Log::info('User login attempt: identity_number: ' . $user->identity_number . ', is_active: ' . $user->is_active); // تسجيل معلومات المستخدم

        // تحديث حالة المستخدم إلى نشط
        $user->is_active = 1;
        $user->save();

        // Update last login time
        $user->last_login_at = Carbon::now();
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'identity_number' => $user->identity_number,
                    'name' => $user->name,
                    'phoneNumber' => $user->phoneNumber,
                    'phoneNumber_verified_at' => $user->phoneNumber_verified_at,
                    'user_type' => $user->user_type,
                    'address' => $user->address,
                    'last_login_at' => $user->last_login_at->toDateTimeString(),
                    'created_at' => $user->created_at->toDateTimeString(),
                    'updated_at' => $user->updated_at->toDateTimeString(),
                    'is_active' => $user->is_active,
                ],
                'token' => $token,
                'expires_in' => config('jwt.ttl') * 60,
            ],
        ]);
    }
    public function refreshToken(Request $request)
    {
        try {
            if (!$token = JWTAuth::getToken()) {
                return response()->json(['error' => 'Token not provided'], 401);
            }

            $newToken = JWTAuth::refresh($token);
            return response()->json([
                'token' => $newToken,
                'expires_in' => config('jwt.ttl') * 60 // Token expiration time from the config
            ]);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token expired'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to refresh token'], 401);
        }
    }

    public function logout()
    {
        $token = JWTAuth::getToken();

        if (!$token) {
            return response()->json(['error' => 'User not logged in'], 400);
        }

        JWTAuth::invalidate($token);

        return response()->json(['message' => 'Logout successful']);
    }
}
