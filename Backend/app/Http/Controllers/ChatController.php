<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class ChatController extends Controller
{
    // إرسال رسالة
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $user = JWTAuth::parseToken()->authenticate();
        $receiver = User::find($request->receiver_id);

        if (!$receiver) {
            return response()->json(['error' => 'المستخدم غير موجود'], 404);
        }

        if (!$this->isValidChat($user, $receiver)) {
            return response()->json(['error' => 'غير مسموح بالدردشة مع هذا المستخدم'], 403);
        }

        $message = Message::create([
            'sender_id' => $user->id,
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        return response()->json(['message' => 'تم إرسال الرسالة بنجاح', 'data' => $message], 201);
    }

    // الحصول على الرسائل بين مستخدمين
    public function getMessages($receiverId)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $receiver = User::find($receiverId);

        if (!$receiver) {
            return response()->json(['error' => 'المستخدم غير موجود'], 404);
        }

        if (!$this->isValidChat($user, $receiver)) {
            return response()->json(['error' => 'غير مسموح بمشاهدة هذه المحادثة'], 403);
        }

        $messages = Message::where(function ($query) use ($user, $receiverId) {
            $query->where('sender_id', $user->id)
                ->where('receiver_id', $receiverId);
        })->orWhere(function ($query) use ($user, $receiverId) {
            $query->where('sender_id', $receiverId)
                ->where('receiver_id', $user->id);
        })->orderBy('created_at', 'asc')->get();

        return response()->json(['messages' => $messages], 200);
    }

    // get users with the online status
    public function getChatUsers()
    {
        $user = JWTAuth::parseToken()->authenticate();

        $query = User::where('id', '!=', $user->id)
            ->where('user_type', '!=', 3);

        if ($user->user_type == 2) {
            $query->whereIn('user_type', [0, 1]);
        }

        $users = $query->get(['id', 'name', 'user_type', 'is_active']);

        return response()->json(['users' => $users], 200);
    }

    // تحديث حالة المستخدم إلى نشط
    public function setUserActive(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $user->is_active = true;
        $user->save();

        return response()->json(['message' => 'تم تحديث الحالة إلى نشط'], 200);
    }

    // تحديث حالة المستخدم إلى غير نشط
    public function setUserInactive(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $user->is_active = false;
        $user->save();

        return response()->json(['message' => 'تم تحديث الحالة إلى غير نشط'], 200);
    }

    // دالة مساعدة للتحقق من صلاحية المحادثة
    private function isValidChat($sender, $receiver)
    {
        if ($receiver->user_type == 3) {
            return false;
        }

        if ($sender->user_type == 2 && !in_array($receiver->user_type, [0, 1])) {
            return false;
        }

        return true;
    }
}
