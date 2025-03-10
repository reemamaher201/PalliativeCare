<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */

    public function handle($request, Closure $next)
    {
        if (auth()->user() && (auth()->user()->user_type === 3)) { // 3 هو نوع المستخدم الادمن
            return $next($request);
        }

        return response()->json(['error' => 'غير مصرح بالوصول'], 403);
    }
}
