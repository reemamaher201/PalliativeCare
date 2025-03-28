<?php
namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
        $request->validate([
            'title' => 'required|string|max:255',
            'text' => 'required|string',
            'date' => 'nullable|date',
            'recipient' => 'required|string|max:255',
        ]);

        $authUser = JWTAuth::parseToken()->authenticate();
        if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
            return response()->json(['message' => 'غير مصرح لك بإنشاء إشعار'], 403);
        }

        $notification = Notification::create($request->all());
        return response()->json($notification, 201);
    }

    public function destroynotification($id)
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
                return response()->json(['message' => 'غير مصرح لك بحذف الدواء'], 403);
            }

            $notification = Notification::find($id);

            if (!$notification) {
                return response()->json(['message' => 'لم يتم العثور على notification'], 404);
            }

            $notification->delete();

            return response()->json(['message' => 'تم حذف notification بنجاح']);
        } catch (\Exception $e) {
            Log::error("Error deleting notification: " . $e->getMessage());
            return response()->json(['message' => 'حدث خطأ أثناء حذف notification: ' . $e->getMessage()], 500);
        }
    }

    public function updatenotification(Request $request, $id)
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
                return response()->json(['message' => 'غير مصرح لك بتعديل notification'], 403);
            }

            $notification = Notification::find($id);

            if (!$notification) {
                return response()->json(['message' => 'لم يتم العثور على notification'], 404);
            }

            $notification->update($request->all());

            return response()->json(['message' => 'تم تحديث notification بنجاح', 'notification' => $notification]);
        } catch (\Exception $e) {
            Log::error("Error updating notification: " . $e->getMessage());
            return response()->json(['message' => 'حدث خطأ أثناء تعديل notification: ' . $e->getMessage()], 500);
        }
    }
}
