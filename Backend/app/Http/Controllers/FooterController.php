<?php

namespace App\Http\Controllers;

use App\Models\FastLink;
use App\Models\Social;
use Illuminate\Http\Request;

class FooterController extends Controller
{

    public function index()
    {
        $social = Social::all(); // جلب أول سجل من جدول Social
        if ($social->isNotEmpty()) {
            return response()->json($social); // إرجاع السجل إذا وجد
        } else {
            return response()->json(['message' => 'لا يوجد رابط تواصل متاح'], 404); // إرجاع رسالة إذا لم يتم العثور على سجل
        }
    }
    public function indexLink()
    {
        $fastLinks = FastLink::all(); // جلب جميع السجلات من جدول FastLink
        if ($fastLinks->isNotEmpty()) {
            return response()->json($fastLinks); // إرجاع السجلات إذا وجدت
        } else {
            return response()->json(['message' => 'لا توجد روابط سريعة متاحة'], 404); // إرجاع رسالة إذا لم يتم العثور على سجلات
        }
    }
    public function store(Request $request)
    {
        try {
            $request->validate([
                'social' => 'required|string',
            ]);

            $social = Social::create([
                'social' => $request->social,
            ]);

            return response()->json($social, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function storelink(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string',
                'link' => 'required|string',
            ]);

            $link = FastLink::create([
                'title'=>$request->title,
                'link' => $request->link,
            ]);

            return response()->json($link, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}
