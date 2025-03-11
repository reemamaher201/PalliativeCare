<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingPage extends Model {
    protected $fillable = ['title', 'about', 'features', 'services', 'tips', 'footer'];
    protected $casts = [
        'features' => 'array',
        'services' => 'array',
        'tips' => 'array',
        'footer' => 'array'
    ];
}
