<?php

namespace App\Http\Controllers;

use App\Models\PatientModificationRequest;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PatientModificationRequestController extends Controller
{
    // إرسال طلب تعديل أو حذف
    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'type' => 'required|in:update,delete',
            'data' => 'nullable|json', // بيانات التعديل (في حالة التعديل)
        ]);

        $modificationRequest = PatientModificationRequest::create([
            'patient_id' => $request->patient_id,
            'type' => $request->type,
            'data' => $request->data,
            'status' => 'pending',
            'requested_by' => Auth::id(), // المستخدم الحالي
        ]);

        return response()->json([
            'message' => 'تم إرسال الطلب بنجاح',
            'request' => $modificationRequest,
        ], 201);
    }

    // الموافقة على الطلب
    public function approve($id)
    {
        $modificationRequest = PatientModificationRequest::findOrFail($id);

        if ($modificationRequest->type === 'update') {
            // تنفيذ التعديل
            $patient = Patient::findOrFail($modificationRequest->patient_id);
            $patient->update(json_decode($modificationRequest->data, true));
        } elseif ($modificationRequest->type === 'delete') {
            // تنفيذ الحذف
            Patient::findOrFail($modificationRequest->patient_id)->delete();
        }

        $modificationRequest->update(['status' => 'approved']);

        return response()->json([
            'message' => 'تمت الموافقة على الطلب بنجاح',
        ]);
    }

    // رفض الطلب
    public function reject($id)
    {
        $modificationRequest = PatientModificationRequest::findOrFail($id);
        $modificationRequest->update(['status' => 'rejected']);

        return response()->json([
            'message' => 'تم رفض الطلب بنجاح',
        ]);
    }

    // عرض الطلبات المعلقة
    public function pendingRequests()
    {
        $requests = PatientModificationRequest::where('status', 'pending')->get();
        return response()->json($requests);
    }
}
