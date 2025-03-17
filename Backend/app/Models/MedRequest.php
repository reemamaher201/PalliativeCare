<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedRequest extends Model
{
    protected $fillable = [
        'name',
        'address',
        'delivery_date',
        'type',
        'quantity',
        'description',
        'provider_id',
    ];

    /**
     * Get the provider that owns the request.
     */
    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }
}
