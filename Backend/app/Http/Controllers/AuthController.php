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
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Notifications\EmailVerificationNotification;

class AuthController extends Controller
{
    /**
     * تسجيل مستخدم جديد
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phoneNumber' => 'required|string|unique:users|regex:/^[0-9]+$/|min:10|max:15',
            'identity_number' => 'required|string|unique:users|regex:/^[0-9]+$/|min:8|max:9',
            'password' => 'required|string|min:8|confirmed',
            'address' => 'required|string|max:500',
            'birth_date' => 'required|date|before_or_equal:today',
            'care_type' => 'required|string|max:255',
            'gender' => 'required|string|in:male,female',
            'email' => 'nullable|email|unique:users',
            'user_type' => 'sometimes|integer|in:0,1,2,3',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // حساب العمر من تاريخ الميلاد
            $age = Carbon::parse($request->birth_date)->age;

            // إنشاء المستخدم
            $user = User::create([
                'name' => $request->name,
                'phoneNumber' => $request->phoneNumber,
                'identity_number' => $request->identity_number,
                'password' => Hash::make($request->password),
                'address' => $request->address,
                'user_type' => User::USER_TYPE_PATIENT,
                'email' => $request->email,
                'email_verification_token' => Str::random(60),
                'is_active' => 0 // غير نشط حتى يتم التحقق
            ]);

            // إضافة بيانات المريض
            Patient::create([
                'identity_number' => $request->identity_number,
                'name' => $request->name,
                'phoneNumber' => $request->phoneNumber,
                'address' => $request->address,
                'birth_date' => $request->birth_date,
                'age' => $age,
                'care_type' => $request->care_type,
                'gender' => $request->gender,
                'add_by' => $user->id,
            ]);

            // إرسال بريد التحقق إذا كان البريد الإلكتروني موجودًا
            if ($request->email) {
                $user->notify(new EmailVerificationNotification($user->email_verification_token));
            }

            // إنشاء توكن JWT
            $token = JWTAuth::fromUser($user);

            return response()->json([
                'status' => 'success',
                'message' => 'User registered successfully. ' . ($request->email ? 'Please verify your email.' : ''),
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Registration error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed. Please try again.'
            ], 500);
        }
    }


    public function login(Request $request)
    {
        // 1. التحقق من صحة البيانات
        $validator = Validator::make($request->all(), [
            'identity_number' => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // 2. البحث عن المستخدم برقم الهوية
        $user = User::where('identity_number', $request->identity_number)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'رقم الهوية غير مسجل'
            ], 404);
        }

        // 3. التحقق من كلمة المرور يدوياً (للتأكد من المشكلة)
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'كلمة المرور غير صحيحة'
            ], 401);
        }

        // 4. إنشاء توكن JWT يدوياً
        try {
            $token = JWTAuth::fromUser($user);

            return response()->json([
                'status' => 'success',
                'message' => 'تم التسجيل بنجاح',
                'data' => [
                    'token' => $token,
                    'user' => $user
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'فشل إنشاء التوكن: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * تجديد التوكن
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function refreshToken(Request $request)
    {
        try {
            if (!$token = JWTAuth::getToken()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Token not provided'
                ], 401);
            }

            $newToken = JWTAuth::refresh($token);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'token' => $newToken,
                    'expires_in' => config('jwt.ttl') * 60
                ]
            ]);

        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token expired'
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unable to refresh token'
            ], 401);
        }
    }

    /**
     * تسجيل الخروج
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        try {
            $token = JWTAuth::getToken();

            if (!$token) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not logged in'
                ], 400);
            }

            $user = JWTAuth::user();
            $user->update(['is_active' => 0]);

            JWTAuth::invalidate($token);

            return response()->json([
                'status' => 'success',
                'message' => 'Logout successful'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Logout failed'
            ], 500);
        }
    }

    /**
     * التحقق من البريد الإلكتروني
     *
     * @param string $token
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyEmail($token)
    {
        try {
            $user = User::where('email_verification_token', $token)->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid verification token'
                ], 404);
            }

            $user->update([
                'email_verified_at' => Carbon::now(),
                'email_verification_token' => null,
                'is_active' => 1
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Email verified successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Email verification error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Email verification failed'
            ], 500);
        }
    }

    /**
     * إعداد بيانات المستخدم للاستجابة
     *
     * @param User $user
     * @param string $token
     * @return array
     */
    protected function prepareUserData(User $user, $token)
    {
        return [
            'user' => [
                'id' => $user->id,
                'identity_number' => $user->identity_number,
                'name' => $user->name,
                'phoneNumber' => $user->phoneNumber,
                'phoneNumber_verified_at' => $user->phoneNumber_verified_at,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'user_type' => $user->user_type,
                'address' => $user->address,
                'last_login_at' => $user->last_login_at ? $user->last_login_at->toDateTimeString() : null,
                'created_at' => $user->created_at->toDateTimeString(),
                'updated_at' => $user->updated_at->toDateTimeString(),
                'is_active' => $user->is_active,
            ],
            'token' => $token,
            'expires_in' => config('jwt.ttl') * 60,
        ];
    }

    /**
     * Rate Limiting Functions
     */
    protected function hasTooManyLoginAttempts(Request $request)
    {
        $maxAttempts = 20;
        $decayMinutes = 15;
        return Cache::has($this->throttleKey($request)) &&
            Cache::get($this->throttleKey($request)) >= $maxAttempts;
    }

    protected function incrementLoginAttempts(Request $request)
    {
        $key = $this->throttleKey($request);
        $decayMinutes = 15;

        Cache::add($key, 0, $decayMinutes * 60);
        Cache::increment($key);
    }

    protected function clearLoginAttempts(Request $request)
    {
        Cache::forget($this->throttleKey($request));
    }

    protected function availableIn($key)
    {
        return Cache::has($key) ? Cache::get($key) : 0;
    }

    protected function throttleKey(Request $request)
    {
        return 'login_attempts_' . $request->ip() . '|' . $request->identity_number;
    }
}
