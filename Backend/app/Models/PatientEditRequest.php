<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientEditRequest extends Model
{
    use HasFactory;

    /**
     * الحقول التي يمكن تعبئتها (Mass Assignment).
     *
     * @var array
     */
    protected $fillable = [
        'patient_id',      // معرف الدواء المراد تعديله
        'provider_id',      // معرف المزود الذي أرسل الطلب
        'updated_data',     // البيانات الجديدة التي يرغب المزود في تعديلها (يتم تخزينها كـ JSON)
        'status',           // حالة الطلب (pending, approved, rejected)
    ];

    /**
     * الحقول التي يجب إخفاؤها عند تحويل النموذج إلى JSON.
     *
     * @var array
     */
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    /**
     * الحقول التي يجب تحويلها إلى أنواع بيانات محددة.
     *
     * @var array
     */
    protected $casts = [
        'updated_data' => 'array', // تحويل updated_data من JSON إلى array عند الاسترجاع
    ];

    /**
     * العلاقة مع جدول الأدوية (Medicines).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    /**
     * العلاقة مع جدول المزودين (Providers).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function provider()
    {
        return $this->belongsTo(Provider::class, 'provider_id');
    }
}
