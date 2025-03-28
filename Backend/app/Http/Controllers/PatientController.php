<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use App\Models\Patient;
use App\Models\PatientRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Tymon\JWTAuth\Facades\JWTAuth;

class PatientController extends Controller
{


    public function getUserProfile(Request $request): JsonResponse
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $patient = Patient::where('identity_number', $user->identity_number)->first();
            $birthDate = $patient->birth_date ?? null;
            $age = $birthDate ? (new \DateTime($birthDate))->diff(new \DateTime())->y : null;

            return response()->json([
                'name' => $user->name ?? 'غير معروف',
                'identity_number' => $user->identity_number ?? 'غير متوفر',
                'phoneNumber' => $user->phoneNumber ?? 'غير متوفر',
                'user_type' => $user->user_type ?? 'غير معروف',
                'address' => $patient->address ?? 'غير متوفر',
                'care_type' => $patient->care_type ?? 'غير متوفر',
                'age' => $age ?? 'غير متوفر',
                'gender' => $patient->gender ?? 'غير متوفر',
            ]);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token is Expired'], 401);
        } catch (\Exception $e) {
            Log::error('Error in getUserProfile: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function showpatient(): JsonResponse
    {
        $patients = Patient::with('user:identity_number,name,phoneNumber')
            ->whereHas('user', function ($query) {
                $query->where('user_type', User::USER_TYPE_PATIENT);
            })
            ->get()
            ->map(function ($patient) {
                return [
                    'id' => $patient->id,
                    'name' => $patient->name,
                    'identity_number' => $patient->identity_number,
                    'birth_date' => $patient->birth_date,
                    'phoneNumber' => optional($patient->user)->phoneNumber,
                    'email' => optional($patient->user)->email,
                    'created_at' => $patient->created_at,
                    'updated_at' => $patient->updated_at,
                ];
            });

        return response()->json($patients->values());
    }

    public function storepatient(Request $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $authUser = JWTAuth::parseToken()->authenticate();
            if ($authUser->user_type !== User::USER_TYPE_MINISTRY && $authUser->user_type !== User::USER_TYPE_PROVIDER) {
                DB::rollBack();
                return response()->json(['error' => 'Unauthorized: User type mismatch'], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'identity_number' => 'required|string|max:20|unique:users',
                'phoneNumber' => 'required|string|max:20',
                'password' => 'required|string|min:8',
                'address' => 'required|string|max:255',
                'birth_date' => 'required|date',
                'care_type' => 'required|string|max:255',
                'gender' => 'required|string|in:male,female',
            ]);

            if ($validator->fails()) {
                DB::rollBack();
                return response()->json(['errors' => $validator->errors()], 400);
            }

            $user = User::create([
                'name' => $request->name,
                'identity_number' => $request->identity_number,
                'phoneNumber' => $request->phoneNumber,
                'password' => Hash::make($request->password),
                'user_type' => User::USER_TYPE_PATIENT,
            ]);

            Patient::create([
                'identity_number' => $request->identity_number,
                'name' => $request->name,
                'address' => $request->address,
                'phoneNumber' => $request->phoneNumber,
                'birth_date' => $request->birth_date,
                'care_type' => $request->care_type,
                'gender' => $request->gender,
                'add_by' => $authUser->id, // إضافة add_by
            ]);

            DB::commit();
            return response()->json(['message' => 'Patient added successfully'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in storepatient: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phoneNumber' => 'required|string|max:20',
            'address' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'care_type' => 'nullable|string|max:255',
            'gender' => 'nullable|string|in:male,female',
            'identity_number' => 'required|string|max:50|unique:users,identity_number,' . $id
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $patient = Patient::find($id);
        if ($patient) {
            $oldIdentityNumber = $patient->identity_number;

            $patient->update([
                'identity_number' => $request->identity_number,
                'name' => $request->name,
                'address' => $request->address,
                'birth_date' => $request->birth_date,
                'care_type' => $request->care_type,
                'gender' => $request->gender,
                'add_by' => $patient->add_by,
            ]);

            $user = User::where('identity_number', $oldIdentityNumber)->first();
            if ($user) {
                $user->update([
                    'identity_number' => $request->identity_number,
                    'name' => $request->name,
                    'phoneNumber' => $request->phoneNumber,
                ]);
            }

            return response()->json(['message' => 'Patient updated successfully', 'patient' => $patient]);
        }

        return response()->json(['message' => 'Patient not found'], 404);
    }

    public function destroy($id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $authUser = JWTAuth::parseToken()->authenticate();
            if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
                DB::rollBack();
                return response()->json(['error' => 'Unauthorized: User type mismatch'], 403);
            }

            $patient = Patient::find($id);
            if (!$patient) {
                DB::rollBack();
                return response()->json(['message' => 'Patient not found'], 404);
            }

            $user = User::where('identity_number', $patient->identity_number)->first();
            if (!$user) {
                DB::rollBack();
                return response()->json(['message' => 'User associated with patient not found'], 404);
            }

            $patient->delete();
            $user->delete();

            DB::commit();
            return response()->json(['message' => 'Patient and associated user deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in destroy: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function checkIdentityNumber($identityNumber): JsonResponse
    {
        try {
            $existsInPatients = Patient::where('identity_number', $identityNumber)->exists();
            $existsInRequests = PatientRequest::where('identity_number', $identityNumber)->exists();

            if ($existsInPatients || $existsInRequests) {
                return response()->json(['exists' => true], 200);
            }

            return response()->json(['exists' => false], 200);
        } catch (\Exception $e) {
            Log::error('Error in checkIdentityNumber: ' . $e->getMessage());
            return response()->json(['error' => 'حدث خطأ أثناء التحقق من رقم الهوية.'], 500);
        }
    }
    public function requestAddPatient(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'identity_number' => 'required|string|unique:users',
                'name' => 'required|string',
                'address' => 'nullable|string',
                'birth_date' => 'nullable|date',
                'care_type' => 'nullable|string',
                'gender' => 'nullable|string',
                'phoneNumber' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $authUser = JWTAuth::parseToken()->authenticate();

            if ($authUser->user_type !== User::USER_TYPE_PROVIDER) {
                return response()->json(['message' => 'غير مصرح لك بإضافة مريض'], 403);
            }

            $patientRequest = PatientRequest::create([
                'identity_number' => $request->identity_number,
                'name' => $request->name,
                'address' => $request->address,
                'birth_date' => $request->birth_date,
                'care_type' => $request->care_type,
                'gender' => $request->gender,
                'provider_id' => $authUser->id,
                'phoneNumber' => $request->phoneNumber,
            ]);

            return response()->json(['message' => 'تم إرسال طلب إضافة المريض بنجاح'], 201);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token is Expired'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong'], 500);
        }
    }

    public function approvePatientRequest($id)
    {
        Log::info('Approve request ID: ' . $id);
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
                return response()->json(['message' => 'غير مصرح لك بالموافقة على طلبات المرضى'], 403);
            }

            $patientRequest = PatientRequest::findOrFail($id);

            if (User::where('identity_number', $patientRequest->identity_number)->exists()) {
                return response()->json(['message' => 'رقم الهوية مستخدم بالفعل'], 400);
            }

            $user = User::create([
                'identity_number' => $patientRequest->identity_number,
                'name' => $patientRequest->name,
                'password' => Hash::make('password'),
                'address' => $patientRequest->address,
                'user_type' => User::USER_TYPE_PATIENT,
                'phoneNumber' => $patientRequest->phoneNumber,
            ]);

            Patient::create([
                'identity_number' => $user->identity_number,
                'name' => $user->name,
                'address' => $user->address,
                'birth_date' => $patientRequest->birth_date,
                'care_type' => $patientRequest->care_type,
                'gender' => $patientRequest->gender,
                'phoneNumber' => $patientRequest->phoneNumber,
                'add_by' => $patientRequest->provider_id,
            ]);

            $patientRequest->delete();

            return response()->json(['message' => 'تمت الموافقة على طلب إضافة المريض بنجاح'], 200);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token is Expired'], 401);
        } catch (\Exception $e) {
            Log::error('Error approving request: ' . $e->getMessage());

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function rejectPatientRequest($id)
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
                return response()->json(['message' => 'غير مصرح لك برفض طلبات المرضى'], 403);
            }

            $patientRequest = PatientRequest::findOrFail($id);
            $patientRequest->delete();

            return response()->json(['message' => 'تم رفض طلب إضافة المريض بنجاح'], 200);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token is Expired'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong'], 500);
        }
    }

    public function getPatientRequestDetails($id): JsonResponse
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            if ($authUser->user_type !== User::USER_TYPE_MINISTRY && $authUser->user_type !== User::USER_TYPE_PROVIDER) {
                return response()->json(['error' => 'Unauthorized: User type mismatch'], 403);
            }

            $patientRequest = PatientRequest::with('provider:id,name')->find($id);

            if (!$patientRequest) {
                return response()->json(['error' => 'Request not found'], 404);
            }

            return response()->json([
                'id' => $patientRequest->id,
                'identity_number' => $patientRequest->identity_number,
                'name' => $patientRequest->name,
                'address' => $patientRequest->address,
                'birth_date' => $patientRequest->birth_date,
                'care_type' => $patientRequest->care_type,
                'gender' => $patientRequest->gender,
                'phoneNumber' => $patientRequest->phoneNumber,
                'sender_name' => $patientRequest->provider->name,
                'created_at' => $patientRequest->created_at,
                'updated_at' => $patientRequest->updated_at,
            ]);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token is Expired'], 401);
        } catch (\Exception $e) {
            Log::error('Error in getPatientRequestDetails: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
    public function getPendingPatientRequests()
    {
        try {
            $authUser = JWTAuth::parseToken()->authenticate();

            if ($authUser->user_type !== User::USER_TYPE_MINISTRY) {
                return response()->json(['message' => 'غير مصرح لك بعرض طلبات المرضى'], 403);
            }

            $patientRequests = PatientRequest::with('provider:id,name')->get();

            return response()->json($patientRequests, 200);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid Token'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token is Expired'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong'], 500);
        }
    }



    public function getProviderPatients()
    {
        $user = Auth::user();
        if ($user->user_type !== User::USER_TYPE_PROVIDER) {
            return response()->json(['error' => 'غير مصرح لك بالوصول إلى هذه البيانات.'], 403);
        }

        $patient = Patient::with('addedBy:id,phoneNumber')
        ->where('add_by', $user->id)
            ->get();

        return response()->json($patient);
    }

    public function updateProfile(Request $request) {
        try {
            // (1) جلب المستخدم الحالي من الـ Token
            $user = JWTAuth::parseToken()->authenticate();

            // (2) إذا لم يتم العثور على المستخدم
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'المستخدم غير موجود أو غير مصرح له'
                ], 404);
            }

            // (3) تحديث البيانات
            $user->update($request->all());

            return response()->json([
                'success' => true,
                'user' => $user,
                'message' => 'تم تحديث الملف الشخصي بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل في التحديث: ' . $e->getMessage()
            ], 500);
        }
    }
}

