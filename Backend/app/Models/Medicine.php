<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'distributed_quantity',
        'required_quantity',
        'locations',
        'next_distribution_date',
        'type', // إضافة العمود type
        'add_by',
        'delete_status', // إضافة العمود الجديد
    ];

    public function addedBy()
    {
        return $this->belongsTo(User::class, 'add_by');
    }
}
