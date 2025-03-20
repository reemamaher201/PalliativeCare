<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\MedicineDeletionRequest;
use App\Models\MedicineEditRequest;
use App\Models\MedRequest;
use App\Models\Patient;
use App\Models\PatientDeletionRequest;
use App\Models\PatientEditRequest;
use App\Models\PatientModificationRequest;
use App\Models\PatientRequest;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class ProviderController extends Controller
{
    public function showprovider()
    {
        // جلب المزودين مع المستخدمين المرتبطين بهم، وتحديد نوع المستخدم = 1 (مزود)
        $providers = Provider::with('user:id,name')
            ->whereHas('user', function ($query) {
                $query->where('user_type', 1);
            })
            ->get();

        // تحويل البيانات إلى التنسيق المطلوب
        $result = $providers->map(function ($provider) {
            return [
                'id' => $provider->id,
                'name' => $provider->user->name, // من جدول users
                'username' => $provider->username, // من جدول providers
                'email' => $provider->email, // من جدول providers
                'user_id' => $provider->user->id, // من جدول users
                'phoneNumber'=> $provider->phoneNumber,
                'created_at' => $provider->created_at, // من جدول providers
                'updated_at' => $provider->updated_at, // من جدول providers
            ];
        });

        return response()->json($result->values());
    }


    public function storeprovider(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'identity_number' => 'required|unique:users',
            'username' => 'required|unique:providers',
            'password' => 'required',
            'phoneNumber' => 'required|numeric|digits:10',
            'email' => 'required|email|unique:providers',
            'address' => 'nullable|string',
        ]);

        // إنشاء المستخدم
        $user = User::create([
            'name' => $request->name,
            'user_type' => 1,
            'identity_number' => $request->identity_number,
            'phoneNumber' => $request->phoneNumber,
            'password' => Hash::make($request->password),
            'address' => $request->address,
        ]);

        // إنشاء المزود وربطه بالمستخدم
        try {
            $provider = Provider::create([
                'user_id' => $user->id,
                'name' => $request->name,
                'identity_number' => $request->identity_number,
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'phoneNumber' => $request->phoneNumber,
                'email' => $request->email,
                'address' => $request->address,
            ]);

            return response()->json(['message' => 'تم تسجيل المزود بنجاح', 'provider' => $provider], 201);

        } catch (\Exception $e) {
            // تسجيل الخطأ أو عرضه
            dd($e->getMessage()); // سيوقف التنفيذ ويعرض رسالة الخطأ
            // أو يمكنك إرجاع استجابة خطأ JSON
            // return response()->json(['message' => 'حدث خطأ أثناء تسجيل المزود', 'error' => $e->getMessage()], 500);
        }
    }


    public function dashboardS()
    {
        try {
            // فحص رمز JWT واسترجاع المستخدم المصادق عليه
            $user = JWTAuth::parseToken()->authenticate();

            // الآن لديك المستخدم المصادق عليه من الرمز
            // يمكنك الوصول إلى بيانات المستخدم باستخدام $user->id, $user->name, $user->email, إلخ.

            // ابحث عن المزود بناءً على user_id
            $provider = Provider::where('user_id', $user->id)->first();

            // التأكد من وجود المزود
            if (!$provider) {
                return response()->json(['message' => 'Provider not found'], 404);
            }

            // إرجاع بيانات المزود
            return response()->json([
                'id' => $provider->id,
                'name' => $provider->name,
                'email' => $provider->email,
                'phoneNumber' => $provider->phoneNumber,
                // يمكنك إضافة المزيد من البيانات التي تريد إرجاعها
            ]);

        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token is Expired'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            // فحص رمز JWT واسترجاع المستخدم المصادق عليه
            $authUser = JWTAuth::parseToken()->authenticate();

            // فحص نوع المستخدم (تغيير الشرط إلى 0)
            if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
                DB::rollBack();
                return response()->json(['message' => 'غير مصرح لك بحذف المزودين'], 403);
            }

            $provider = Provider::find($id);

            if (!$provider) {
                DB::rollBack();
                return response()->json(['message' => 'لم يتم العثور على المزود'], 404);
            }

            $user = User::find($provider->user_id);

            if (!$user) {
                DB::rollBack();
                return response()->json(['message' => 'لم يتم العثور على المستخدم المرتبط بالمزود'], 404);
            }

            // حذف المزود أولاً
            $provider->delete();

            // ثم حذف المستخدم
            $user->delete();

            DB::commit();
            return response()->json(['message' => 'تم حذف المزود والمستخدم بنجاح']);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error deleting provider: " . $e->getMessage());
            return response()->json(['message' => 'حدث خطأ أثناء الحذف: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $provider = Provider::find($id);
        if ($provider) {
            $provider->update($request->all());
            $user = User::find($provider->user_id);
            if ($user) {
                $user->update(['name' => $request->name]);
            }
            return response()->json(['message' => 'تم تحديث المزود بنجاح']);
        }
        return response()->json(['message' => 'لم يتم العثور على المزود'], 404);
    }

    public function requestAddMed(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'address' => 'nullable|string',
                'delivery_date' => 'nullable|date',
                'type' => 'nullable|string',
                'quantity' => 'nullable|string',
                'description' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $authUser = JWTAuth::parseToken()->authenticate();

            if ($authUser->user_type !== User::USER_TYPE_PROVIDER) {
                return response()->json(['message' => 'غير مصرح لك بإضافة دواء'], 403);
            }

            $medRequest = MedRequest::create([
                'name' => $request->name,
                'address' => $request->address,
                'delivery_date' => $request->delivery_date,
                'type' => $request->type,
                'quantity' => $request->quantity,
                'provider_id' => $authUser->id,
                'description' => $request->description,
            ]);

            return response()->json(['message' => 'تم إرسال طلب إضافة الدواء بنجاح'], 201);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token is Expired'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong'], 500);
        }
    }

    public function getPendingMedRequests()
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
                return response()->json(['message' => 'غير مصرح لك بعرض طلبات الدواء'], 403);
            }

            // جلب الطلبات مع معلومات المزود
            $medRequests = MedRequest::with('provider:id,name')->get();

            return response()->json($medRequests, 200);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token is Expired'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong'], 500);
        }
    }

    public function approveMedRequest($id)
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
                return response()->json(['message' => 'غير مصرح لك بالموافقة على طلبات الدواء'], 403);
            }

            $medRequest = MedRequest::findOrFail($id);

            Medicine::create([
                'name' => $medRequest->name,
                'locations' => $medRequest->address,
                'next_distribution_date' => $medRequest->delivery_date,
                'type' => $medRequest->type,
                'distributed_quantity	' => $medRequest->quantity,
                'description'=> $medRequest->description,
                'add_by' => $medRequest->provider_id, // إضافة add_by
            ]);

            $medRequest->delete();

            return response()->json(['message' => 'تمت الموافقة على طلب إضافة الدواء بنجاح'], 200);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token is Expired'], 401);
        } catch (\Exception $e) {
            Log::error('Error approving request: ' . $e->getMessage());

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function rejectMedRequest($id)
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
                return response()->json(['message' => 'غير مصرح لك برفض طلبات الدواء'], 403);
            }

            $medRequest = MedRequest::findOrFail($id);
            $medRequest->delete();

            return response()->json(['message' => 'تم رفض طلب إضافة الدواء بنجاح'], 200);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token is Expired'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong'], 500);
        }
    }

    public function getMedRequestDetails($id): JsonResponse
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            // التحقق من صلاحية المستخدم
            if ($authUser->user_type !== User::USER_TYPE_MINISTRY && $authUser->user_type !== User::USER_TYPE_PROVIDER) {
                return response()->json(['error' => 'Unauthorized: User type mismatch'], 403);
            }

            // البحث عن طلب الدواء باستخدام الـ ID مع جلب اسم المزود
            $medRequest = MedRequest::with('provider:id,name')->find($id);

            if (!$medRequest) {
                return response()->json(['error' => 'Request not found'], 404);
            }

            // إرجاع تفاصيل طلب الدواء مع اسم المزود
            return response()->json([
                'id' => $medRequest->id,
                'name' => $medRequest->name, // اسم الدواء
                'address' => $medRequest->address, // العنوان
                'delivery_date' => $medRequest->delivery_date, // تاريخ التسليم
                'type' => $medRequest->type, // نوع الدواء
                'description' => $medRequest->description, // الوصف
                'quantity' => $medRequest->quantity, // الكمية
                'sender_name' => $medRequest->provider->name, // اسم المرسل
                'created_at' => $medRequest->created_at, // تاريخ الإنشاء
                'updated_at' => $medRequest->updated_at, // تاريخ التحديث
            ]);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token is Expired'], 401);
        } catch (\Exception $e) {
            Log::error('Error in getMedRequestDetails: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function getProviderMedicines()
    {
        // التحقق من أن المستخدم الحالي هو مزود
        $user = Auth::user();
        if ($user->user_type !== User::USER_TYPE_PROVIDER) {
            return response()->json(['error' => 'غير مصرح لك بالوصول إلى هذه البيانات.'], 403);
        }

        // جلب الأدوية التي أضافها المزود مع معلومات المستخدم ورقم الهاتف
        $med = Medicine::with('addedBy:id,phoneNumber') // جلب رقم الجوال من جدول users
        ->where('add_by', $user->id)
            ->get();

        // إعادة البيانات مع حالة الحذف
        return response()->json($med);
    }


    public function updatePatientRequest(Request $request, $id): JsonResponse
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            // التحقق من صلاحية المستخدم
            if ($authUser->user_type !== User::USER_TYPE_MINISTRY && $authUser->user_type !== User::USER_TYPE_PROVIDER) {
                return response()->json(['error' => 'Unauthorized: User type mismatch'], 403);
            }

            // البحث عن طلب المريض
            $patientRequest = PatientRequest::find($id);

            if (!$patientRequest) {
                return response()->json(['error' => 'Request not found'], 404);
            }

            // تحديث البيانات
            $patientRequest->update($request->all());

            return response()->json(['message' => 'تم تحديث طلب المريض بنجاح', 'data' => $patientRequest]);
        } catch (\Exception $e) {
            Log::error('Error updating patient request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function deletePatientRequest($id): JsonResponse
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            // التحقق من صلاحية المستخدم
            if ($authUser->user_type !== User::USER_TYPE_MINISTRY && $authUser->user_type !== User::USER_TYPE_PROVIDER) {
                return response()->json(['error' => 'Unauthorized: User type mismatch'], 403);
            }

            // البحث عن طلب المريض
            $patientRequest = PatientRequest::find($id);

            if (!$patientRequest) {
                return response()->json(['error' => 'Request not found'], 404);
            }

            // حذف الطلب
            $patientRequest->delete();

            return response()->json(['message' => 'تم حذف طلب المريض بنجاح']);
        } catch (\Exception $e) {
            Log::error('Error deleting patient request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function updateMedRequest(Request $request, $id): JsonResponse
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            // التحقق من صلاحية المستخدم
            if ($authUser->user_type !== User::USER_TYPE_MINISTRY && $authUser->user_type !== User::USER_TYPE_PROVIDER) {
                return response()->json(['error' => 'Unauthorized: User type mismatch'], 403);
            }

            // البحث عن طلب الدواء
            $medRequest = MedRequest::find($id);

            if (!$medRequest) {
                return response()->json(['error' => 'Request not found'], 404);
            }

            // تحديث البيانات
            $medRequest->update($request->all());

            return response()->json(['message' => 'تم تحديث طلب الدواء بنجاح', 'data' => $medRequest]);
        } catch (\Exception $e) {
            Log::error('Error updating med request: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function requestDeleteMedicine(Request $request, $id): JsonResponse
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            // التحقق من أن المستخدم مزود
            if ($authUser->user_type !== User::USER_TYPE_PROVIDER) {
                return response()->json(['error' => 'غير مصرح لك بإرسال طلبات الحذف'], 403);
            }

            // البحث عن الدواء
            $medicine = Medicine::find($id);

            if (!$medicine) {
                return response()->json(['error' => 'الدواء غير موجود'], 404);
            }

            // التحقق من أن المزود هو من أضاف الدواء
            if ($medicine->add_by !== $authUser->id) {
                return response()->json(['error' => 'غير مصرح لك بحذف هذا الدواء'], 403);
            }

            // إنشاء طلب حذف
            MedicineDeletionRequest::create([
                'medicine_id' => $medicine->id,
                'provider_id' => $authUser->id,
                'status' => 'pending', // حالة الطلب: pending
            ]);

            // تحديث حالة الدواء إلى "طلب حذف معلق"
            $medicine->update(['delete_status' => 1]);

            return response()->json(['message' => 'تم إرسال طلب الحذف بنجاح. انتظر موافقة الوزارة.'], 200);
        } catch (\Exception $e) {
            Log::error('Error requesting medicine deletion: ' . $e->getMessage());
            return response()->json(['error' => 'حدث خطأ أثناء إرسال طلب الحذف'], 500);
        }
    }
    public function requestDeletePatient(Request $request, $id): JsonResponse
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            // التحقق من أن المستخدم مزود
            if ($authUser->user_type !== User::USER_TYPE_PROVIDER) {
                return response()->json(['error' => 'غير مصرح لك بإرسال طلبات الحذف'], 403);
            }

            // البحث عن المريض
            $patient = Patient::find($id);

            if (!$patient) {
                return response()->json(['error' => 'المريض غير موجود'], 404);
            }

            // التحقق من أن المزود هو من أضاف المريض
            if ($patient->add_by !== $authUser->id) {
                return response()->json(['error' => 'غير مصرح لك بحذف هذا المريض'], 403);
            }

            // إنشاء طلب حذف
            PatientDeletionRequest::create([
                'patient_id' => $patient->id,
                'provider_id' => $authUser->id,
                'status' => 'pending', // حالة الطلب: pending
            ]);

            // تحديث حالة المريض إلى "طلب حذف معلق"
            $patient->update(['delete_status' => 1]);

            return response()->json(['message' => 'تم إرسال طلب الحذف بنجاح. انتظر موافقة الوزارة.'], 200);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            Log::error('Token expired: ' . $e->getMessage());
            return response()->json(['error' => 'انتهت صلاحية التوكن'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            Log::error('Invalid token: ' . $e->getMessage());
            return response()->json(['error' => 'التوكن غير صالح'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            Log::error('Token required: ' . $e->getMessage());
            return response()->json(['error' => 'التوكن مطلوب'], 401);
        } catch (\Exception $e) {
            Log::error('Error requesting patient deletion: ' . $e->getMessage());
            return response()->json(['error' => 'حدث خطأ غير متوقع أثناء إرسال طلب الحذف: ' . $e->getMessage()], 500);
        }
    }

    public function getDeletionRequests(): JsonResponse
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            // التحقق من أن المستخدم وزارة
            if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
                return response()->json(['error' => 'غير مصرح لك بعرض طلبات الحذف'], 403);
            }

            // جلب طلبات الحذف مع معلومات الأدوية والمزودين
            $deletionRequests = MedicineDeletionRequest::with(['medicine', 'provider'])
                ->where('status', 'pending')
                ->get();

            return response()->json($deletionRequests);
        } catch (\Exception $e) {
            Log::error('Error fetching deletion requests: ' . $e->getMessage());
            return response()->json(['error' => 'حدث خطأ أثناء جلب طلبات الحذف'], 500);
        }
    }
    public function getDeletionRequestsp(): JsonResponse
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            // التحقق من أن المستخدم وزارة
            if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
                return response()->json(['error' => 'غير مصرح لك بعرض طلبات الحذف'], 403);
            }

            // جلب طلبات الحذف مع معلومات الأدوية والمزودين
            $deletionRequests = PatientDeletionRequest::with(['patient', 'provider'])
                ->where('status', 'pending')
                ->get();

            return response()->json($deletionRequests);

        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            Log::error('Token expired: ' . $e->getMessage());
            return response()->json(['error' => 'انتهت صلاحية التوكن'], 401);

        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            Log::error('Invalid token: ' . $e->getMessage());
            return response()->json(['error' => 'التوكن غير صالح'], 401);

        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            Log::error('Token required: ' . $e->getMessage());
            return response()->json(['error' => 'التوكن مطلوب'], 401);

        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Database query error: ' . $e->getMessage());
            return response()->json(['error' => 'حدث خطأ في قاعدة البيانات.'], 500);

        } catch (\Exception $e) {
            Log::error('Error fetching deletion requests: ' . $e->getMessage());
            return response()->json(['error' => 'حدث خطأ غير متوقع أثناء جلب طلبات الحذف: ' . $e->getMessage()], 500);
        }
    }
    public function approveDeletionRequest($id): JsonResponse
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            // التحقق من أن المستخدم وزارة
            if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
                return response()->json(['error' => 'غير مصرح لك بالموافقة على طلبات الحذف'], 403);
            }

            // البحث عن طلب الحذف
            $deletionRequest = MedicineDeletionRequest::find($id);

            if (!$deletionRequest) {
                return response()->json(['error' => 'طلب الحذف غير موجود'], 404);
            }

            // الموافقة على الطلب
            $deletionRequest->update(['status' => 'approved']);

            // حذف الدواء المرتبط بطلب الحذف
            $deletionRequest->medicine->delete();

            return response()->json(['message' => 'تمت الموافقة على طلب الحذف وحذف الدواء بنجاح']);
        } catch (\Exception $e) {
            Log::error('Error approving deletion request: ' . $e->getMessage());
            return response()->json(['error' => 'حدث خطأ أثناء الموافقة على طلب الحذف'], 500);
        }
    }

    public function rejectDeletionRequest($id): JsonResponse
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            // التحقق من أن المستخدم وزارة
            if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
                return response()->json(['error' => 'غير مصرح لك برفض طلبات الحذف'], 403);
            }

            // البحث عن طلب الحذف
            $deletionRequest = MedicineDeletionRequest::find($id);

            if (!$deletionRequest) {
                return response()->json(['error' => 'طلب الحذف غير موجود'], 404);
            }

            // رفض الطلب
            $deletionRequest->update(['status' => 'rejected']);

            // تحديث حالة الدواء إلى "طلب حذف مرفوض"
            $medicine = $deletionRequest->medicine;
            $medicine->update(['delete_status' => 2]);

            return response()->json([
                'message' => 'تم رفض طلب الحذف بنجاح',
                'medicine' => $medicine, // إرجاع بيانات الدواء المحدثة
            ]);
        } catch (\Exception $e) {
            Log::error('Error rejecting deletion request: ' . $e->getMessage());
            return response()->json(['error' => 'حدث خطأ أثناء رفض طلب الحذف'], 500);
        }
    }

    public function approveDeletionRequestp($id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            // التحقق من أن المستخدم وزارة
            if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
                return response()->json(['error' => 'غير مصرح لك بالموافقة على طلبات الحذف'], 403);
            }

            // البحث عن طلب الحذف
            $deletionRequest = PatientDeletionRequest::find($id);

            if (!$deletionRequest) {
                DB::rollBack();
                return response()->json(['error' => 'طلب الحذف غير موجود'], 404);
            }

            // الموافقة على الطلب
            $deletionRequest->update(['status' => 'approved']);

            // حذف المريض المرتبط بطلب الحذف
            $patient = $deletionRequest->patient;

            if ($patient) {
                // البحث عن المستخدم المرتبط بالمريض باستخدام identity_number
                $user = User::where('identity_number', $patient->identity_number)->first();

                if ($user) {
                    // حذف المستخدم أولاً
                    $user->delete();
                }

                // حذف المريض من جدول المرضى
                $patient->delete();
            }

            DB::commit();
            return response()->json(['message' => 'تمت الموافقة على طلب الحذف وحذف المريض والمستخدم بنجاح']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error approving deletion request: ' . $e->getMessage());
            return response()->json(['error' => 'حدث خطأ أثناء الموافقة على طلب الحذف: ' . $e->getMessage()], 500);
        }
    }

    public function rejectDeletionRequestp($id): JsonResponse
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            // التحقق من أن المستخدم وزارة
            if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
                return response()->json(['error' => 'غير مصرح لك برفض طلبات الحذف'], 403);
            }

            // البحث عن طلب الحذف
            $deletionRequest = PatientDeletionRequest::find($id);

            if (!$deletionRequest) {
                return response()->json(['error' => 'طلب الحذف غير موجود'], 404);
            }

            // رفض الطلب
            $deletionRequest->update(['status' => 'rejected']);

            // تحديث حالة المريض إلى "طلب حذف مرفوض"
            $patient = $deletionRequest->patient;
            if ($patient) {
                $patient->update(['delete_status' => 2]);
            }

            return response()->json([
                'message' => 'تم رفض طلب الحذف بنجاح',
                'patient' => $patient, // إرجاع بيانات المريض المحدثة
            ]);
        } catch (\Exception $e) {
            Log::error('Error rejecting deletion request: ' . $e->getMessage());
            return response()->json(['error' => 'حدث خطأ أثناء رفض طلب الحذف'], 500);
        }
    }

    public function requestEditMedicine(Request $request, $id)
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            // التحقق من أن المستخدم مزود
            if ($authUser->user_type !== User::USER_TYPE_PROVIDER) {
                return response()->json(['error' => 'غير مصرح لك بإرسال طلبات التعديل'], 403);
            }

            // البحث عن الدواء
            $medicine = Medicine::find($id);

            if (!$medicine) {
                return response()->json(['error' => 'الدواء غير موجود'], 404);
            }

            // تحديث حالة التعديل في جدول الأدوية
            $medicine->update(['edit_status' => 1]); // 1: طلب تعديل معلق

            // إنشاء طلب تعديل
            MedicineEditRequest::create([
                'medicine_id' => $medicine->id,
                'provider_id' => $authUser->id,
                'updated_data' => json_encode($request->all()), // البيانات الجديدة
                'status' => 'pending', // حالة الطلب: pending
            ]);

            return response()->json(['message' => 'تم إرسال طلب التعديل بنجاح. انتظر موافقة الوزارة.'], 200);
        } catch (\Exception $e) {
            Log::error('Error requesting medicine edit: ' . $e->getMessage());
            return response()->json(['error' => 'حدث خطأ أثناء إرسال طلب التعديل'], 500);
        }
    }

    // جلب جميع طلبات تعديل الأدوية
    public function index()
    {
        $requests = MedicineEditRequest::with(['medicine', 'provider']) ->where('status', '!=', 'rejected') // استبعاد الطلبات المرفوضة
        ->get();;

        $requests = $requests->map(function ($request) {
            return [
                'id' => $request->id,
                'medicine_id' => $request->medicine_id,
                'provider_id' => $request->provider_id,
                'updated_data' => json_decode($request->updated_data, true), // البيانات الجديدة
                'status' => $request->status,
                'created_at' => $request->created_at,
                'updated_at' => $request->updated_at,
                'medicine' => $request->medicine, // البيانات القديمة
                'provider' => $request->provider,
            ];
        });

        return response()->json($requests);
    }

    // الموافقة على طلب التعديل
    public function approve($id)
    {
        $editRequest = MedicineEditRequest::findOrFail($id);

        if ($editRequest->status !== 'pending') {
            return response()->json(['message' => 'لا يمكن الموافقة على طلب غير معلق'], 400);
        }

        // تحويل updated_data من JSON إلى مصفوفة
        $updatedData = json_decode($editRequest->updated_data, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json(['message' => 'بيانات التعديل غير صالحة'], 400);
        }

        // تطبيق التعديلات على الدواء
        $medicine = $editRequest->medicine;
        $medicine->update($updatedData);

        // تحديث حالة التعديل في جدول الأدوية
        $medicine->update(['edit_status' => 0]); // 0: لا يوجد طلب تعديل

        // حذف الطلب من جدول طلبات التعديل
        $editRequest->delete();

        return response()->json(['message' => 'تمت الموافقة على طلب التعديل بنجاح']);
    }

    // رفض طلب التعديل
    public function reject($id)
    {
        $editRequest = MedicineEditRequest::findOrFail($id);

        if ($editRequest->status !== 'pending') {
            return response()->json(['message' => 'لا يمكن رفض طلب غير معلق'], 400);
        }

        // تحديث حالة التعديل في جدول الأدوية
        $medicine = $editRequest->medicine;
        $medicine->update(['edit_status' => 2]); // 2: طلب تعديل مرفوض

        $editRequest->status = 'rejected';
        $editRequest->save();

        return response()->json(['message' => 'تم رفض طلب التعديل بنجاح']);
    }

    public function requestEditPatient(Request $request, $id)
    {
        try {
            // توثيق المستخدم باستخدام التوكن
            $authUser = JWTAuth::parseToken()->authenticate();

            // التحقق من أن المستخدم مزود
            if ($authUser->user_type !== User::USER_TYPE_PROVIDER) {
                return response()->json(['error' => 'غير مصرح لك بإرسال طلبات التعديل'], 403);
            }

            // البحث عن المريض
            $patient = Patient::find($id);

            if (!$patient) {
                return response()->json(['error' => 'المريض غير موجود'], 404);
            }

            // التحقق من صحة البيانات المدخلة
            $validatedData = $request->validate([
                'identity_number' => 'required|string|max:255', // تأكد من إضافة الهوية
                'name' => 'required|string|max:255',
                'address' => 'nullable|string|max:255',
                'phoneNumber' => 'nullable|string|max:20',
                'birth_date' => 'nullable|date',
                'care_type' => 'nullable|string|max:255',
                'gender' => 'nullable|string|in:male,female',
            ]);

            // التحقق من عدم تكرار الهوية
            $existingPatient = Patient::where('identity_number', $validatedData['identity_number'])->first();
            if ($existingPatient && $existingPatient->id !== $patient->id) {
                return response()->json(['error' => 'رقم الهوية مستخدم بالفعل.'], 400);
            }

            // تحديث حالة التعديل في جدول المرضى
            $patient->update(['edit_status' => 1]); // 1: طلب تعديل معلق

            // إنشاء طلب تعديل
            PatientEditRequest::create([
                'patient_id' => $patient->id,
                'provider_id' => $authUser->id,
                'updated_data' => json_encode($validatedData), // تأكد من أن الهوية مضمنة هنا
                'status' => 'pending', // حالة الطلب: pending
            ]);

            return response()->json(['message' => 'تم إرسال طلب التعديل بنجاح. انتظر موافقة الوزارة.'], 200);

        } catch (\Exception $e) {
            // تسجيل تفاصيل الخطأ
            Log::error('Error requesting patient edit: ' . $e->getMessage());

            return response()->json(['error' => 'حدث خطأ أثناء إرسال طلب التعديل: ' . $e->getMessage()], 500);
        }
    }

    public function show()
    {
        $requests = PatientEditRequest::with(['patient', 'provider'])
            ->where('status', '!=', 'rejected') // استبعاد الطلبات المرفوضة
            ->get();

        $requests = $requests->map(function ($request) {
            return [
                'id' => $request->id,
                'patient_id' => $request->patient_id,
                'provider_id' => $request->provider_id,
                'updated_data' => json_decode($request->updated_data, true), // البيانات الجديدة
                'status' => $request->status,
                'created_at' => $request->created_at,
                'updated_at' => $request->updated_at,
                'patient' => $request->patient, // البيانات القديمة
                'provider' => $request->provider,
            ];
        });

        return response()->json($requests);
    }



    public function approvep($id)
    {
        $editRequest = PatientEditRequest::findOrFail($id);

        if ($editRequest->status !== 'pending') {
            return response()->json(['message' => 'لا يمكن الموافقة على طلب غير معلق'], 400);
        }

        // تحويل `updated_data` من JSON إلى مصفوفة
        $updatedData = json_decode($editRequest->updated_data, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json(['message' => 'بيانات التعديل غير صالحة'], 400);
        }

        // جلب بيانات المريض والمستخدم المرتبط به
        $patient = $editRequest->patient;
        $user = User::where('identity_number', $patient->identity_number)->first();

        if (!$user) {
            return response()->json(['message' => 'المستخدم غير موجود'], 404);
        }

        // ✅ تحديث جميع الحقول في `users`
        $user->update([
            'name' => $updatedData['name'] ?? $user->name,
            'identity_number' => $updatedData['identity_number'] ?? $user->identity_number,
            'phoneNumber' => $updatedData['phoneNumber'] ?? $user->phoneNumber,
            'address' => $updatedData['address'] ?? $user->address,
        ]);

        // ✅ تحديث جميع الحقول في `patients`
        $patient->update([
            'name' => $updatedData['name'] ?? $patient->name,
            'identity_number' => $updatedData['identity_number'] ?? $patient->identity_number,
            'phoneNumber' => $updatedData['phoneNumber'] ?? $patient->phoneNumber,
            'address' => $updatedData['address'] ?? $patient->address,
        ]);

        // إعادة تعيين حالة التعديل
        $patient->update(['edit_status' => 0]);

        // حذف الطلب من جدول طلبات التعديل
        $editRequest->delete();

        return response()->json(['message' => 'تمت الموافقة على طلب التعديل بنجاح']);
    }


    // رفض طلب التعديل
    public function rejectp($id)
    {
        $editRequest = PatientEditRequest::findOrFail($id);

        if ($editRequest->status !== 'pending') {
            return response()->json(['message' => 'لا يمكن رفض طلب غير معلق'], 400);
        }

        // تحديث حالة التعديل في جدول المرضى
        $patient = $editRequest->patient;
        $patient->update(['edit_status' => 2]); // 2: طلب تعديل مرفوض

        $editRequest->status = 'rejected';
        $editRequest->save();

        return response()->json(['message' => 'تم رفض طلب التعديل بنجاح']);
    }
}
