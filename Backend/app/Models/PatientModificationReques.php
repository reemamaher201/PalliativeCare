<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientModificationRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'type', // update أو delete
        'data', // بيانات التعديل (في حالة التعديل)
        'status', // pending, approved, rejected
        'requested_by', // المستخدم الذي أرسل الطلب
    ];

    // العلاقة مع جدول المرضى
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    // العلاقة مع جدول المستخدمين
    public function requester()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }
}
