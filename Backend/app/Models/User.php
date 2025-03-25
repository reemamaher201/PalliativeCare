<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Cache;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    // تعريف ثوابت لأنواع المستخدمين
    const USER_TYPE_MINISTRY = 0;
    const USER_TYPE_PROVIDER = 1;
    const USER_TYPE_PATIENT = 2;
    const USER_TYPE_ADMIN = 3;

    protected $fillable = [
        'name',
        'phoneNumber',
        'identity_number',
        'password',
        'address',
        'user_type',
        'last_login_at',
        'remember_token',
        'is_active',

    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'phoneNumber_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
    public function username()
    {
        return 'identity_number';
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'user_type' => $this->user_type,
        ];
    }

    public function provider()
    {
        return $this->hasOne(Provider::class, 'user_id', 'id');
    }

    public function patient()
    {
        return $this->hasOne(Patient::class, 'identity_number', 'identity_number');
    }
    public function addedPatients()
    {
        return $this->hasMany(Patient::class, 'add_by');
    }

    public function medrequests()
    {
        return $this->hasMany(PatientRequest::class, 'provider_id');
    }
    public function getIsOnlineAttribute()
    {
        return Cache::has('user-is-online-' . $this->id);
    }
}
