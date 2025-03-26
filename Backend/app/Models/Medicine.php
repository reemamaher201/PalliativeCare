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
        'type',
        'add_by',
        'delete_status',
        'edit_status',
    ];

    public function addedBy()
    {
        return $this->belongsTo(User::class, 'add_by');
    }
}
