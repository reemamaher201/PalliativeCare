<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\Patient;
use App\Models\Provider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phoneNumber' => 'required|string|min:10|unique:users',
            'identity_number' => 'required|string|min:9|unique:users',
            'password' => 'required|string|min:8|max:12|confirmed',
            'user_type' => 'nullable|integer|in:0,1,2',
            'address' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'age' => 'nullable|integer|min:2',
            'care_type' => 'nullable|string|max:255',
            'gender' => 'nullable|string|in:male,female,other',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        // تسجيل المستخدم في جدول users
        $user = User::create([
            'name' => $request->get('name'),
            'identity_number' => $request->get('identity_number'),
            'phoneNumber' => $request->get('phoneNumber'),
            'password' => Hash::make($request->get('password')),
            'user_type' => $request->get('user_type', 2),
        ]);

        // تسجيل المريض في جدول patients
        $patient = Patient::create([
            'identity_number' => $user->identity_number,
            'name'=>$user->name,
            'address' => $request->get('address'),
            'birth_date' => $request->get('birth_date'),
            'age' => $request->get('age'),
            'care_type' => $request->get('care_type'),
            'gender' => $request->get('gender'),
        ]);

        // إنشاء التوكن
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'User and Patient registered successfully',
            'user' => $user,
            'patient' => $patient,
            'token' => $token,
        ], 201);
    }
//    public function login(Request $request)
//    {
//        $request->validate([
//            'identity_number' => 'required|string',
//            'password' => 'required|string'
//        ]);
//
//        $user = User::where('identity_number', $request->input('identity_number'))->first();
//
//        if (!$user) {
//            return response()->json(['error' => 'Invalid ID'], 401);
//        }
//
//        if (!Hash::check($request->input('password'), $user->password)) {
//            return response()->json(['error' => 'Wrong password'], 401);
//        }
////
////        if (!in_array($user->user_type, [0, 1, 2, 3])) {
////            return response()->json(['error' => 'غير مسموح بالدخول لهذا النوع من المستخدمين'], 403);
////        }
//        // تحقق إضافي إذا لزم (مثال: إذا كان يجب تفعيل الحساب)
//        // if ($user->status != 1) {
//        //     return response()->json(['error' => 'الحساب غير مفعل'], 401);
//        // }
//
//        $token = JWTAuth::fromUser($user);
//
//        return response()->json([
//            'message' => 'User Login Successfully',
//            'user' => $user->makeHidden(['password']),
//            'user_type' => $user->user_type, // سيرسل القيمة 3 للادمن
//            'token' => $token
//        ]);
//    }

    public function login(Request $request)
    {
        $request->validate([
            'identity_number' => 'required|integer|digits:9',
            'password' => 'required|string|min:8|max:12'
        ]);

        $user = User::where('identity_number', $request->input('identity_number'))->first();

        if (!$user) {
            return response()->json(['error' => 'Invalid ID'], 401);
        }

        if (!Hash::check($request->input('password'), $user->password)) {
            return response()->json(['error' => 'Wrong password'], 401);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'User Login Successfully',
            'user' => $user->makeHidden(['password']),
            'user_type' => $user->user_type, // إرجاع نوع المستخدم
            'token' => $token
        ]);
    }


//    public function dashboardM(Request $request)
//    {
//        try {
//            $user = JWTAuth::parseToken()->authenticate();
//
//            // التحقق من نوع المستخدم (عامل وزارة)
//            if ($user->user_type != 0) { // نفترض أن 0 هو نوع مستخدم عامل وزارة
//                return response()->json(['error' => 'Unauthorized Access'], 403);
//            }
//
//
//
//            // إرجاع البيانات
//            return response()->json([
//                'name' => $user->name?? 'غير معروف',
//
//            ]);
//        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
//            return response()->json(['error' => 'Invalid Token'], 401);
//        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
//            return response()->json(['error' => 'Token is Expired'], 401);
//        } catch (\Exception $e) {
//            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
//        }
//    }
    public function dashboardM()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $min = $user->name;
            $registeredPatientsCount = User::where('user_type', 2)->count(); // استبدل 'role' حسب جدولك
           // $activeCases = EmergencyCase::where('status', 'active')->count();
           // $totalBeneficiaries = Beneficiary::count();

            return response()->json([
                'registeredPatientsCount' => $registeredPatientsCount,
'min' => $min,
//                'activeCases' => $activeCases,
//                'totalBeneficiaries' => $totalBeneficiaries,
//                'casesByRegion' => $this->getCasesByRegion(),
//                'availableMedicines' => Medicine::all(),
//                'emergencyCases' => EmergencyCase::all(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'حدث خطأ أثناء جلب البيانات'], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $token = JWTAuth::getToken();
            if (!$token) {
                return response()->json(['error' => 'Token not provided'], 401);
            }
            JWTAuth::invalidate($token);
            return response()->json(['message'=> ' logout successfully '], 200);

        }
        catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['error'=> 'Failed to logout '], 401);
        }

    }


    public function getUserProfile(Request $request)
    {
        try {
            // التحقق من التوكن وجلب المستخدم
            $user = JWTAuth::parseToken()->authenticate();

            // جلب بيانات المريض المرتبطة بالمستخدم
            $patient = Patient::where('identity_number', $user->identity_number)->first();

            // حساب العمر بناءً على تاريخ الميلاد
            $birthDate = $patient->birth_date ?? null; // تأكد من أن حقل birth_date موجود في جدول المرضى
            $age = null;

            if ($birthDate) {
                $birthDateObject = new \DateTime($birthDate); // تحويل تاريخ الميلاد إلى كائن DateTime
                $currentDate = new \DateTime(); // التاريخ الحالي
                $age = $currentDate->diff($birthDateObject)->y; // حساب العمر بالسنوات
            }

            // إرجاع بيانات المستخدم والمريض
            return response()->json([
                'name' => $user->name ?? 'غير معروف',
                'identity_number' => $user->identity_number ?? 'غير متوفر',
                'phoneNumber' => $user->phoneNumber ?? 'غير متوفر',
                'user_type' => $user->user_type ?? 'غير معروف',
                'address' => $patient->address ?? 'غير متوفر', // العنوان من جدول المرضى
                'care_type' => $patient->care_type ?? 'غير متوفر', // نوع الرعاية من جدول المرضى
                'age' => $age ?? 'غير متوفر', // العمر
                'gender' => $patient->gender ?? 'غير متوفر', // الجنس من جدول المرضى
            ]);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token is Expired'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong'], 500);
        }
    }


    public function showpatient(): JsonResponse
    {
        // جلب المرضى مع المستخدمين المرتبطين بهم، وتحديد نوع المستخدم = 2 (مريض)
        $patients = Patient::with('user:identity_number,name,phoneNumber')
            ->whereHas('user', function ($query) {
                $query->where('user_type', 2);
            })
            ->get();

        // تحويل البيانات إلى التنسيق المطلوب
        $result = $patients->map(function ($patient) {
            return [
                'id' => $patient->id,
                'name' => $patient->name,
                'identity_number' => $patient->identity_number, // استخدم identity_number بدلاً من nationalId
                'birth_date' => $patient->birth_date, // استخدم birth_date بدلاً من dateOfBirth
                'phoneNumber' => optional($patient->user)->phoneNumber, // الوصول إلى رقم الهاتف من جدول users
                'email' => optional($patient->user)->email, // الوصول إلى البريد الإلكتروني من جدول users
                'created_at' => $patient->created_at,
                'updated_at' => $patient->updated_at,
            ];
        });

        return response()->json($result->values());
    }
    public function storepatient(Request $request)
    {
        DB::beginTransaction();
        try {
            // فحص رمز JWT واسترجاع المستخدم المصادق عليه
            $authUser = JWTAuth::parseToken()->authenticate();

            // فحص نوع المستخدم (يجب أن يكون 0 أو 1)
            if ($authUser->user_type !== 0 && $authUser->user_type !== 1) {
                DB::rollBack();
                return response()->json(['message' => 'غير مصرح لك بإضافة مرضى.'], 403);
            }

            // التحقق من صحة البيانات المدخلة
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'identity_number' => 'required|string|max:20|unique:users',
                'phoneNumber' => 'required|string|max:20',
                'password' => 'required|string|min:8',
                'address' => 'required|string|max:255',
                'birth_date' => 'required|date',
                'care_type' => 'required|string|max:255',
                'gender' => 'required|string|in:male,female', // أو القيم المناسبة الأخرى
            ]);

            if ($validator->fails()) {
                DB::rollBack();
                return response()->json(['errors' => $validator->errors()], 400);
            }

            // إنشاء مستخدم جديد
            $user = User::create([
                'name' => $request->name,
                'identity_number' => $request->identity_number,
                'phoneNumber' => $request->phoneNumber,
                'password' => Hash::make($request->password),
                'user_type' => 2, // تحديد نوع المستخدم كمريض
            ]);

            // إنشاء مريض جديد وربطه بالمستخدم
            $patient = Patient::create([
                'identity_number' => $request->identity_number,
                'name' => $request->name,
                'address' => $request->address,
                'birth_date' => $request->birth_date,
                'care_type' => $request->care_type,
                'gender' => $request->gender,
            ]);

            DB::commit();
            return response()->json(['message' => 'تمت إضافة المريض بنجاح.'], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error adding patient: " . $e->getMessage());
            return response()->json(['message' => 'حدث خطأ أثناء إضافة المريض: ' . $e->getMessage()], 500);
        }
    }


    public function update(Request $request, $id)
    {
        // التحقق من صحة البيانات
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phoneNumber' => 'required|string|max:20',
            'address' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'care_type' => 'nullable|string|max:255',
            'gender' => 'nullable|string|in:male,female',
            'identity_number' => 'required|string|max:50|unique:users,identity_number,' . $id // تحقق من تميز رقم الهوية
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // البحث عن المريض
        $patient = Patient::find($id);
        if ($patient) {
            // تخزين الهوية القديمة
            $oldIdentityNumber = $patient->identity_number;

            // تحديث بيانات المريض
            $patient->update([
                'identity_number' => $request->identity_number,
                'name' => $request->name,
                'address' => $request->address,
                'birth_date' => $request->birth_date,
                'care_type' => $request->care_type,
                'gender' => $request->gender,
            ]);

            // تحديث بيانات المستخدم
            $user = User::where('identity_number', $oldIdentityNumber)->first();
            if ($user) {
                $user->update([
                    'identity_number' => $request->identity_number,
                    'name' => $request->name,
                    'phoneNumber' => $request->phoneNumber,
                ]);
            }

            return response()->json(['message' => 'تم تحديث بيانات المريض والمستخدم بنجاح', 'patient' => $patient]);
        }

        return response()->json(['message' => 'لم يتم العثور على المريض'], 404);
    }
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            // فحص رمز JWT واسترجاع المستخدم المصادق عليه
            $authUser = JWTAuth::parseToken()->authenticate();

            // فحص نوع المستخدم (تغيير الشرط إلى 0)
            if ($authUser->user_type !== 0) {
                DB::rollBack();
                return response()->json(['message' => 'غير مصرح لك بحذف المريض'], 403);
            }

            $patient = Patient::find($id);

            if (!$patient) {
                DB::rollBack();
                return response()->json(['message' => 'لم يتم العثور على المريض'], 404);
            }

            $user = User::where('identity_number', $patient->identity_number)->first();

            if (!$user) {
                DB::rollBack();
                return response()->json(['message' => 'لم يتم العثور على المستخدم المرتبط بالمريض'], 404);
            }

            // حذف المريض أولاً
            $patient->delete();

            // ثم حذف المستخدم
            $user->delete();

            DB::commit();
            return response()->json(['message' => 'تم حذف المريض والمستخدم بنجاح']);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error deleting provider: " . $e->getMessage());
            return response()->json(['message' => 'حدث خطأ أثناء الحذف: ' . $e->getMessage()], 500);
        }
    }

    public function destroyMedicine($id)
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            if ($authUser->user_type !== 0) {
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

            if ($authUser->user_type !== 0) {
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
