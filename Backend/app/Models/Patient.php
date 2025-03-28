<?php

namespace App\Models;


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
        'phoneNumber',
        'add_by',
        'delete_status',
        'edit_status',


    ];

     public function user()
    {
        return $this->belongsTo(User::class, 'identity_number', 'identity_number');
    }
    public function addedBy()
    {
        return $this->belongsTo(User::class, 'add_by');
    }

    public function deletionRequests()
    {
        return $this->hasMany(PatientDeletionRequest::class, 'patient_id');
    }
}
