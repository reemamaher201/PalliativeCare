<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicineDeletionRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'medicine_id',
        'provider_id',
        'status',
    ];

    // العلاقة مع جدول الأدوية
    public function medicine()
    {
        return $this->belongsTo(Medicine::class, 'medicine_id');
    }

    // العلاقة مع جدول المستخدمين (المزود)
    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }
}
