<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\Patient;
use App\Models\Provider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
//    public function register(Request $request)
//    {
//        $validator = Validator::make($request->all(), [
//            'name' => 'required|string|max:255',
//            'phoneNumber' => 'required|string|min:10|unique:users',
//            'identity_number' => 'required|string|min:9|unique:users',
//            'password' => 'required|string|min:8|max:12|confirmed',
//            'user_type' => 'nullable|integer|in:0,1,2',
//            'address' => 'nullable|string|max:255',
//            'birth_date' => 'nullable|date',
//            'age' => 'nullable|integer|min:2',
//            'care_type' => 'nullable|string|max:255',
//            'gender' => 'nullable|string|in:male,female,other',
//        ]);
//
//        if ($validator->fails()) {
//            return response()->json($validator->errors()->toJson(), 400);
//        }
//
//        // تسجيل المستخدم في جدول users
//        $user = User::create([
//            'name' => $request->get('name'),
//            'identity_number' => $request->get('identity_number'),
//            'phoneNumber' => $request->get('phoneNumber'),
//            'password' => Hash::make($request->get('password')),
//            'user_type' => $request->get('user_type', 2),
//        ]);
//
//        // تسجيل المريض في جدول patients
//        $patient = Patient::create([
//            'identity_number' => $user->identity_number,
//            'name'=>$user->name,
//            'address' => $request->get('address'),
//            'birth_date' => $request->get('birth_date'),
//            'age' => $request->get('age'),
//            'care_type' => $request->get('care_type'),
//            'gender' => $request->get('gender'),
//        ]);
//
//        // إنشاء التوكن
//        $token = JWTAuth::fromUser($user);
//
//        return response()->json([
//            'message' => 'User and Patient registered successfully',
//            'user' => $user,
//            'patient' => $patient,
//            'token' => $token,
//        ], 201);
//    }
//
//
//    public function login(Request $request)
//    {
//        $request->validate([
//            'identity_number' => 'required|integer|digits:9',
//            'password' => 'required|string|min:8|max:12'
//        ]);
//
//        $user = User::where('identity_number', $request->input('identity_number'))->first();
//
//        if (!$user) {
//            return response()->json(['error' => 'Invalid ID'], 401);
//        }
//
//        if (!Hash::check($request->input('password'), $user->password)) {
//            return response()->json(['error' => 'Wrong password'], 401);
//        }
//
//        $token = JWTAuth::fromUser($user);
//
//        return response()->json([
//            'message' => 'User Login Successfully',
//            'user' => $user->makeHidden(['password']),
//            'user_type' => $user->user_type, // إرجاع نوع المستخدم
//            'token' => $token
//        ]);
//    }



    public function dashboardM(): JsonResponse
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if ($user->user_type !== User::USER_TYPE_MINISTRY) {
                return response()->json(['error' => 'Unauthorized: User type mismatch'], 403);
            }

            $min = $user->name;
            $registeredPatientsCount = User::where('user_type', User::USER_TYPE_PATIENT)->count();

            return response()->json([
                'registeredPatientsCount' => $registeredPatientsCount,
                'min' => $min,
            ]);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            Log::error('JWT Token Expired: ' . $e->getMessage());
            return response()->json(['error' => 'Token Expired'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            Log::error('JWT Token Invalid: ' . $e->getMessage());
            return response()->json(['error' => 'Token Invalid'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenBlacklistedException $e) {
            Log::error('JWT Token Blacklisted: ' . $e->getMessage());
            return response()->json(['error' => 'Token Blacklisted'], 401);
        } catch (\Exception $e) {
            Log::error('Error in dashboardM: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function me(): JsonResponse
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            return response()->json(['user' => $user]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Authentication failed'], 401);
        }
    }


}
