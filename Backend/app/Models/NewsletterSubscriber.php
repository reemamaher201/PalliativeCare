<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class NewsletterSubscriber extends Model
{
    use HasFactory,Notifiable;



    protected $table = 'newsletter_subscribers';

    protected $fillable = ['email'];

    public $timestamps = true;
}
