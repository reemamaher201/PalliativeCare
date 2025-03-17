<?php

namespace App\Models;

use App\Enums\PatientStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'identity_number',
        'name',
        'address',
        'birth_date',
        'care_type',
        'gender',
        'add_by', // إضافة add_by إلى الحقول القابلة للتعبئة

    ];

    protected $casts = [
        'status' => PatientStatus::class, // تحويل الحالة إلى Enum
    ];

    // دالة للحصول على نص الحالة
    public function getStatusLabelAttribute(): string
    {
        return $this->status->label();
    }
    // العلاقة مع جدول المستخدمين
    public function user()
    {
        return $this->belongsTo(User::class, 'identity_number', 'identity_number');
    }
    public function addedBy()
    {
        return $this->belongsTo(User::class, 'add_by');
    }
}
