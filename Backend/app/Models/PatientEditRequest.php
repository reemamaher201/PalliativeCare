<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientEditRequest extends Model
{
    use HasFactory;


    protected $fillable = [
        'patient_id',
        'provider_id',
        'updated_data',
        'status',
    ];


    protected $hidden = [
        'created_at',
        'updated_at',
    ];


    protected $casts = [
        'updated_data' => 'array',
    ];


    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }


    public function provider()
    {
        return $this->belongsTo(Provider::class, 'provider_id');
    }
}
