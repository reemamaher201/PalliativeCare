<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;

class CheckUserType
{
    public function handle(Request $request, Closure $next, string $type): Response
    {
        // تحويل نوع المستخدم المدخل إلى ثابت
        $userTypeConstant = constant("App\Models\User::USER_TYPE_" . strtoupper($type));

        if (auth()->check() && auth()->user()->user_type === $userTypeConstant) {
            return $next($request);
        }

        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized: User not authenticated'], 401);
        }

        return response()->json(['error' => 'Unauthorized: User type "' . auth()->user()->user_type . '" does not match required type "' . $type . '"'], 403);
    }
}
