<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\DB;

class MedicineController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if ($user->user_type !== 0 && $user->user_type !== 1) {
                return response()->json(['message' => 'ليس لديك صلاحية إضافة دواء.'], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'distributed_quantity' => 'nullable|integer',
                'required_quantity' => 'nullable|integer',
                'locations' => 'nullable|string',
                'next_distribution_date' => 'nullable|date',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()], 400);
            }

            $medicine = Medicine::create([
                'name' => $request->name,
                'description' => $request->description,
                'distributed_quantity' => $request->distributed_quantity,
                'required_quantity' => $request->required_quantity,
                'locations' => $request->locations,
                'next_distribution_date' => $request->next_distribution_date,
            ]);

            DB::commit();
            return response()->json(['message' => 'تمت إضافة الدواء بنجاح.', 'medicine' => $medicine], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error adding medicine: " . $e->getMessage());
            return response()->json(['message' => 'حدث خطأ أثناء إضافة الدواء: ' . $e->getMessage()], 500);
        }
    }
    public function index()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if ($user->user_type !== User::USER_TYPE_MINISTRY && $user->user_type !== User::USER_TYPE_PROVIDER && $user->user_type !== User::USER_TYPE_PATIENT) {
                return response()->json(['message' => 'ليس لديك صلاحية عرض الأدوية.'], 403);
            }

            $medicines = Medicine::all();
            return response()->json(['medicines' => $medicines, 'user_type' => $user->user_type]);


        } catch (\Exception $e) {
            return response()->json(['message' => 'حدث خطأ أثناء جلب الأدوية: ' . $e->getMessage()], 500);
        }
    }

    public function destroyMedicine($id)
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
                return response()->json(['message' => 'غير مصرح لك بحذف الدواء'], 403);
            }

            $medicine = Medicine::find($id);

            if (!$medicine) {
                return response()->json(['message' => 'لم يتم العثور على الدواء'], 404);
            }

            $medicine->delete();

            return response()->json(['message' => 'تم حذف الدواء بنجاح']);
        } catch (\Exception $e) {
            Log::error("Error deleting medicine: " . $e->getMessage());
            return response()->json(['message' => 'حدث خطأ أثناء حذف الدواء: ' . $e->getMessage()], 500);
        }
    }

    public function updateMedicine(Request $request, $id)
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
                return response()->json(['message' => 'غير مصرح لك بتعديل الدواء'], 403);
            }

            $medicine = Medicine::find($id);

            if (!$medicine) {
                return response()->json(['message' => 'لم يتم العثور على الدواء'], 404);
            }

            $medicine->update($request->all());

            return response()->json(['message' => 'تم تحديث الدواء بنجاح', 'medicine' => $medicine]);
        } catch (\Exception $e) {
            Log::error("Error updating medicine: " . $e->getMessage());
            return response()->json(['message' => 'حدث خطأ أثناء تعديل الدواء: ' . $e->getMessage()], 500);
        }
    }
}
