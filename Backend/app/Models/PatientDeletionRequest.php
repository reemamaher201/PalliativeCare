<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientDeletionRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'provider_id',
        'status',
    ];

    // العلاقة مع جدول الأدوية
    public function patients()
    {
        return $this->belongsTo(Medicine::class, 'patient_id');
    }
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }
    // العلاقة مع جدول المستخدمين (المزود)
    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

}
