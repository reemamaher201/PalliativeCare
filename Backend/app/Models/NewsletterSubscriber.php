<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class NewsletterSubscriber extends Model
{
    use HasFactory,Notifiable;



    protected $table = 'newsletter_subscribers'; // اسم الجدول في قاعدة البيانات

    protected $fillable = ['email']; // الحقول التي يمكن تعبئتها تلقائيًا

    public $timestamps = true; // لتخزين تاريخ الإنشاء والتحديث تلقائيًا
}
