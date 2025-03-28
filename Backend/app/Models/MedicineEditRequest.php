<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicineEditRequest extends Model
{
    use HasFactory;


    protected $fillable = [
        'medicine_id',
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


    public function medicine()
    {
        return $this->belongsTo(Medicine::class, 'medicine_id');
    }


    public function provider()
    {
        return $this->belongsTo(Provider::class, 'provider_id');
    }
}
