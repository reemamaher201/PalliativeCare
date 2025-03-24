<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class ChatController extends Controller
{
    // إرسال رسالة
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        // التحقق من أن المستخدم المرسل إليه نشط
        $receiver = User::find($request->receiver_id);
        if (!$receiver) {
            return response()->json(['error' => 'المستخدم غير موجود'], 404);
        }

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        return response()->json(['message' => 'تم إرسال الرسالة بنجاح', 'data' => $message], 201);
    }

    // الحصول على الرسائل بين مستخدمين
    public function getMessages($receiverId)
    {
        // التحقق من أن المستخدم المرسل إليه موجود
        $receiver = User::find($receiverId);
        if (!$receiver) {
            return response()->json(['error' => 'المستخدم غير موجود'], 404);
        }

        // استرجاع الرسائل بين المستخدمين
        $messages = Message::where(function ($query) use ($receiverId) {
            $query->where('sender_id', Auth::id())
                ->where('receiver_id', $receiverId);
        })->orWhere(function ($query) use ($receiverId) {
            $query->where('sender_id', $receiverId)
                ->where('receiver_id', Auth::id());
        })->orderBy('created_at', 'asc')->get();

        return response()->json(['messages' => $messages], 200);
    }

    // الحصول على قائمة المستخدمين للدردشة مع حالة الاتصال
    public function getChatUsers()
    {
        // استرجاع جميع المستخدمين ما عدا المستخدم الحالي
        $users = User::where('id', '!=', Auth::id())->get();

        // إضافة حالة الاتصال (أونلاين/أوفلاين) لكل مستخدم
        $users->each(function ($user) {
            $user->is_online = Cache::has('user-is-online-' . $user->id);
        });

        return response()->json(['users' => $users], 200);
    }

    // تحديث حالة المستخدم إلى أونلاين
    public function setUserOnline(Request $request)
    {
        $user = Auth::user();
        $user->is_active = true;
        $user->save();
        Cache::put('user-is-online-' . $user->id, true, now()->addMinutes(5)); // تحديث حالة الاتصال لمدة 5 دقائق

        return response()->json(['message' => 'تم تحديث الحالة إلى أونلاين'], 200);
    }

// تحديث حالة المستخدم إلى أوفلاين
    public function setUserOffline(Request $request)
    {
        $user = Auth::user();
        $user->is_active = false;
        $user->save();
        Cache::forget('user-is-online-' . $user->id); // إزالة حالة الاتصال

        return response()->json(['message' => 'تم تحديث الحالة إلى أوفلاين'], 200);
    }
}
