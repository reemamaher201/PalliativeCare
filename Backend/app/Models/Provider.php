<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    use HasFactory;

// App\Models\Provider.php
    protected $fillable = [
        'user_id',
        'name',
        'identity_number',
        'username',
        'password',
        'phoneNumber',
        'email',
        'address',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
