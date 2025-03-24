<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use App\Notifications\WelcomeNewsletter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        // التأكد من وجود البريد الإلكتروني في الطلب
        if (!$request->has('email')) {
            return response()->json([
                'message' => 'البريد الإلكتروني مطلوب'
            ], 400);
        }

        // التحقق من صحة البيانات
        $request->validate([
            'email' => 'required|email|unique:newsletter_subscribers,email'
        ]);

        try {
            // إنشاء سجل جديد في قاعدة البيانات
            $subscriber = NewsletterSubscriber::create(['email' => $request->email]);

            // إرسال البريد الإلكتروني الترحيبي
            $subscriber->notify(new WelcomeNewsletter($subscriber));

            // إظهار صفحة الترحيب بدلاً من رد JSON
            return view('welcome_newsletter', ['subscriber' => $subscriber]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'حدث خطأ أثناء محاولة الاشتراك',
                'error' => $e->getMessage()
            ], 500);
        }
    }

//    public function getSubscribers()
//    {
//        return response()->json(NewsletterSubscriber::all());
//    }
//
//    public function sendNewsletter(Request $request)
//    {
//        $request->validate(['content' => 'required']);
//
//        $subscribers = NewsletterSubscriber::all();
//
//        foreach ($subscribers as $subscriber) {
//            Mail::to($subscriber->email)->send(new NewsletterMail($request->content));
//        }
//
//        return response()->json(["message" => "تم إرسال البريد بنجاح"], 200);
//    }
}
