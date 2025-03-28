<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'logo',
        'imgabout',
        'main_heading_ar',
        'main_text_ar',
        'footer_text_ar',
        'main_heading_en',
        'main_text_en',
        'footer_text_en',
        'background_color',
        'button_color',
    ];
}
