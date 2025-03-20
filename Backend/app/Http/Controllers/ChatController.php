<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    // إرسال رسالة
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

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
        $messages = Message::where(function ($query) use ($receiverId) {
            $query->where('sender_id', Auth::id())
                ->where('receiver_id', $receiverId);
        })->orWhere(function ($query) use ($receiverId) {
            $query->where('sender_id', $receiverId)
                ->where('receiver_id', Auth::id());
        })->orderBy('created_at', 'asc')->get();

        return response()->json(['messages' => $messages], 200);
    }

    // الحصول على قائمة المستخدمين للدردشة
    public function getChatUsers()
    {
        $users = User::where('id', '!=', Auth::id())->get();
        return response()->json(['users' => $users], 200);
    }
}
