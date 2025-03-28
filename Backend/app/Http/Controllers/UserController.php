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



    public function dashboardM(): JsonResponse
    {
        try {
            $token = JWTAuth::getToken();
            if (!$token) {
                return response()->json(['error' => 'Token not provided'], 401);
            }

            $user = JWTAuth::authenticate($token);
            if (!$user) {
                return response()->json(['error' => 'Unauthorized: Invalid token or user not found'], 401);
            }

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
            return response()->json(['error' => 'Token Expired, please login again'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token, authentication failed'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenBlacklistedException $e) {
            return response()->json(['error' => 'Token Blacklisted, please login again'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['error' => 'Token not provided or invalid'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }




//    public function me(): JsonResponse
//    {
//        try {
//            $user = JWTAuth::parseToken()->authenticate();
//            return response()->json(['user' => $user]);
//        } catch (\Exception $e) {
//            return response()->json(['error' => 'Authentication failed'], 401);
//        }
//    }


}
