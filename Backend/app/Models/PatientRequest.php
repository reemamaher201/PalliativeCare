<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'identity_number',
        'name',
        'address',
        'birth_date',
        'care_type',
        'gender',
        'provider_id',
        'phoneNumber',
    ];

    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }
}
