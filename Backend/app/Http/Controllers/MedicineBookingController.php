<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\MedicineBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class MedicineBookingController extends Controller
{
    public function index()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            Log::info('User authenticated', ['user_id' => $user->id, 'user_type' => $user->user_type]);

            // بناء الاستعلام الأساسي مع العلاقات
            $query = MedicineBooking::with(['user', 'medicine'])
                ->orderBy('created_at', 'desc');

            // إذا كان المستخدم مريضًا (وليس وزارة) نضيف شرط user_id
            if ($user->user_type === 'patient') {
                $query->where('user_id', $user->id);
            }

            // إذا كان المستخدم من الوزارة يمكنه رؤية الكل بدون فلترة
            $bookings = $query->get();

            Log::info('Bookings retrieved', ['count' => $bookings->count()]);

            return response()->json([
                'status' => 'success',
                'data' => $bookings
            ]);

        } catch (\Exception $e) {
            Log::error('Error retrieving bookings', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'حدث خطأ أثناء جلب طلبات الأدوية'
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        DB::beginTransaction();

        try {
            $booking = MedicineBooking::findOrFail($id);

            if ($booking->status !== 'pending') {
                return response()->json([
                    'message' => 'لا يمكن تغيير حالة هذا الطلب'
                ], 422);
            }

            $booking->status = $request->status;
            $booking->save();

            if ($request->status === 'approved') {
                $medicine = $booking->medicine;
                $medicine->distributed_quantity -= $booking->quantity;
                $medicine->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'تم تحديث حالة الطلب بنجاح',
                'booking' => $booking->load(['user', 'medicine'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'حدث خطأ أثناء تحديث حالة الطلب'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'medicine_id' => 'required|exists:medicines,id',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'غير مصرح به، يرجى تسجيل الدخول'
                ], 401);
            }

            $medicine = Medicine::findOrFail($request->medicine_id);

            if ($medicine->distributed_quantity < $request->quantity) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'الكمية المطلوبة غير متوفرة. الكمية المتاحة: ' . $medicine->distributed_quantity
                ], 422);
            }

            $medicineBooking = MedicineBooking::create([
                'user_id' => $user->id,
                'medicine_id' => $request->medicine_id,
                'quantity' => $request->quantity,
                'notes' => $request->notes,
                'status' => 'pending'
            ]);

            Log::info('New medicine booking created', [
                'booking_id' => $medicineBooking->id,
                'user_id' => $user->id,
                'medicine_id' => $medicine->id
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'تم حجز الدواء بنجاح',
                'data' => [
                    'booking' => $medicineBooking,
                    'remaining_quantity' => $medicine->distributed_quantity - $request->quantity
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Medicine booking error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'حدث خطأ أثناء عملية الحجز'
            ], 500);
        }
    }

    public function approve(Request $request, MedicineBooking $medicineBooking)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user || ($user->user_type !== 'admin' && $user->id !== $medicineBooking->user_id)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'غير مصرح بهذه العملية'
                ], 403);
            }

            if ($medicineBooking->status !== 'pending') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'لا يمكن الموافقة على هذا الحجز. الحالة الحالية: ' . $medicineBooking->status
                ], 422);
            }

            $medicine = $medicineBooking->medicine;

            if ($medicine->distributed_quantity < $medicineBooking->quantity) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'الكمية غير متوفرة. الكمية المطلوبة: ' . $medicineBooking->quantity .
                        ', الكمية المتاحة: ' . $medicine->distributed_quantity
                ], 422);
            }

            DB::transaction(function () use ($medicineBooking, $medicine, $user) {
                $medicineBooking->update([
                    'status' => 'approved',
                    'approved_by' => $user->id,
                    'approved_at' => now()
                ]);

                $medicine->decrement('distributed_quantity', $medicineBooking->quantity);
            });

            Log::info('Medicine booking approved', [
                'booking_id' => $medicineBooking->id,
                'approved_by' => $user->id
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'تمت الموافقة على الحجز بنجاح',
                'data' => [
                    'booking' => $medicineBooking->fresh(),
                    'medicine' => $medicine->fresh()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Approve booking error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'حدث خطأ أثناء الموافقة على الحجز'
            ], 500);
        }
    }

    public function checkData(Request $request)
    {
        try {
            $totalBookings = MedicineBooking::count();

            $user = JWTAuth::parseToken()->authenticate();

            $testBooking = MedicineBooking::with(['user', 'medicine'])->first();

            return response()->json([
                'total_bookings' => $totalBookings,
                'current_user_id' => $user ? $user->id : null,
                'test_booking' => $testBooking,
                'user_bookings_count' => $user ? MedicineBooking::where('user_id', $user->id)->count() : 0
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
