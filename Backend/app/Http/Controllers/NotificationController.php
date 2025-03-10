<?php
namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::all();
        return response()->json($notifications);
    }

    public function store(Request $request)
    {
        // التحقق من صحة البيانات
        $request->validate([
            'title' => 'required|string|max:255',
            'text' => 'required|string',
            'date' => 'nullable|date',
            'recipient' => 'required|string|max:255',
        ]);

        // التحقق من نوع المستخدم
        $authUser = JWTAuth::parseToken()->authenticate(); // استرجاع المستخدم المصادق عليه
        if ($authUser->user_type !== 0) {
            return response()->json(['message' => 'غير مصرح لك بإنشاء إشعار'], 403);
        }

        $notification = Notification::create($request->all());
        return response()->json($notification, 201);
    }
}
