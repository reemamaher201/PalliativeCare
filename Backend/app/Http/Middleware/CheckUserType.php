<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserType
{
    public function handle(Request $request, Closure $next, string $type): Response
    {
        try {
            // الحصول على المستخدم من التوكن
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json(['error' => 'Unauthorized: User not authenticated'], 401);
            }

            // تحويل نوع المستخدم المدخل إلى ثابت
            $userTypeConstant = constant("App\Models\User::USER_TYPE_" . strtoupper($type));

            if ($user->user_type === $userTypeConstant) {
                return $next($request);
            }

            return response()->json([
                'error' => 'Unauthorized: User type "' . $user->user_type . '" does not match required type "' . $type . '"'
            ], 403);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token Expired, please login again'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token, authentication failed'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenBlacklistedException $e) {
            return response()->json(['error' => 'Token Blacklisted, please login again'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['error' => 'Token not provided or invalid'], 401);
        }
    }
}
