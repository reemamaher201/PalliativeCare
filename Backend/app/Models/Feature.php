<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    Use HasFactory;
    protected $fillable = [
        'title',
        'content',
        'icon',
        'image',
    ];
}
