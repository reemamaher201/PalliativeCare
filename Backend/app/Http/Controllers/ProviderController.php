<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\MedicineDeletionRequest;
use App\Models\MedRequest;
use App\Models\Patient;
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
            ->get()
            ->map(function ($medicine) {
                $medicine->pending_delete = $medicine->delete_request_pending; // افتراض أن لديك هذا العمود في قاعدة البيانات
                return $medicine;
            });

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

            // Check if the user is a provider
            if ($authUser->user_type !== User::USER_TYPE_PROVIDER) {
                return response()->json(['error' => 'غير مصرح لك بإرسال طلبات الحذف'], 403);
            }

            // Search for the medicine
            $medicine = Medicine::find($id);

            if (!$medicine) {
                return response()->json(['error' => 'الدواء غير موجود'], 404);
            }

            // Check if the provider is the one who added the medicine
            if ($medicine->add_by !== $authUser->id) {
                return response()->json(['error' => 'غير مصرح لك بحذف هذا الدواء'], 403);
            }

            // Create a deletion request
            MedicineDeletionRequest::create([
                'medicine_id' => $medicine->id,
                'provider_id' => $authUser->id,
                'status' => 'pending', // Request status: pending
            ]);

            // Update the medicine's delete_request_pending flag
            $medicine->delete_request_pending = true;
            $medicine->save();

            return response()->json(['message' => 'تم إرسال طلب الحذف بنجاح. انتظر موافقة الوزارة.'], 200);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token is Expired'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['error' => 'Token is required'], 401);
        } catch (\Exception $e) {
            Log::error('Error requesting medicine deletion: ' . $e->getMessage());
            return response()->json(['error' => 'حدث خطأ أثناء إرسال طلب الحذف'], 500);
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
}
