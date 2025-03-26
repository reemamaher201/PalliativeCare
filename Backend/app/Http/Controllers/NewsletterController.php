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
        if (!$request->has('email')) {
            return response()->json([
                'message' => 'البريد الإلكتروني مطلوب'
            ], 400);
        }
        $request->validate([
            'email' => 'required|email|unique:newsletter_subscribers,email'
        ]);

        try {

            $subscriber = NewsletterSubscriber::create(['email' => $request->email]);


            $subscriber->notify(new WelcomeNewsletter($subscriber));

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
